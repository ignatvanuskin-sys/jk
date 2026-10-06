/**
 * i18n configuration.
 *
 * Per the market research, RU/KZ/EN must live on separate URLs (not a client-side
 * toggle) so each version can be indexed, hreflang-linked and shared independently.
 * `ru` is the x-default because the majority of search demand in KZ is Russian.
 */

export const locales = ['ru', 'kz', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ru';

/** Locale used for `hreflang="x-default"`. */
export const xDefaultLocale: Locale = 'ru';

/** BCP-47 tags for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = {
  ru: 'ru-KZ',
  kz: 'kk-KZ',
  en: 'en',
};

/** Short labels shown in the RU | KZ | EN switcher. */
export const localeLabel: Record<Locale, string> = {
  ru: 'RU',
  kz: 'KZ',
  en: 'EN',
};

/** Full names for accessible labels ("Переключить на казахский язык"). */
export const localeName: Record<Locale, string> = {
  ru: 'Русский',
  kz: 'Қазақша',
  en: 'English',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Locale-aware price formatting: "62 400 000 ₸" */
export function formatPrice(value: number, locale: Locale = defaultLocale): string {
  const formatted = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ru-RU', {
    maximumFractionDigits: 0,
  }).format(value);
  return `${formatted} ₸`;
}

/** "52,4 м²" / "52.4 m²" */
export function formatArea(value: number, locale: Locale = defaultLocale): string {
  const formatted = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ru-RU', {
    minimumFractionDigits: 0,
    // Two decimals: the published plan areas carry two (e.g. 46,23 m²).
    maximumFractionDigits: 2,
  }).format(value);
  return `${formatted} ${locale === 'en' ? 'm²' : 'м²'}`;
}

/** Compact price for tight cards: "62,4 млн ₸" */
export function formatPriceCompact(value: number, locale: Locale = defaultLocale): string {
  const millions = value / 1_000_000;
  const formatted = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: millions < 100 ? 1 : 0,
  }).format(millions);
  return `${formatted} ${locale === 'en' ? 'M ₸' : 'млн ₸'}`;
}

/** Thousands separator only, no currency — used inside dense tables. */
export function formatNumber(value: number, locale: Locale = defaultLocale): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ru-RU', {
    maximumFractionDigits: 0,
  }).format(value);
}
