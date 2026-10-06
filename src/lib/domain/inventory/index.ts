export type InventoryStatus = 'available' | 'reserved' | 'sold';

export interface InventoryItem {
  status: InventoryStatus;
}

export interface InventoryCounts {
  total: number;
  available: number;
  reserved: number;
  sold: number;
  found: number;
}

/**
 * Creates one authoritative status breakdown for either the complete inventory
 * or a filtered result set. `found` always describes the supplied result set.
 */
export function countInventory<T extends InventoryItem>(items: readonly T[]): InventoryCounts {
  return items.reduce<InventoryCounts>(
    (counts, item) => {
      counts.total += 1;
      counts.found += 1;
      counts[item.status] += 1;
      return counts;
    },
    { total: 0, available: 0, reserved: 0, sold: 0, found: 0 },
  );
}

/** Counts filtered results while retaining the full inventory total. */
export function countInventoryResults<T extends InventoryItem>(
  allItems: readonly T[],
  foundItems: readonly T[],
): InventoryCounts {
  return { ...countInventory(foundItems), total: allItems.length };
}
