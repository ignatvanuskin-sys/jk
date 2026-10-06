import { describe, expect, it } from 'vitest';

import { countInventory, countInventoryResults } from './index';

describe('countInventory', () => {
  const units = [
    { status: 'available' as const },
    { status: 'available' as const },
    { status: 'reserved' as const },
    { status: 'sold' as const },
  ];

  it('returns one complete status breakdown', () => {
    expect(countInventory(units)).toEqual({ total: 4, found: 4, available: 2, reserved: 1, sold: 1 });
  });

  it('keeps the full total for filtered results', () => {
    expect(countInventoryResults(units, units.slice(0, 2))).toEqual({
      total: 4,
      found: 2,
      available: 2,
      reserved: 0,
      sold: 0,
    });
  });
});
