'use client';

import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import { formatArea, formatNumber, formatPrice } from '@/i18n/config';
import type { UnitSummary } from '@/data/apartments';
import { getFloorPlan } from '@/data/floorplans';
import { apartmentContext } from '@/lib/contacts';
import { cn } from '@/lib/cn';
import { estimateMonthlyPayment } from '@/lib/finance';

import { LeadButton } from '@/components/forms/LeadButton';
import { FloorPlanSvg } from '@/components/floorplans/FloorPlanSvg';
import type { ApartmentCardLabels } from './labels';

/** Alias kept local so consumers of the card do not need to know the data layer. */
export type CardUnit = UnitSummary;

/**
 * Apartment card.
 *
 * The research is blunt about this: strong developers sell the *unit*, not just
 * the complex. So the card carries everything a buyer compares on, in the order
 * they compare it — status, price, area, rooms, floor, price per m², the plan —
 * and gives two actions: open the detail page, or ask about this exact unit
 * (the number is pre-filled into the lead, so the manager knows what it is).
 */
export function ApartmentCard({
  unit,
  locale,
  labels,
  floorLabels,
  variant = 'catalogue',
}: {
  unit: CardUnit;
  locale: Locale;
  labels: ApartmentCardLabels;
  /** Localised room names for the plan drawing. */
  floorLabels: Record<string, string>;
  variant?: 'catalogue' | 'related';
}) {
  const plan = getFloorPlan(unit.planId);
  const blockName = labels.blockNames[unit.blockId];
  const href = `/${locale}/apartments/${unit.id}`;
  const isSold = unit.status === 'sold';

  /**
   * Indicative monthly payment under the default programme. Buyers compare on
   * the monthly figure as much as on the price, so it belongs on the card —
   * clearly labelled as an estimate tied to a named programme, never as a bank
   * offer.
   */
  const monthly = Math.round(estimateMonthlyPayment(unit.price, labels.finance).monthly);

  const subject = [
    `${labels.apartment} №${unit.number}`,
    blockName,
    `${unit.rooms}-${labels.roomSuffix}`,
    formatArea(unit.area, locale),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <article
      className={cn(
        // h-full: a grid item stretches to its row, but the card inside did not,
        // so cards whose tag row wrapped to two lines were 30px taller than their
        // neighbours and the rows looked ragged. With the card filling the row,
        // `mt-auto` on the action block lines the buttons up across the row too.
        'card card-hover flex h-full flex-col overflow-hidden',
        isSold && 'opacity-70 hover:opacity-100',
      )}
    >
      <div className="relative aspect-[4/3] border-b border-line-soft bg-bone/50">
        {plan && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <FloorPlanSvg
              plan={plan}
              roomLabels={floorLabels}
              variant="thumb"
              className="max-h-full"
            />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xs border bg-paper/95 px-2 py-1 text-[0.6875rem] font-medium backdrop-blur-sm',
              unit.status === 'available' && 'border-ok/30 text-ok',
              unit.status === 'reserved' && 'border-warn/35 text-warn',
              unit.status === 'sold' && 'border-muted/30 text-muted',
            )}
          >
            <span className="status-dot bg-current" aria-hidden="true" />
            {labels.statuses[unit.status]}
          </span>
        </div>
        <p className="absolute right-3 top-3 num rounded-xs border border-line bg-paper/95 px-2 py-1 text-xs font-semibold text-ink backdrop-blur-sm">
          №{unit.number}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl leading-none text-ink">
            {unit.rooms}-{labels.roomSuffix}
          </h3>
          {/* text-[0.8125rem], not text-sm: this label shares its row with the
              24px room count and had 111.44px of room for 111.44px of text, so at
              14px it tipped onto a second line in the widest case
              ("Корпус A · 12 эт.") and made that one card taller than its
              neighbours. 13px on desktop leaves 7px of slack; the mobile scale
              lifts it back to 14px on a phone, where cards are full width. */}
          {variant === 'catalogue' && (
            <p className="text-[0.8125rem] text-muted">
              {blockName} · {unit.floor} {labels.floorShort}
            </p>
          )}
        </div>

        <p className="num mt-4 font-display text-[1.75rem] leading-none text-ink">
          {formatPrice(unit.price, locale)}
        </p>
        <p className="num mt-1.5 text-sm text-muted">
          {formatNumber(unit.pricePerSqm, locale)} ₸ {labels.pricePerSqm}
        </p>

        {!isSold && (
          <>
            <p className="num mt-3 text-[0.8125rem] text-ink-soft">
              {labels.monthlyFrom.replace('{amount}', formatPrice(monthly, locale))}
            </p>
            <p className="mt-0.5 text-[0.6875rem] leading-snug text-muted">
              {labels.monthlyNote.replace('{program}', labels.finance.programLabel)}
            </p>
          </>
        )}

        <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-line-soft pt-4 text-sm">
          <div>
            <dt className="text-muted">{labels.area}</dt>
            <dd className="num mt-1 font-medium text-ink">{formatArea(unit.area, locale)}</dd>
          </div>
          <div>
            <dt className="text-muted">{labels.floor}</dt>
            <dd className="num mt-1 font-medium text-ink">
              {unit.floor}
              <span className="text-muted"> / {labels.blockFloors[unit.blockId]}</span>
            </dd>
          </div>
          <div>
            <dt className="text-muted">{labels.ceiling}</dt>
            <dd className="num mt-1 font-medium text-ink">
              {unit.ceiling} {labels.meters}
            </dd>
          </div>
        </dl>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {unit.stateProgram && unit.status === 'available' && (
            <li className="rounded-xs bg-pine/10 px-2 py-1 text-[0.6875rem] text-pine">
              {labels.stateProgram}
            </li>
          )}
          <li className="rounded-xs bg-bone px-2 py-1 text-[0.6875rem] text-ink-soft">
            {labels.views[unit.view]}
          </li>
          <li className="rounded-xs bg-bone px-2 py-1 text-[0.6875rem] text-ink-soft">
            {labels.finishes[unit.finishing]}
          </li>
        </ul>

        <div className="mt-auto flex flex-col gap-2 pt-5">
          <Link
            href={href}
            className="btn btn-outline w-full"
            aria-label={`${labels.openApartment} №${unit.number}`}
          >
            {labels.learnMore}
          </Link>
          {!isSold && (
            <LeadButton
              source={`apartment-card:${unit.id}`}
              subject={apartmentContext(locale, {
                number: unit.number,
                blockLetter: unit.blockId.toUpperCase(),
                rooms: unit.rooms,
                area: unit.area,
                price: unit.price,
              })}
              variant="primary"
              fullWidth
            >
              {labels.getTerms}
            </LeadButton>
          )}
        </div>
      </div>
    </article>
  );
}
