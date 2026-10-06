import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  EMPTY_CATALOGUE_FILTER,
  getCatalogueFilter,
  isCatalogueFilterActive,
  matchesCatalogueFilter,
  resetCatalogueFilter,
  setCatalogueFilter,
  subscribeCatalogueFilter,
} from './catalogue-filter';

const unit = { rooms: 3, blockId: '10', price: 50_000_000, status: 'available' as const };

describe('matchesCatalogueFilter', () => {
  afterEach(() => resetCatalogueFilter());

  it('treats an empty filter as "everything matches" and as inactive', () => {
    expect(isCatalogueFilterActive(EMPTY_CATALOGUE_FILTER)).toBe(false);
    expect(matchesCatalogueFilter(unit, EMPTY_CATALOGUE_FILTER)).toBe(true);
  });

  it('filters by room count', () => {
    const filter = { ...EMPTY_CATALOGUE_FILTER, rooms: [1, 2] };
    expect(isCatalogueFilterActive(filter)).toBe(true);
    expect(matchesCatalogueFilter(unit, filter)).toBe(false);
    expect(matchesCatalogueFilter(unit, { ...filter, rooms: [3] })).toBe(true);
  });

  it('filters by block', () => {
    expect(matchesCatalogueFilter(unit, { ...EMPTY_CATALOGUE_FILTER, blocks: ['11'] })).toBe(false);
    expect(matchesCatalogueFilter(unit, { ...EMPTY_CATALOGUE_FILTER, blocks: ['10'] })).toBe(true);
  });

  it('filters by price range, inclusive of the bounds', () => {
    expect(
      matchesCatalogueFilter(unit, { ...EMPTY_CATALOGUE_FILTER, priceMin: 55_000_000 }),
    ).toBe(false);
    expect(
      matchesCatalogueFilter(unit, { ...EMPTY_CATALOGUE_FILTER, priceMax: 40_000_000 }),
    ).toBe(false);
    expect(
      matchesCatalogueFilter(unit, {
        ...EMPTY_CATALOGUE_FILTER,
        priceMin: 50_000_000,
        priceMax: 50_000_000,
      }),
    ).toBe(true);
  });

  it('combines the filters', () => {
    const filter = { ...EMPTY_CATALOGUE_FILTER, rooms: [3], blocks: ['10'], priceMax: 60_000_000 };
    expect(matchesCatalogueFilter(unit, filter)).toBe(true);
    expect(matchesCatalogueFilter({ ...unit, rooms: 2 }, filter)).toBe(false);
  });
});

describe('catalogue filter store', () => {
  afterEach(() => resetCatalogueFilter());

  it('notifies subscribers and exposes a stable snapshot between changes', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeCatalogueFilter(listener);

    const before = getCatalogueFilter();
    expect(getCatalogueFilter()).toBe(before);

    setCatalogueFilter({ ...EMPTY_CATALOGUE_FILTER, rooms: [2] });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(getCatalogueFilter().rooms).toEqual([2]);

    unsubscribe();
    setCatalogueFilter({ ...EMPTY_CATALOGUE_FILTER, rooms: [3] });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('does not notify when nothing changed', () => {
    const listener = vi.fn();
    subscribeCatalogueFilter(listener);

    setCatalogueFilter({ ...EMPTY_CATALOGUE_FILTER });

    expect(listener).not.toHaveBeenCalled();
  });
});
