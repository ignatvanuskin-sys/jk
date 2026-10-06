import type { Locale } from '@/i18n/config';

export type IsoDateKind = 'date' | 'month' | 'date-time';

const LOCALE_TAGS: Record<Locale, string> = {
  ru: 'ru-RU',
  kz: 'kk-KZ',
  en: 'en-US',
};

function parseIso(value: string, kind: IsoDateKind): Date {
  const normalized = kind === 'month' ? `${value}-01T12:00:00Z` : value.length === 10 ? `${value}T12:00:00Z` : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) throw new RangeError(`Invalid ISO ${kind}: ${value}`);
  return date;
}

/** Formats ISO dates without leaking machine-oriented date strings into UI. */
export function formatIsoDate(value: string, locale: Locale, kind: IsoDateKind = 'date'): string {
  const options: Intl.DateTimeFormatOptions =
    kind === 'month'
      ? { month: 'long', year: 'numeric', timeZone: 'UTC' }
      : kind === 'date-time'
        ? { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }
        : { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };

  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], options).format(parseIso(value, kind));
}
