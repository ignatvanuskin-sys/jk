/**
 * Financing maths, kept in one pure place so the mortgage calculator, the
 * apartment card's indicative monthly figure and any test all use the same
 * formula.
 */

export interface LoanTerms {
  /** Annual rate in percent (0 for an interest-free plan). */
  rate: number;
  /** Minimum down payment in percent. */
  minDownPercent: number;
  maxTermYears: number;
}

export interface MonthlyEstimate {
  monthly: number;
  loanAmount: number;
  months: number;
}

/**
 * Standard annuity payment. A zero rate is handled as a straight division so it
 * can never divide by zero, and a non-positive price yields a zero payment
 * rather than NaN.
 */
export function estimateMonthlyPayment(price: number, terms: LoanTerms): MonthlyEstimate {
  const months = Math.max(Math.round(terms.maxTermYears * 12), 1);

  if (!Number.isFinite(price) || price <= 0) {
    return { monthly: 0, loanAmount: 0, months };
  }

  const loanAmount = price * (1 - terms.minDownPercent / 100);
  const monthlyRate = terms.rate / 100 / 12;

  const monthly =
    monthlyRate === 0
      ? loanAmount / months
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  return { monthly, loanAmount, months };
}
