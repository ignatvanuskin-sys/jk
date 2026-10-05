import type { Locale } from '@/i18n/config';
import { MORTGAGE_PROGRAMS } from '@/data/mortgage-programs';
import { INVENTORY_STATS } from '@/data/apartments';
import type { CalcProgram } from './MortgageCalculator';

/**
 * Localised, serialisable projection of the financing programmes for the client
 * calculator. Only programmes whose full parameter set is backed by a source
 * are included — the rest stay in the reference table on the page.
 */
export function buildCalcPrograms(locale: Locale): CalcProgram[] {
  return MORTGAGE_PROGRAMS.filter((program) => program.calculatorReady).map((program) => ({
    id: program.id,
    label: program.name[locale],
    provider: program.provider,
    rate: program.rate,
    minDown: program.minDownPercent,
    maxTerm: program.maxTermYears,
    priceCap: program.priceCap,
    caveat: program.caveat?.[locale],
    verified: program.sourceIds.length > 0,
  }));
}

/** Defaults for the calculator, derived from the actual inventory. */
export const CALCULATOR_DEFAULTS = {
  price: 25_000_000,
  priceMin: 15_000_000,
  priceMax: 70_000_000,
} as const;

export const INVENTORY_PRICE_RANGE = {
  min: INVENTORY_STATS.minAvailablePrice,
  max: INVENTORY_STATS.maxPrice,
} as const;
