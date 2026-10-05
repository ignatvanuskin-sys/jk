/**
 * Lead validation — the single source of truth for both the browser and the
 * API route. The client uses it for instant feedback; the server re-runs it on
 * every request because client validation is a UX affordance, never a security
 * control.
 *
 * Sanitisation rules:
 *   • strings are trimmed and control characters are stripped,
 *   • lengths are capped before anything touches storage or a webhook,
 *   • the phone number is normalised to a single canonical form,
 *   • nothing is ever rendered back as HTML.
 */

export const LEAD_LIMITS = {
  name: { min: 2, max: 60 },
  comment: { max: 600 },
  interest: { max: 80 },
  subject: { max: 160 },
  source: { max: 60 },
} as const;

export type LeadErrorCode =
  | 'name_required'
  | 'name_short'
  | 'phone_required'
  | 'phone_invalid'
  | 'consent_required'
  | 'comment_long'
  | 'rate_limited';

export interface LeadInput {
  name?: unknown;
  phone?: unknown;
  interest?: unknown;
  comment?: unknown;
  consent?: unknown;
  subject?: unknown;
  source?: unknown;
  /** Honeypot — must stay empty. */
  website?: unknown;
}

export interface LeadData {
  name: string;
  /** Normalised to +7XXXXXXXXXX. */
  phone: string;
  phoneDisplay: string;
  interest: string;
  comment: string;
  subject: string;
  source: string;
  submittedAt: string;
}

export type ValidationResult =
  | { ok: true; data: LeadData }
  | { ok: false; errors: LeadErrorCode[] };

/** Removes control characters and collapses repeated whitespace. */
export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Digits only, capped at 11, `8` prefix coerced to `7`. */
export function normalisePhoneDigits(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  else if (digits && !digits.startsWith('7')) digits = `7${digits}`;
  return digits.slice(0, 11);
}

/**
 * Progressive display format: `+7 700 000 00 00`.
 * Implemented as a pure function so the input mask and the server never
 * disagree about what a valid number looks like.
 */
export function formatPhoneDisplay(value: string): string {
  const digits = normalisePhoneDigits(value);
  if (!digits) return '';
  if (digits.length <= 1) return '+7';
  const groups = [`+7`, digits.slice(1, 4), digits.slice(4, 7), digits.slice(7, 9), digits.slice(9, 11)];
  return groups.filter(Boolean).join(' ');
}

export function isCompletePhone(value: string): boolean {
  return normalisePhoneDigits(value).length === 11;
}

export function toE164(value: string): string {
  return `+${normalisePhoneDigits(value)}`;
}

/** Shape the same way on the client and on the server. */
export function buildLeadData(input: LeadInput): ValidationResult {
  const errors: LeadErrorCode[] = [];

  const name = cleanText(input.name, LEAD_LIMITS.name.max);
  if (!name) errors.push('name_required');
  else if (name.length < LEAD_LIMITS.name.min) errors.push('name_short');

  const phoneRaw = typeof input.phone === 'string' ? input.phone : '';
  if (!phoneRaw.trim()) errors.push('phone_required');
  else if (!isCompletePhone(phoneRaw)) errors.push('phone_invalid');

  if (input.consent !== true && input.consent !== 'true' && input.consent !== 'on') {
    errors.push('consent_required');
  }

  const comment = cleanText(input.comment, LEAD_LIMITS.comment.max);
  if (typeof input.comment === 'string' && input.comment.trim().length > LEAD_LIMITS.comment.max) {
    errors.push('comment_long');
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      name,
      phone: toE164(phoneRaw),
      phoneDisplay: formatPhoneDisplay(phoneRaw),
      interest: cleanText(input.interest, LEAD_LIMITS.interest.max),
      comment,
      subject: cleanText(input.subject, LEAD_LIMITS.subject.max),
      source: cleanText(input.source, LEAD_LIMITS.source.max) || 'unknown',
      submittedAt: new Date().toISOString(),
    },
  };
}
