import { describe, expect, it } from 'vitest';

import en from '@/i18n/dictionaries/en';
import kz from '@/i18n/dictionaries/kz';
import ru from '@/i18n/dictionaries/ru';
import { BLOCKS } from '@/data/project';

import { buildExplorerLabels, buildUnitGridLabels } from './labels';

/**
 * Audit 1.5 / 1.7 — the unit grid and the filters must speak the visitor's
 * language: the row header is a floor (not a block), blocks are spelled out
 * instead of showing raw `a / b / c`, and the filtered-results caption says how
 * many of the matches are actually free.
 */

const LOCALES = { ru, kz, en } as const;

describe('unit grid labels', () => {
  it('labels the row header as a floor', () => {
    expect(buildUnitGridLabels('ru', ru).floor).toBe('Этаж');
    expect(buildUnitGridLabels('kz', kz).floor).toBe('Қабат');
    expect(buildUnitGridLabels('en', en).floor).toBe('Floor');
  });

  it('keeps a separate block label', () => {
    expect(buildUnitGridLabels('ru', ru).block).toBe('Корпус');
  });
});

describe('block names', () => {
  it.each(Object.entries(LOCALES))('spells blocks out in %s', (locale, dict) => {
    const labels = buildExplorerLabels(locale as keyof typeof LOCALES, dict);

    for (const block of BLOCKS) {
      const expected = block.names[locale as keyof typeof LOCALES];

      expect(expected.length).toBeGreaterThan(block.letter.length);
      expect(labels.blockNames[block.id]).toBe(expected);
      expect(labels.blockNames[block.id]).not.toBe(block.id);
    }
  });
});

describe('filtered-result caption', () => {
  it.each(Object.entries(LOCALES))('%s can report found and available', (locale, dict) => {
    const labels = buildExplorerLabels(locale as keyof typeof LOCALES, dict);

    expect(labels.resultsWithAvailable).toContain('{found}');
    expect(labels.resultsWithAvailable).toContain('{available}');
  });
});
