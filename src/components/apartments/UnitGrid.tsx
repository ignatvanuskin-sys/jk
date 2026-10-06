'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { formatArea, formatNumber, formatPrice } from '@/i18n/config';
import type { UnitStatus } from '@/data/apartments';
import { apartmentContext } from '@/lib/contacts';
import { cn } from '@/lib/cn';

import type { UnitGridLabels } from './labels';
import type { CardUnit } from './ApartmentCard';
import { LeadButton } from '@/components/forms/LeadButton';

export interface GridBlock {
  id: '10' | '11';
  floors: number;
  unitsPerFloor: number;
  name: string;
}

const CELL_STYLES: Record<UnitStatus, string> = {
  available: 'bg-ok/14 text-ok border-ok/35 hover:bg-ok/25',
  reserved: 'bg-warn/16 text-warn border-warn/40 hover:bg-warn/25',
  sold: 'bg-muted/10 text-muted border-muted/25',
};

/**
 * Unit grid — the "шахматка".
 *
 * This is the local standard: buyers expect to pick a floor and see exactly
 * which apartments on that landing are free. It is a real table, because the
 * structure genuinely is a matrix of floors × positions, which gives screen
 * readers row and column context for free.
 *
 * Status is never carried by colour alone — every cell has an accessible name
 * that includes the status word, and the legend repeats it in text.
 */
export function UnitGrid({
  units,
  blocks,
  locale,
  labels,
}: {
  units: CardUnit[];
  blocks: GridBlock[];
  locale: Locale;
  labels: UnitGridLabels;
}) {
  const [blockId, setBlockId] = useState<GridBlock['id']>(blocks[0]?.id ?? '10');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const block = blocks.find((b) => b.id === blockId) ?? blocks[0];

  const byFloor = useMemo(() => {
    const map = new Map<number, CardUnit[]>();
    for (const unit of units) {
      if (unit.blockId !== blockId) continue;
      const list = map.get(unit.floor) ?? [];
      list.push(unit);
      map.set(unit.floor, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.id.localeCompare(b.id));
    return map;
  }, [units, blockId]);

  const floors = useMemo(
    () => Array.from({ length: block?.floors ?? 0 }, (_, index) => (block?.floors ?? 0) - index),
    [block],
  );

  const selected = selectedId ? (units.find((u) => u.id === selectedId) ?? null) : null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <fieldset>
            <legend className="text-xs font-medium text-muted">{labels.block}</legend>
            <div className="mt-2 flex gap-1.5">
              {blocks.map((item) => {
                const active = item.id === blockId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setBlockId(item.id);
                      setSelectedId(null);
                    }}
                    className={cn(
                      'rounded-xs border px-3.5 py-2 text-sm uppercase transition-colors',
                      active
                        ? 'border-ink bg-ink text-paper'
                        : 'border-line bg-white text-ink-soft hover:border-ink/40',
                    )}
                  >
                    {labels.card.blockNames[item.id]}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div>
          <p className="text-xs font-medium text-muted" id="unit-legend-label">
            {labels.legend}
          </p>
          <ul className="mt-2 flex flex-wrap gap-4" aria-labelledby="unit-legend-label">
            <li className="flex items-center gap-2 text-xs text-ink-soft">
              <span className="size-3 rounded-xs border border-ok/40 bg-ok/20" aria-hidden="true" />
              {labels.legendAvailable}
            </li>
            <li className="flex items-center gap-2 text-xs text-ink-soft">
              <span className="size-3 rounded-xs border border-warn/45 bg-warn/22" aria-hidden="true" />
              {labels.legendReserved}
            </li>
            <li className="flex items-center gap-2 text-xs text-ink-soft">
              <span className="size-3 rounded-xs border border-muted/30 bg-muted/15" aria-hidden="true" />
              {labels.legendSold}
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 scroll-x">
        <table className="w-full min-w-[38rem] border-separate border-spacing-1">
          <caption className="sr-only">
            {labels.title}. {labels.lead}
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-14 text-left text-[0.6875rem] font-medium text-muted">
                {labels.floor}
              </th>
              {Array.from({ length: block?.unitsPerFloor ?? 0 }, (_, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-1 pb-1 text-center text-[0.6875rem] font-medium text-muted"
                >
                  {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {floors.map((floor) => (
              <tr key={floor}>
                <th
                  scope="row"
                  className="num pr-2 text-right align-middle text-xs font-medium text-muted"
                >
                  {floor}
                </th>
                {Array.from({ length: block?.unitsPerFloor ?? 0 }, (_, index) => {
                  const unit = (byFloor.get(floor) ?? [])[index];
                  if (!unit) {
                    return <td key={index} className="bg-line-soft/40" aria-hidden="true" />;
                  }
                  const isSelected = unit.id === selectedId;
                  return (
                    <td key={unit.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(isSelected ? null : unit.id)}
                        aria-pressed={isSelected}
                        aria-label={`${labels.card.blockNames[unit.blockId]}, ${labels.floor} ${unit.floor}, ${labels.selectedUnit} №${unit.number}, ${labels.card.statuses[unit.status]}`}
                        className={cn(
                          'num flex h-11 w-full min-w-11 items-center justify-center rounded-xs border text-xs font-medium transition-colors',
                          CELL_STYLES[unit.status],
                          isSelected && 'ring-2 ring-clay ring-offset-1',
                        )}
                      >
                        {unit.number}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">{labels.hint}</p>

      {selected && (
        <div className="card mt-6 p-5 sm:p-6" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
                {labels.selectedUnit}
              </p>
              <p className="num mt-2 font-display text-3xl leading-none text-ink">
                №{selected.number}
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                {selected.rooms}-{labels.card.roomSuffix} · {formatArea(selected.area, locale)} ·{' '}
                {labels.card.floor} {selected.floor} · {labels.card.statuses[selected.status]}
              </p>
            </div>
            <div className="text-right">
              <p className="num font-display text-2xl text-ink">
                {formatPrice(selected.price, locale)}
              </p>
              <p className="num mt-1 text-xs text-muted">
                {formatNumber(selected.pricePerSqm, locale)} ₸ {labels.card.pricePerSqm}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/${locale}/apartments/${selected.id}`} className="btn btn-outline">
              {labels.openUnit}
            </Link>
            {selected.status !== 'sold' && (
              <LeadButton
                source={`unit-grid:${selected.id}`}
                subject={apartmentContext(locale, {
                  number: selected.number,
                  blockLetter: selected.blockId.toUpperCase(),
                  rooms: selected.rooms,
                  area: selected.area,
                  price: selected.price,
                })}
                variant="primary"
              >
                {labels.card.getTerms}
              </LeadButton>
            )}
            <button type="button" onClick={() => setSelectedId(null)} className="btn btn-outline">
              {labels.closeSelection}
            </button>
          </div>
        </div>
      )}

      {!selected && <p className="mt-4 text-xs text-muted">{labels.selectHint}</p>}
    </div>
  );
}
