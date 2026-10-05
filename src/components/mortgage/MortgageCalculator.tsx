'use client';

import { useEffect, useMemo, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { formatPrice } from '@/i18n/config';

import { LeadButton } from '@/components/forms/LeadButton';
import type { MortgageLabels } from '@/components/apartments/labels';

/** Serializable programme projection — built on the server from the sourced data. */
export interface CalcProgram {
  id: string;
  label: string;
  provider: string;
  rate: number;
  minDown: number;
  maxTerm: number;
  /** Property price ceiling, where the programme sets one. */
  priceCap?: number;
  caveat?: string;
  /** True when every figure used here came from a cited source. */
  verified: boolean;
}

interface MortgageCalculatorProps {
  programs: CalcProgram[];
  labels: MortgageLabels;
  locale: Locale;
  /** Defaults derived from the real inventory. */
  defaults: {
    price: number;
    priceMin: number;
    priceMax: number;
  };
}

/**
 * Mortgage / payment-plan calculator.
 *
 * Two things it deliberately does NOT do:
 *   • pretend to be a bank offer — there is an explicit disclaimer above the
 *     result and no "apply now" wording;
 *   • recompute silently when the input breaks a programme rule — instead the
 *     field explains which rule was hit and why the number is unavailable.
 *
 * The maths is the standard annuity formula, and a zero-rate programme (the
 * developer payment plan) is handled as a straight division so it cannot
 * produce a division-by-zero.
 */
export function MortgageCalculator({
  programs,
  labels,
  locale,
  defaults,
}: MortgageCalculatorProps) {
  const [programId, setProgramId] = useState(programs[0]?.id ?? 'bank');
  const program = programs.find((item) => item.id === programId) ?? programs[0];

  const [price, setPrice] = useState(defaults.price);
  const [downPercent, setDownPercent] = useState(program?.minDown ?? 20);
  const [termYears, setTermYears] = useState(program?.maxTerm ?? 20);
  const [rate, setRate] = useState(program?.rate ?? 18);

  // Switching programmes re-clamps everything the programme constrains.
  useEffect(() => {
    if (!program) return;
    setRate(program.rate);
    setTermYears((current) => Math.min(current, program.maxTerm));
    setDownPercent((current) => Math.max(current, program.minDown));
  }, [program]);

  const result = useMemo(() => {
    if (!program) return null;

    const loanAmount = price * (1 - downPercent / 100);
    const months = Math.max(termYears * 12, 1);
    const monthlyRate = rate / 100 / 12;

    const monthly =
      monthlyRate === 0
        ? loanAmount / months
        : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

    const totalPaid = monthly * months;
    const underCap = program.priceCap === undefined || price <= program.priceCap;
    const downOk = downPercent >= program.minDown;

    return {
      loanAmount,
      monthly,
      totalPaid,
      overpay: totalPaid - loanAmount,
      underCap,
      downOk,
      interestShare: totalPaid > 0 ? (totalPaid - loanAmount) / totalPaid : 0,
    };
  }, [program, price, downPercent, termYears, rate]);

  const downAmount = price * (downPercent / 100);
  const blocked = result !== null && (!result.underCap || !result.downOk);

  return (
    <div className="card overflow-hidden">
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        {/* ── Inputs ─────────────────────────────────────────────────────── */}
        <div className="p-6 sm:p-8">
          <div>
            <label htmlFor="calc-program" className="text-xs font-medium text-muted">
              {labels.calculator.program}
            </label>
            <select
              id="calc-program"
              className="field mt-2"
              value={programId}
              onChange={(event) => setProgramId(event.target.value)}
            >
              {programs.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} — {item.rate}% · {item.provider}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between gap-4">
              <label htmlFor="calc-price" className="text-xs font-medium text-muted">
                {labels.calculator.price}
              </label>
              <span className="num font-display text-xl text-ink">
                {formatPrice(price, locale)}
              </span>
            </div>
            <input
              id="calc-price"
              type="range"
              className="mt-3"
              min={defaults.priceMin}
              max={defaults.priceMax}
              step={500_000}
              value={price}
              aria-valuetext={formatPrice(price, locale)}
              onChange={(event) => setPrice(Number(event.target.value))}
            />
            <div className="num mt-1 flex justify-between text-[0.6875rem] text-muted">
              <span>{formatPrice(defaults.priceMin, locale)}</span>
              <span>{formatPrice(defaults.priceMax, locale)}</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between gap-4">
              <label htmlFor="calc-down" className="text-xs font-medium text-muted">
                {labels.calculator.down}
              </label>
              <span className="num font-display text-xl text-ink">
                {downPercent}% · {formatPrice(downAmount, locale)}
              </span>
            </div>
            <input
              id="calc-down"
              type="range"
              className="mt-3"
              min={5}
              max={90}
              step={1}
              value={downPercent}
              aria-valuetext={`${downPercent}%`}
              onChange={(event) => setDownPercent(Number(event.target.value))}
            />
            <p className="mt-2 text-[0.6875rem] text-muted">
              {labels.calculator.minDownHint.replace('{percent}', String(program?.minDown ?? 0))}
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <div className="flex items-end justify-between gap-3">
                <label htmlFor="calc-term" className="text-xs font-medium text-muted">
                  {labels.calculator.term}
                </label>
                <span className="num text-sm text-ink">
                  {termYears} {labels.calculator.termUnit}
                </span>
              </div>
              <input
                id="calc-term"
                type="range"
                className="mt-3"
                min={1}
                max={program?.maxTerm ?? 25}
                step={1}
                value={termYears}
                aria-valuetext={`${termYears} ${labels.calculator.termUnit}`}
                onChange={(event) => setTermYears(Number(event.target.value))}
              />
            </div>

            <div>
              <label htmlFor="calc-rate" className="text-xs font-medium text-muted">
                {labels.calculator.rate}
              </label>
              <div className="relative mt-2">
                <input
                  id="calc-rate"
                  type="number"
                  inputMode="decimal"
                  step={0.1}
                  min={0}
                  max={40}
                  className="field num pr-8"
                  value={rate}
                  onChange={(event) => setRate(Number(event.target.value))}
                />
                <span className="num absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                  %
                </span>
              </div>
            </div>
          </div>

          {blocked && (
            <div className="mt-5 space-y-2">
              {!result?.underCap && program?.priceCap !== undefined && (
                <p className="rounded-sm border border-warn/40 bg-warn/10 p-3 text-xs leading-relaxed text-warn">
                  {labels.calculator.limitsHint.replace(
                    '{limit}',
                    formatPrice(program.priceCap, locale),
                  )}
                </p>
              )}
              {!result?.downOk && (
                <p className="rounded-sm border border-danger/40 bg-danger/5 p-3 text-xs leading-relaxed text-danger">
                  {labels.calculator.notEnoughDown}
                </p>
              )}
            </div>
          )}

          {program?.caveat && (
            <p className="mt-5 border-l-2 border-line pl-3 text-[0.6875rem] leading-relaxed text-muted">
              {program.caveat}
            </p>
          )}
        </div>

        {/* ── Result ─────────────────────────────────────────────────────── */}
        <div className="border-t border-line bg-pine-deep p-6 text-paper sm:p-8 lg:border-l lg:border-t-0">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-paper/60">
            {labels.calculator.monthly}
          </p>
          <p className="num mt-3 font-display text-[2.5rem] leading-none text-paper sm:text-[3rem]">
            {blocked || !result ? '—' : formatPrice(Math.round(result.monthly), locale)}
          </p>

          <dl className="mt-7 space-y-3 border-t border-paper/15 pt-6 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-paper/65">{labels.calculator.downAmount}</dt>
              <dd className="num text-paper">{formatPrice(Math.round(downAmount), locale)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-paper/65">{labels.calculator.loanAmount}</dt>
              <dd className="num text-paper">
                {result ? formatPrice(Math.round(result.loanAmount), locale) : '—'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-paper/65">{labels.calculator.overpay}</dt>
              <dd className="num text-paper">
                {result ? formatPrice(Math.round(Math.max(result.overpay, 0)), locale) : '—'}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-paper/15 pt-3">
              <dt className="text-paper/65">{labels.calculator.totalPaid}</dt>
              <dd className="num font-medium text-paper">
                {result ? formatPrice(Math.round(result.totalPaid), locale) : '—'}
              </dd>
            </div>
          </dl>

          {result && !blocked && result.overpay > 0 && (
            <div className="mt-6">
              <div
                className="flex h-2 overflow-hidden rounded-full bg-paper/20"
                role="img"
                aria-label={`${labels.calculator.loanAmount} ${Math.round((1 - result.interestShare) * 100)}%, ${labels.calculator.overpay} ${Math.round(result.interestShare * 100)}%`}
              >
                <span
                  className="h-full bg-paper"
                  style={{ width: `${Math.max(0, (1 - result.interestShare) * 100)}%` }}
                />
                <span className="h-full flex-1 bg-clay-soft" />
              </div>
              <div className="mt-2 flex justify-between text-[0.6875rem] text-paper/60">
                <span>{labels.calculator.loanAmount}</span>
                <span>{labels.calculator.overpay}</span>
              </div>
            </div>
          )}

          <div className="mt-7 rounded-sm border border-warn/45 bg-warn/12 p-4">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-warn">
              {labels.disclaimerTitle}
            </p>
            <p className="mt-2 text-[0.6875rem] leading-relaxed text-paper/80">
              {labels.disclaimer}
            </p>
          </div>

          <div className="mt-6">
            <p className="text-sm text-paper/75">{labels.ctaNote}</p>
            <LeadButton
              source={`calculator:${programId}`}
              subject={`${labels.title} — ${program?.label ?? ''}, ${formatPrice(price, locale)}, ${labels.calculator.down} ${downPercent}%`}
              variant="light"
              className="mt-4 w-full"
            >
              {labels.consultCta}
            </LeadButton>
          </div>
        </div>
      </div>
    </div>
  );
}


