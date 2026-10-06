import { describe, expect, it } from 'vitest';

import { formatIsoDate } from './date';

/**
 * Audit 1.6 — one date formatter for the whole project.
 *
 * Nothing in the UI may show `2026-09` or `2026-02-10`: those are the audit's
 * two examples of machine-oriented dates leaking into visible copy.
 */
describe('formatIsoDate', () => {
  it('formats a date for every locale', () => {
    expect(formatIsoDate('2026-10-05', 'ru')).toContain('2026');
    expect(formatIsoDate('2026-10-05', 'kz')).toContain('2026');
    expect(formatIsoDate('2026-10-05', 'en')).toContain('2026');
  });

  it('turns an ISO month into a written Russian month', () => {
    expect(formatIsoDate('2026-09', 'ru', 'month')).toContain('сентябрь 2026');
  });

  it('turns an ISO date into a written Russian date', () => {
    const long = formatIsoDate('2026-02-10', 'ru');

    expect(long).toContain('10 февраля 2026');
    expect(long).not.toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it('never falls back to Russian in Kazakh', () => {
    const month = formatIsoDate('2026-09', 'kz', 'month');

    expect(month).toContain('қыркүйек');
    expect(month).not.toMatch(/сентябр|октябр|феврал/i);
  });

  it('formats ISO months and date-times', () => {
    expect(formatIsoDate('2026-09', 'en', 'month')).toBe('September 2026');
    expect(formatIsoDate('2026-10-05T10:30:00Z', 'en', 'date-time')).toMatch(/October 5, 2026/);
  });

  it('rejects invalid input', () => {
    expect(() => formatIsoDate('not-a-date', 'ru')).toThrow(RangeError);
  });
});
