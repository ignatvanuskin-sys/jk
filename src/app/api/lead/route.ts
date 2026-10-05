import { NextResponse, type NextRequest } from 'next/server';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

import { buildLeadData, LEAD_LIMITS, cleanText, type LeadData } from '@/lib/lead-schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Lead intake.
 *
 * This is a REAL endpoint, not a fake success animation:
 *   1. the body is size-checked, parsed and re-validated on the server,
 *   2. the honeypot field is checked (silently accepted, never stored),
 *   3. a simple per-IP rate limit is applied,
 *   4. the lead is delivered through whichever channels are configured —
 *      Telegram bot, a generic webhook (Bitrix24 / amoCRM / Make / n8n) —
 *      and always appended to a local JSON-lines file so nothing is lost
 *      if a channel is down.
 *
 * Configure channels in .env.local (see .env.example). With no configuration
 * the endpoint still works and stores the lead under data/leads/.
 */

const MAX_BODY_BYTES = 4_096;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;

/** In-memory limiter. Fine for a single-node deployment; swap for Redis at scale. */
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Housekeeping so the map cannot grow without bound.
  if (hits.size > 5_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return (forwarded?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'local').trim();
}

/** Human-readable one-liner for Telegram / webhook consumers. */
function formatLead(lead: LeadData): string {
  return [
    '🏠 Новая заявка с сайта ЖК',
    '',
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phoneDisplay}`,
    lead.interest ? `Интересует: ${lead.interest}` : null,
    lead.subject ? `Тема: ${lead.subject}` : null,
    lead.comment ? `Комментарий: ${lead.comment}` : null,
    `Источник: ${lead.source}`,
    `Время: ${lead.submittedAt}`,
  ]
    .filter(Boolean)
    .join('\n');
}

async function deliverToTelegram(lead: LeadData): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: formatLead(lead), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8_000),
    });
    return response.ok;
  } catch (error) {
    console.error('[lead] telegram delivery failed', error);
    return false;
  }
}

async function deliverToWebhook(lead: LeadData): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(process.env.LEAD_WEBHOOK_SECRET
          ? { 'x-lead-secret': process.env.LEAD_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({ ...lead, site: 'zhk', page: lead.source }),
      signal: AbortSignal.timeout(8_000),
    });
    return response.ok;
  } catch (error) {
    console.error('[lead] webhook delivery failed', error);
    return false;
  }
}

async function storeLocally(lead: LeadData): Promise<boolean> {
  try {
    const dir = process.env.LEAD_STORE_DIR
      ? path.resolve(process.env.LEAD_STORE_DIR)
      : path.join(process.cwd(), 'data', 'leads');
    await mkdir(dir, { recursive: true });
    const file = path.join(dir, `leads-${lead.submittedAt.slice(0, 10)}.jsonl`);
    await appendFile(file, `${JSON.stringify(lead)}\n`, 'utf8');
    return true;
  } catch (error) {
    console.error('[lead] local storage failed', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const raw = await request.text();

  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: 'payload_too_large' }, { status: 413 });
  }

  if (rateLimited(clientKey(request))) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || '{}');
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  const body = parsed as Record<string, unknown>;

  // Honeypot: a bot fills every field it finds. Accept silently, store nothing.
  if (cleanText(body.website, 10).length > 0) {
    return NextResponse.json({ ok: true, delivered: false }, { status: 200 });
  }

  const result = buildLeadData({
    name: body.name,
    phone: body.phone,
    interest: body.interest,
    comment: body.comment,
    consent: body.consent,
    subject: cleanText(body.subject, LEAD_LIMITS.subject.max),
    source: body.source,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: 'validation_failed', fields: result.errors }, { status: 422 });
  }

  const [telegram, webhook, stored] = await Promise.all([
    deliverToTelegram(result.data),
    deliverToWebhook(result.data),
    storeLocally(result.data),
  ]);

  // The visitor's request succeeded as long as we captured the lead somewhere.
  const delivered = telegram || webhook || stored;
  if (!delivered) {
    console.error('[lead] lead could not be delivered through any channel', result.data.phone);
  }

  return NextResponse.json({ ok: true, delivered }, { status: 200 });
}

export async function GET() {
  // No lead data is ever exposed over GET.
  return NextResponse.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
}
