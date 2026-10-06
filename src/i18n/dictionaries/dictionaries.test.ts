import { describe, expect, it } from 'vitest';

import en from './en';
import kz from './kz';
import ru from './ru';

const dictionaries = { ru, kz, en };

/** Flattens every string of a nested dictionary into `path: value` pairs. */
function collectStrings(value: unknown, path = ''): [string, string][] {
  if (typeof value === 'string') return [[path, value]];

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStrings(item, `${path}[${index}]`));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      collectStrings(child, path ? `${path}.${key}` : key),
    );
  }

  return [];
}

const flattened = Object.entries(dictionaries).map(
  ([locale, dict]) => [locale, collectStrings(dict)] as const,
);

/** A bare "ПВ" abbreviation: not part of "ПВХ-профиль". */
const BARE_PV = /(^|[^А-Яа-яЁёA-Za-z])ПВ([^А-Яа-яЁёA-Za-z]|$)/;

describe('content dictionaries', () => {
  it.each(Object.entries(dictionaries))('%s has inventory and accessibility labels', (_locale, dict) => {
    expect(dict.apartments.resultsWithAvailable).toContain('{found}');
    expect(dict.apartments.resultsWithAvailable).toContain('{available}');
    expect(dict.selector.floor).toBeTruthy();
    expect(dict.apartments.finishes.pre).toBeTruthy();
    expect(dict.apartments.views.city).toBeTruthy();
    expect(dict.apartments.views.courtyard).toBeTruthy();
  });

  it.each(Object.entries(dictionaries))('%s labels all three finishing options', (_locale, dict) => {
    for (const kind of ['pre', 'clean', 'turnkey'] as const) {
      expect(dict.apartments.finishes[kind].trim()).not.toBe('');
    }
  });

  it('uses the wording the audit asked for', () => {
    expect(ru.apartments.views.city).toBe('Вид на город');
    expect(ru.apartments.views.courtyard).toBe('Вид во двор');
    expect(ru.selector.floor).toBe('Этаж');
  });

  it('does not sell a "С отделкой" tag while every unit is pre-finishing', () => {
    expect(ru.apartments.finishes.turnkey).not.toBe('С отделкой');
  });

  it('makes no count claim about the number of layouts', () => {
    for (const [_locale, dict] of Object.entries(dictionaries)) {
      expect(dict.floorplans.lead).not.toMatch(/Четыре типа|Төрт түрлі жоспар|Four layout types/);
    }
  });

  it.each(flattened)('%s keeps ISO dates out of visible copy', (_locale, strings) => {
    const leaks = strings.filter(([, value]) => /\d{4}-\d{2}/.test(value));

    expect(leaks).toEqual([]);
  });

  it.each(flattened)('%s spells the down-payment abbreviation out', (_locale, strings) => {
    const leaks = strings.filter(([, value]) => BARE_PV.test(value));

    expect(leaks).toEqual([]);
  });

  it.each(flattened)('%s never brings the hero typo back', (_locale, strings) => {
    const leaks = strings.filter(([, value]) => value.includes('потолки-витраж'));

    expect(leaks).toEqual([]);
  });
});
