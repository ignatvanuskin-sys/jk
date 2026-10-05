import type { Locale } from './config';
import type { Dictionary } from './dictionaries/ru';

import ru from './dictionaries/ru';
import kz from './dictionaries/kz';
import en from './dictionaries/en';

/**
 * Dictionaries are imported statically rather than lazily: every page is
 * statically generated at build time, so a dynamic import would only add a
 * waterfall without saving transfer, and static imports let the bundler inline
 * exactly one locale per rendered route.
 */
const dictionaries: Record<Locale, Dictionary> = { ru, kz, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
