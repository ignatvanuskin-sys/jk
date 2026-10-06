import type { UnitStatus } from '@/data/apartments';

/**
 * The subset of the catalogue filter that the unit grid (шахматка) can act on.
 *
 * The catalogue explorer owns the full filter UI, but the grid is rendered as a
 * sibling on the same page. Lifting all of the explorer's state into the page
 * would touch every control; instead the explorer publishes just the
 * rooms / block / price slice here and the grid subscribes to it. This keeps a
 * single source of truth for "what the visitor is currently filtering by"
 * without duplicating the filter logic.
 */
export interface CatalogueFilter {
  rooms: number[];
  blocks: string[];
  priceMin: number | null;
  priceMax: number | null;
}

export const EMPTY_CATALOGUE_FILTER: CatalogueFilter = {
  rooms: [],
  blocks: [],
  priceMin: null,
  priceMax: null,
};

/** True when at least one of the highlightable filters is set. */
export function isCatalogueFilterActive(filter: CatalogueFilter): boolean {
  return (
    filter.rooms.length > 0 ||
    filter.blocks.length > 0 ||
    filter.priceMin !== null ||
    filter.priceMax !== null
  );
}

/**
 * Whether a unit satisfies the active filter. Pure, so the grid's highlighting
 * can be reasoned about (and tested) independently of any component.
 */
export function matchesCatalogueFilter(
  unit: { rooms: number; blockId: string; price: number; status: UnitStatus },
  filter: CatalogueFilter,
): boolean {
  if (filter.rooms.length > 0 && !filter.rooms.includes(unit.rooms)) return false;
  if (filter.blocks.length > 0 && !filter.blocks.includes(unit.blockId)) return false;
  if (filter.priceMin !== null && unit.price < filter.priceMin) return false;
  if (filter.priceMax !== null && unit.price > filter.priceMax) return false;
  return true;
}

/* ── Minimal external store (useSyncExternalStore) ───────────────────────── */

let state: CatalogueFilter = EMPTY_CATALOGUE_FILTER;
const listeners = new Set<() => void>();

/** Snapshot reader. Must return a stable reference between changes. */
export function getCatalogueFilter(): CatalogueFilter {
  return state;
}

export function setCatalogueFilter(next: CatalogueFilter): void {
  const unchanged =
    next.rooms === state.rooms &&
    next.blocks === state.blocks &&
    next.priceMin === state.priceMin &&
    next.priceMax === state.priceMax;
  if (unchanged) return;

  state = next;
  for (const listener of listeners) listener();
}

export function subscribeCatalogueFilter(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Test/teardown helper — resets the store to "no filter". */
export function resetCatalogueFilter(): void {
  state = EMPTY_CATALOGUE_FILTER;
  for (const listener of listeners) listener();
}
