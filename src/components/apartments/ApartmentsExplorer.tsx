'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Locale } from '@/i18n/config';
import type { UnitStatus } from '@/data/apartments';
import { cn } from '@/lib/cn';
import { countInventoryResults } from '@/lib/domain/inventory';

import { ApartmentCard, type CardUnit } from './ApartmentCard';
import type { ExplorerLabels } from './labels';
import { LeadButton } from '@/components/forms/LeadButton';

type SortKey = 'priceAsc' | 'priceDesc' | 'areaAsc' | 'areaDesc' | 'floorAsc';

export interface InventoryBounds {
  areaMin: number;
  areaMax: number;
  priceMin: number;
  priceMax: number;
  floorMin: number;
  floorMax: number;
}

interface ApartmentsExplorerProps {
  units: CardUnit[];
  locale: Locale;
  labels: ExplorerLabels;
  floorLabels: Record<string, string>;
  bounds: InventoryBounds;
  /** Renders inside the catalogue page under an existing heading. */
  showHeading?: boolean;
}

const PAGE_SIZE = 12;
const ROOM_OPTIONS = [1, 2, 3, 4] as const;
const BLOCK_OPTIONS = ['10', '11'] as const;
const STATUS_OPTIONS: UnitStatus[] = ['available', 'reserved', 'sold'];

const numberFormat = (locale: Locale) => new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ru-RU');

/**
 * Apartment catalogue.
 *
 * Decisions worth stating:
 *   • filtering happens in the client against a compact projection of the
 *     inventory, so every chip responds instantly with no network round trip;
 *   • the filter state is mirrored into the URL with `replaceState`, so a
 *     shortlist can be sent to a manager as a link without a full navigation;
 *   • the result count is announced through an aria-live region;
 *   • "sold" units are hidden by default — they add noise, not urgency — but
 *     remain one tap away for buyers who want to see the whole picture;
 *   • only the first 12 cards render until asked, so a 200-unit inventory never
 *     costs 200 inline SVGs on first paint.
 */
export function ApartmentsExplorer({
  units,
  locale,
  labels,
  floorLabels,
  bounds,
  showHeading = true,
}: ApartmentsExplorerProps) {
  const [rooms, setRooms] = useState<number[]>([]);
  const [blocks, setBlocks] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<UnitStatus[]>(['available']);
  const [areaMin, setAreaMin] = useState('');
  const [areaMax, setAreaMax] = useState('');
  const [floorMin, setFloorMin] = useState('');
  const [floorMax, setFloorMax] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sort, setSort] = useState<SortKey>('priceAsc');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [urlApplied, setUrlApplied] = useState(false);

  const nf = numberFormat(locale);

  /* ── Restore a shared shortlist from the query string ──────────────────── */
  useEffect(() => {
    if (urlApplied) return;
    const params = new URLSearchParams(window.location.search);
    const list = (key: string) =>
      (params.get(key) ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

    const r = list('rooms').map(Number).filter((n) => n >= 1 && n <= 4);
    if (r.length) setRooms(r);

    const b = list('blocks').filter((value) => (BLOCK_OPTIONS as readonly string[]).includes(value));
    if (b.length) setBlocks(b);

    const s = list('status').filter((value): value is UnitStatus =>
      (STATUS_OPTIONS as string[]).includes(value),
    );
    if (s.length) setStatuses(s);

    const numeric = (key: string) => {
      const value = params.get(key);
      const parsed = value ? Number(value) : Number.NaN;
      return Number.isFinite(parsed) ? String(parsed) : '';
    };
    setAreaMin(numeric('areaMin'));
    setAreaMax(numeric('areaMax'));
    setFloorMin(numeric('floorMin'));
    setFloorMax(numeric('floorMax'));
    setPriceMin(numeric('priceMin'));
    setPriceMax(numeric('priceMax'));

    const sortParam = params.get('sort') as SortKey | null;
    if (sortParam && ['priceAsc', 'priceDesc', 'areaAsc', 'areaDesc', 'floorAsc'].includes(sortParam)) {
      setSort(sortParam);
    }

    setUrlApplied(true);
  }, [urlApplied]);

  /* ── Keep the URL in step with the filters (no navigation) ─────────────── */
  useEffect(() => {
    if (!urlApplied) return;
    const params = new URLSearchParams();
    if (rooms.length) params.set('rooms', rooms.join(','));
    if (blocks.length) params.set('blocks', blocks.join(','));
    if (statuses.length !== 1 || !statuses.includes('available')) {
      params.set('status', statuses.join(','));
    }
    if (areaMin) params.set('areaMin', areaMin);
    if (areaMax) params.set('areaMax', areaMax);
    if (floorMin) params.set('floorMin', floorMin);
    if (floorMax) params.set('floorMax', floorMax);
    if (priceMin) params.set('priceMin', priceMin);
    if (priceMax) params.set('priceMax', priceMax);
    if (sort !== 'priceAsc') params.set('sort', sort);

    const query = params.toString();
    const next = `${window.location.pathname}${query ? `?${query}` : ''}`;
    window.history.replaceState(null, '', next);
  }, [
    urlApplied,
    rooms,
    blocks,
    statuses,
    areaMin,
    areaMax,
    floorMin,
    floorMax,
    priceMin,
    priceMax,
    sort,
  ]);

  /* ── Filtering ─────────────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    const num = (value: string) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) && value !== '' ? parsed : null;
    };
    const aMin = num(areaMin);
    const aMax = num(areaMax);
    const fMin = num(floorMin);
    const fMax = num(floorMax);
    const pMin = num(priceMin);
    const pMax = num(priceMax);

    const result = units.filter((unit) => {
      if (rooms.length && !rooms.includes(unit.rooms)) return false;
      if (blocks.length && !blocks.includes(unit.blockId)) return false;
      if (statuses.length && !statuses.includes(unit.status)) return false;
      if (aMin !== null && unit.area < aMin) return false;
      if (aMax !== null && unit.area > aMax) return false;
      if (fMin !== null && unit.floor < fMin) return false;
      if (fMax !== null && unit.floor > fMax) return false;
      if (pMin !== null && unit.price < pMin) return false;
      if (pMax !== null && unit.price > pMax) return false;
      return true;
    });

    const sorters: Record<SortKey, (a: CardUnit, b: CardUnit) => number> = {
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      areaAsc: (a, b) => a.area - b.area,
      areaDesc: (a, b) => b.area - a.area,
      floorAsc: (a, b) => a.floor - b.floor || a.price - b.price,
    };

    return result.sort(sorters[sort]);
  }, [units, rooms, blocks, statuses, areaMin, areaMax, floorMin, floorMax, priceMin, priceMax, sort]);

  // Any filter change collapses the list back to the first page.
  useEffect(() => setVisible(PAGE_SIZE), [rooms, blocks, statuses, areaMin, areaMax, floorMin, floorMax, priceMin, priceMax, sort]);

  const reset = useCallback(() => {
    setRooms([]);
    setBlocks([]);
    setStatuses(['available']);
    setAreaMin('');
    setAreaMax('');
    setFloorMin('');
    setFloorMax('');
    setPriceMin('');
    setPriceMax('');
    setSort('priceAsc');
  }, []);

  const toggle = <T,>(list: T[], value: T, setter: (next: T[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const activeFilterCount =
    rooms.length +
    blocks.length +
    (statuses.length === 2 && statuses.includes('available') && statuses.includes('reserved')
      ? 0
      : statuses.length) +
    [areaMin, areaMax, floorMin, floorMax, priceMin, priceMax].filter(Boolean).length;

  const counts = countInventoryResults(units, filtered);
  const onlyAvailable = statuses.length === 1 && statuses[0] === 'available';
  const countLabel = onlyAvailable
    ? counts.found === 1
      ? `${labels.resultsFoundOne} ${counts.found} ${labels.resultsUnitOne}`
      : `${labels.resultsFound} ${counts.found} ${labels.resultsUnit}`
    : labels.resultsWithAvailable
        .replace('{found}', String(counts.found))
        .replace('{available}', String(counts.available));

  return (
    <div className="grid gap-8 lg:grid-cols-[19rem_1fr] lg:gap-10">
      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div>
        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          aria-controls="apartment-filters"
          className="btn btn-outline w-full justify-between lg:hidden"
        >
          <span>
            {labels.filterToggle}
            {activeFilterCount > 0 && ` · ${activeFilterCount}`}
          </span>
          <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
        </button>

        <div
          id="apartment-filters"
          className={cn(
            'mt-4 lg:mt-0 lg:sticky lg:top-24 lg:block',
            filtersOpen ? 'block' : 'hidden',
          )}
        >
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">{labels.filters.title}</h2>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs text-clay underline decoration-clay/40 underline-offset-4 hover:decoration-clay"
                >
                  {labels.reset}
                </button>
              )}
            </div>

            <fieldset className="mt-5">
              <legend className="text-xs font-medium text-muted">{labels.filters.rooms}</legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ROOM_OPTIONS.map((value) => {
                  const active = rooms.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggle(rooms, value, setRooms)}
                      className={cn(
                        'min-w-11 rounded-xs border px-3 py-2 text-sm transition-colors',
                        active
                          ? 'border-ink bg-ink text-paper'
                          : 'border-line bg-white text-ink-soft hover:border-ink/40',
                      )}
                    >
                      {value === 4 ? '4+' : value}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-5">
              <legend className="text-xs font-medium text-muted">{labels.filters.block}</legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {BLOCK_OPTIONS.map((value) => {
                  const active = blocks.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggle(blocks, value, setBlocks)}
                      className={cn(
                        'rounded-xs border px-3 py-2 text-sm uppercase transition-colors',
                        active
                          ? 'border-ink bg-ink text-paper'
                          : 'border-line bg-white text-ink-soft hover:border-ink/40',
                      )}
                    >
                      {labels.blockNames[value]}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-5">
              <legend className="text-xs font-medium text-muted">{labels.filters.status}</legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map((value) => {
                  const active = statuses.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggle(statuses, value, setStatuses)}
                      className={cn(
                        'rounded-xs border px-3 py-2 text-sm transition-colors',
                        active
                          ? 'border-ink bg-ink text-paper'
                          : 'border-line bg-white text-ink-soft hover:border-ink/40',
                      )}
                    >
                      {labels.statuses[value]}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <p className="text-xs font-medium text-muted">{labels.filters.area}</p>
              </div>
              <label className="block">
                <span className="sr-only">{`${labels.filters.area} ${labels.min}`}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  className="field num"
                  placeholder={`${labels.min} ${bounds.areaMin}`}
                  min={bounds.areaMin}
                  max={bounds.areaMax}
                  value={areaMin}
                  onChange={(event) => setAreaMin(event.target.value)}
                />
              </label>
              <label className="block">
                <span className="sr-only">{`${labels.filters.area} ${labels.max}`}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  className="field num"
                  placeholder={`${labels.max} ${bounds.areaMax}`}
                  min={bounds.areaMin}
                  max={bounds.areaMax}
                  value={areaMax}
                  onChange={(event) => setAreaMax(event.target.value)}
                />
              </label>

              <div className="col-span-2">
                <p className="text-xs font-medium text-muted">{labels.filters.floor}</p>
              </div>
              <label className="block">
                <span className="sr-only">{`${labels.filters.floor} ${labels.min}`}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  className="field num"
                  placeholder={`${labels.min} ${bounds.floorMin}`}
                  min={bounds.floorMin}
                  max={bounds.floorMax}
                  value={floorMin}
                  onChange={(event) => setFloorMin(event.target.value)}
                />
              </label>
              <label className="block">
                <span className="sr-only">{`${labels.filters.floor} ${labels.max}`}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  className="field num"
                  placeholder={`${labels.max} ${bounds.floorMax}`}
                  min={bounds.floorMin}
                  max={bounds.floorMax}
                  value={floorMax}
                  onChange={(event) => setFloorMax(event.target.value)}
                />
              </label>

              <div className="col-span-2">
                <p className="text-xs font-medium text-muted">{labels.filters.price}</p>
              </div>
              <label className="block">
                <span className="sr-only">{`${labels.filters.price} ${labels.min}`}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  step={500000}
                  className="field num"
                  placeholder={`${nf.format(bounds.priceMin)}`}
                  value={priceMin}
                  onChange={(event) => setPriceMin(event.target.value)}
                />
              </label>
              <label className="block">
                <span className="sr-only">{`${labels.filters.price} ${labels.max}`}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  step={500000}
                  className="field num"
                  placeholder={`${nf.format(bounds.priceMax)}`}
                  value={priceMax}
                  onChange={(event) => setPriceMax(event.target.value)}
                />
              </label>
            </div>

            <div className="mt-5">
              <label htmlFor="apartment-sort" className="text-xs font-medium text-muted">
                {labels.filters.sort}
              </label>
              <select
                id="apartment-sort"
                className="field mt-2"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
              >
                {(Object.keys(labels.filters.sortOptions) as SortKey[]).map((key) => (
                  <option key={key} value={key}>
                    {labels.filters.sortOptions[key]}
                  </option>
                ))}
              </select>
            </div>

            <p className="mt-5 border-t border-line-soft pt-4 text-[0.6875rem] leading-relaxed text-muted">
              {labels.comingSoonNote}
            </p>
          </div>
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <p
            className="num text-sm text-ink-soft"
            role="status"
            aria-live="polite"
            aria-label={labels.resultStatusLabel}
          >
            {countLabel}
          </p>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={reset}
              className="text-xs text-clay underline decoration-clay/40 underline-offset-4 hover:decoration-clay lg:hidden"
            >
              {labels.reset}
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="card mt-8 p-8 text-center">
            <h3 className="font-display text-2xl text-ink">{labels.emptyTitle}</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
              {labels.emptyText}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={reset} className="btn btn-outline">
                {labels.reset}
              </button>
              <LeadButton source="catalogue-empty" variant="primary">
                {labels.noResultsCta}
              </LeadButton>
            </div>
          </div>
        ) : (
          <>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.slice(0, visible).map((unit) => (
                <li key={unit.id}>
                  <ApartmentCard
                    unit={unit}
                    locale={locale}
                    labels={labels.card}
                    floorLabels={floorLabels}
                  />
                </li>
              ))}
            </ul>

            {visible < filtered.length && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((count) => count + PAGE_SIZE)}
                  className="btn btn-outline"
                >
                  {labels.viewAll} ({counts.found})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
