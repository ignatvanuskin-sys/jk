import { describe, expect, it } from 'vitest';

import { estimateMonthlyPayment } from './finance';

describe('estimateMonthlyPayment', () => {
  it('matches the standard annuity payment', () => {
    // 1,000,000 over 12 months at 12% a year → 88,848.79 ₸ — a textbook value.
    const result = estimateMonthlyPayment(1_000_000, {
      rate: 12,
      minDownPercent: 0,
      maxTermYears: 1,
    });

    expect(result.months).toBe(12);
    expect(result.loanAmount).toBe(1_000_000);
    expect(result.monthly).toBeCloseTo(88_848.79, 1);
  });

  it('treats a zero rate as a straight division (no division by zero)', () => {
    const result = estimateMonthlyPayment(1_200_000, {
      rate: 0,
      minDownPercent: 0,
      maxTermYears: 1,
    });

    expect(result.monthly).toBe(100_000);
  });

  it('subtracts the down payment before computing the loan', () => {
    const result = estimateMonthlyPayment(1_200_000, {
      rate: 0,
      minDownPercent: 50,
      maxTermYears: 10,
    });

    expect(result.loanAmount).toBe(600_000);
    expect(result.months).toBe(120);
    expect(result.monthly).toBe(5_000);
  });

  it('returns a zero payment (never NaN) for a non-positive price', () => {
    expect(estimateMonthlyPayment(0, { rate: 5, minDownPercent: 20, maxTermYears: 15 }).monthly).toBe(
      0,
    );
    expect(
      estimateMonthlyPayment(Number.NaN, { rate: 5, minDownPercent: 20, maxTermYears: 15 }).monthly,
    ).toBe(0);
  });

  it('produces a finite payment for the real catalogue price', () => {
    const result = estimateMonthlyPayment(24_640_590, {
      rate: 5,
      minDownPercent: 20,
      maxTermYears: 15,
    });

    expect(Number.isFinite(result.monthly)).toBe(true);
    expect(result.monthly).toBeGreaterThan(0);
  });
});
