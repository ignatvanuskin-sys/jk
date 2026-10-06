'use client';

import Link from 'next/link';
import { useId, useRef, useState, type FormEvent } from 'react';

import type { Locale } from '@/i18n/config';
import type { LeadLabels } from './types';
import {
  buildLeadData,
  cleanText,
  formatPhoneDisplay,
  LEAD_LIMITS,
  type LeadErrorCode,
} from '@/lib/lead-schema';
import { cn } from '@/lib/cn';

interface LeadFormProps {
  locale: Locale;
  labels: LeadLabels;
  /** Where the lead came from — hero, apartment card, floor-plan modal… */
  source: string;
  /** Optional preset shown to the user and sent with the lead. */
  subject?: string;
  /** Rendered as a heading when the form is inline rather than in a modal. */
  showHeading?: boolean;
  className?: string;
  onSuccess?: () => void;
}

const INTEREST_VALUES = [
  'studio',
  'one',
  'two',
  'three',
  'four',
  'commercial',
  'parking',
  'advice',
] as const;

type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * Validation codes are snake_case (they travel to the API as-is); dictionary
 * keys are camelCase. This map is the single place the two meet, so a new error
 * code cannot silently render as an empty message.
 */
const ERROR_KEY: Record<LeadErrorCode, keyof LeadLabels['errors']> = {
  name_required: 'nameRequired',
  name_short: 'nameShort',
  phone_required: 'phoneRequired',
  phone_invalid: 'phoneInvalid',
  consent_required: 'consentRequired',
  comment_long: 'commentLong',
  rate_limited: 'rateLimit',
};

/**
 * The lead form.
 *
 * Design decisions taken from the market research:
 *   • three inputs, never ten — name, phone, what they are interested in,
 *   • an explicit consent checkbox with a link to the policy (required in KZ),
 *   • a real success screen that offers the second-best action (WhatsApp),
 *   • errors rendered next to the field AND summarised for screen readers,
 *   • a honeypot field instead of a CAPTCHA — no third-party script, no
 *     friction, and it keeps the form's accessibility intact.
 */
export function LeadForm({
  locale,
  labels,
  source,
  subject,
  showHeading = true,
  className,
  onSuccess,
}: LeadFormProps) {
  const uid = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<LeadErrorCode[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(false);
  const successRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  /**
   * Blocks a second submit while the first is still in flight. The button does
   * disable on `status === 'sending'`, but that state lands a render later, so
   * three fast taps fired three POSTs and produced three identical leads.
   */
  const sendingRef = useRef(false);
  /**
   * False when the endpoint accepted the request but captured it nowhere: no
   * Telegram, no webhook, and on a serverless host the local JSON-lines fallback
   * has no writable disk. The visitor must not be told "we will call you" when
   * nobody will.
   */
  const [delivered, setDelivered] = useState(true);

  const fieldId = (field: string) => `${uid}-${field}`;
  const errorId = (field: string) => `${uid}-${field}-error`;
  const hasError = (code: LeadErrorCode) => errors.includes(code);

  const interestOptions = INTEREST_VALUES.map((value) => ({
    value,
    label: labels.interestOptions[value],
  }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current) return;
    setErrors([]);

    const form = event.currentTarget;
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';

    // Mirror the server validation so the user gets an instant answer.
    const result = buildLeadData({ name, phone, interest, comment, consent, subject, source });
    if (!result.ok) {
      setErrors(result.errors);
      setStatus('idle');
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    sendingRef.current = true;
    setStatus('sending');
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: result.data.name,
          phone: result.data.phone,
          interest: result.data.interest,
          comment: result.data.comment,
          subject: result.data.subject,
          source: result.data.source,
          // Already validated on the client; the server re-validates anyway.
          consent: true,
          website: honeypot,
        }),
      });

      if (response.status === 429) {
        setErrors(['rate_limited']);
        setStatus('error');
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; delivered?: boolean; fields?: LeadErrorCode[] }
        | null;

      if (!response.ok || !payload?.ok) {
        if (payload?.fields?.length) {
          setErrors(payload.fields);
          setStatus('idle');
          requestAnimationFrame(() => summaryRef.current?.focus());
          return;
        }
        setStatus('error');
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }

      setDelivered(payload.delivered !== false);
      setStatus('success');
      onSuccess?.();
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus('error');
      requestAnimationFrame(() => summaryRef.current?.focus());
    } finally {
      sendingRef.current = false;
    }
  }

  function resetForm() {
    setName('');
    setPhone('');
    setInterest('');
    setComment('');
    setConsent(false);
    setErrors([]);
    setStatus('idle');
  }

  if (status === 'success') {
    return (
      <div className={cn('p-6 sm:p-8', className)}>
        <div
          className={cn(
            'mb-4 flex size-12 items-center justify-center rounded-full',
            delivered ? 'bg-pine/10 text-pine' : 'bg-clay/10 text-clay',
          )}
        >
          {delivered ? (
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
              <path
                d="M4 12.5l5 5L20 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            /* No checkmark: nothing was captured, and a green tick here would be
               the exact lie this state exists to avoid. */
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
              <path
                d="M12 6.5v7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
              <circle cx="12" cy="17.6" r="1.25" fill="currentColor" />
            </svg>
          )}
        </div>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="font-display text-3xl leading-tight text-ink outline-none"
        >
          {delivered ? labels.successTitle : labels.successUndeliveredTitle}
        </h3>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
          {delivered ? labels.successText : labels.successUndeliveredText}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={labels.phoneHref} className="btn btn-primary">
            {labels.successCall}
          </a>
          <a
            href={labels.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            {labels.whatsapp}
            <span className="sr-only"> ({labels.externalLink})</span>
          </a>
          <button type="button" onClick={resetForm} className="btn btn-outline">
            {labels.successAgain}
          </button>
        </div>
        <p className="mt-5 text-xs text-muted">{labels.phoneDisplay}</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={cn('p-6 sm:p-8', className)}
      aria-labelledby={showHeading ? `${uid}-title` : undefined}
    >
      {showHeading && (
        <>
          <h3 id={`${uid}-title`} className="font-display text-3xl leading-tight text-ink">
            {labels.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{labels.lead}</p>
        </>
      )}

      {/* Error summary — focusable so keyboard and screen-reader users land on it. */}
      {errors.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 rounded-sm border border-danger/40 bg-danger/5 p-3 text-sm text-danger outline-none"
        >
          <ul className="space-y-1">
            {errors.map((code) => (
              <li key={code}>{labels.errors[ERROR_KEY[code]]}</li>
            ))}
          </ul>
        </div>
      )}

      {status === 'error' && errors.length === 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 rounded-sm border border-danger/40 bg-danger/5 p-3 text-sm text-danger outline-none"
        >
          {labels.errors.generic}
        </div>
      )}

      {subject && (
        <p className="mt-5 border-l-2 border-clay pl-3 text-sm text-ink-soft">
          <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
            {labels.subjectLabel}
          </span>
          {subject}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor={fieldId('name')} className="mb-1.5 block text-sm font-medium text-ink">
            {labels.name}
          </label>
          <input
            id={fieldId('name')}
            name="name"
            type="text"
            autoComplete="name"
            required
            className="field"
            placeholder={labels.namePlaceholder}
            value={name}
            aria-invalid={hasError('name_required') || hasError('name_short')}
            aria-describedby={
              hasError('name_required') || hasError('name_short') ? errorId('name') : undefined
            }
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setName((value) => cleanText(value, LEAD_LIMITS.name.max))}
          />
          {(hasError('name_required') || hasError('name_short')) && (
            <p id={errorId('name')} className="mt-1.5 text-xs text-danger">
              {hasError('name_required') ? labels.errors.nameRequired : labels.errors.nameShort}
            </p>
          )}
        </div>

        <div className="sm:col-span-1">
          <label htmlFor={fieldId('phone')} className="mb-1.5 block text-sm font-medium text-ink">
            {labels.phone}
          </label>
          <input
            id={fieldId('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className="field num"
            placeholder={labels.phonePlaceholder}
            value={phone}
            aria-invalid={hasError('phone_required') || hasError('phone_invalid')}
            aria-describedby={
              hasError('phone_required') || hasError('phone_invalid') ? errorId('phone') : undefined
            }
            onChange={(event) => setPhone(formatPhoneDisplay(event.target.value))}
          />
          {(hasError('phone_required') || hasError('phone_invalid')) && (
            <p id={errorId('phone')} className="mt-1.5 text-xs text-danger">
              {hasError('phone_required') ? labels.errors.phoneRequired : labels.errors.phoneInvalid}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={fieldId('interest')} className="mb-1.5 block text-sm font-medium text-ink">
            {labels.interest}
          </label>
          <select
            id={fieldId('interest')}
            name="interest"
            className="field"
            value={interest}
            onChange={(event) => setInterest(event.target.value)}
          >
            <option value="">{labels.interestPlaceholder}</option>
            {interestOptions.map((option) => (
              <option key={option.value} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={fieldId('comment')} className="mb-1.5 block text-sm font-medium text-ink">
            {labels.comment}{' '}
            <span className="font-normal text-muted">— {labels.commentPlaceholder}</span>
          </label>
          <textarea
            id={fieldId('comment')}
            name="comment"
            rows={3}
            maxLength={LEAD_LIMITS.comment.max}
            className="field resize-y"
            placeholder={labels.commentPlaceholder}
            value={comment}
            aria-invalid={hasError('comment_long')}
            aria-describedby={hasError('comment_long') ? errorId('comment') : undefined}
            onChange={(event) => setComment(event.target.value)}
          />
          {hasError('comment_long') && (
            <p id={errorId('comment')} className="mt-1.5 text-xs text-danger">
              {labels.errors.commentLong}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot. Invisible to people — visually hidden, out of the tab order
          and out of the accessibility tree — but still present in the markup, so
          a bot that fills every field it finds reveals itself. `display: none`
          is set inline (not just via the `hidden` attribute) so no stylesheet
          can resurrect it, and it keeps the field out of the rendered text too,
          so it can never surface as a stray "Website" label. */}
      <div aria-hidden="true" style={{ display: 'none' }}>
        <label htmlFor={fieldId('website')} aria-hidden="true">
          Website
        </label>
        <input
          id={fieldId('website')}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      <div className="mt-5 flex items-start gap-3">
        <input
          id={fieldId('consent')}
          name="consent"
          type="checkbox"
          required
          checked={consent}
          aria-invalid={hasError('consent_required')}
          aria-describedby={hasError('consent_required') ? errorId('consent') : undefined}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 size-5 flex-none accent-[var(--color-pine)]"
        />
        <label htmlFor={fieldId('consent')} className="text-xs leading-relaxed text-ink-soft">
          {labels.consent}{' '}
          <Link
            href={`/${locale}/privacy`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-line underline-offset-2 hover:text-clay"
          >
            {labels.privacyLink}
            <span className="sr-only"> ({labels.externalLink})</span>
          </Link>
        </label>
      </div>
      {hasError('consent_required') && (
        <p id={errorId('consent')} className="mt-1.5 text-xs text-danger">
          {labels.errors.consentRequired}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === 'sending'}>
          {status === 'sending' ? labels.sending : labels.submit}
        </button>
        <a
          href={labels.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline w-full sm:w-auto"
        >
          {labels.whatsapp}
          <span className="sr-only"> ({labels.externalLink})</span>
        </a>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{labels.guaranteed}</p>
    </form>
  );
}
