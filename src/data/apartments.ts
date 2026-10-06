/**
 * Apartment inventory.
 *
 * The sales inventory of the complex — the units on sale in blocks №10 and №11
 * (9 floors each) — modelled in one place. Every unit is produced by a
 * deterministic, seeded generator, so a unit's number, area, price, status,
 * finishing and view are identical on the server, in the browser and in the
 * generated JSON-LD: the catalogue, the unit grid and the structured data can
 * never drift apart.
 *
 * SOURCE OF TRUTH: `docs/real-data-dossier.md`. The blocks, floor count, unit
 * areas (from the published floor plans) and the price per m² per room type are
 * the developer's published data (as at 21 August 2026). The per-unit numbers,
 * floors, statuses and views are NOT published by the developer — the dossier
 * flags them as demo and they are generated inside the real boundaries of the
 * building: blocks №10–11, 9 floors, real areas and real price per m².
 *
 * This module is the single source of truth for every consumer. Pages and
 * components read `APARTMENTS`, `UNIT_SUMMARIES`, `INVENTORY_STATS`,
 * `FEATURED_UNITS` and the lookup helpers, and none of them hard-codes a unit.
 */

import { BLOCKS, PROJECT, type Block } from './project';
import { FLOOR_PLANS, getFloorPlan } from './floorplans';
import { countInventory } from '@/lib/domain/inventory';

export type UnitStatus = 'available' | 'reserved' | 'sold';
export type ViewKind = 'courtyard' | 'city' | 'steppe' | 'park';
export type FinishingKind = 'pre' | 'clean' | 'turnkey';

export interface Apartment {
  /** Stable id used in URLs, e.g. `10-03-2`. */
  id: string;
  /** Sales number shown to the buyer, e.g. `204`. */
  number: string;
  blockId: '10' | '11';
  blockLetter: string;
  floor: number;
  rooms: 1 | 2 | 3 | 4;
  planId: string;
  area: number;
  livingArea: number;
  kitchenArea: number;
  bathrooms: number;
  balconies: number;
  /** Ceiling height in metres. */
  ceiling: number;
  price: number;
  pricePerSqm: number;
  status: UnitStatus;
  view: ViewKind;
  finishing: FinishingKind;
  /** Sold on a developer payment plan. */
  installment: boolean;
  /** Price sits under a state-programme cap for this city. */
  stateProgram: boolean;
  /** Position on the landing, 1-based, left to right. */
  position: number;
}

/* ── Deterministic pseudo-random source ───────────────────────────────────── */

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Plan distribution per block and floor band ───────────────────────────── */

const PATTERNS: Record<'10' | '11', string[][]> = {
  '10': [
    ['1A', '2A', '2C', '3A', '3C', '4A'],
    ['2A', '2C', '3A', '3C', '4A', '1A'],
    ['1A', '2A', '3A', '3C', '2C', '4A'],
    ['2A', '2C', '1A', '3A', '3C', '4A'],
  ],
  '11': [
    ['1A', '2A', '2C', '3A', '3C', '4A'],
    ['2C', '3A', '1A', '2A', '4A', '3C'],
    ['2A', '1A', '2C', '3C', '4A', '3A'],
    ['3A', '2C', '2A', '1A', '3C', '4A'],
  ],
};

/** Views by position on the landing — edges see the city, the middle sees the yard. */
const VIEWS_6: ViewKind[] = ['city', 'courtyard', 'courtyard', 'park', 'steppe', 'city'];

/** Blocks are numbered in the hundreds so numbers are recognisable on the phone. */
const NUMBER_OFFSET: Record<'10' | '11', number> = { '10': 0, '11': 200 };

/* ── Sales model: status, finishing, bathrooms, payment plan ──────────────── */

/**
 * Where a unit sits in the sales cycle. Blocks №10 and №11 are both in active
 * sales, so the lower floors — released first and easiest to sell — carry more
 * sold stock, with demand tapering off with height. `roll` is the unit's own
 * deterministic draw in [0, 1).
 */
function statusFor(block: Block, floor: number, roll: number): UnitStatus {
  const height = block.floors > 1 ? (floor - 1) / (block.floors - 1) : 0;

  const sold = block.status === 'soon' ? 0.05 : 0.5 - height * 0.3;
  const reserved = block.status === 'soon' ? 0.04 : 0.21 - height * 0.07;

  if (roll < sold) return 'sold';
  if (roll < sold + reserved) return 'reserved';
  return 'available';
}

/** Every unit is handed over with the documented pre-finishing. */
function finishingFor(): FinishingKind {
  return 'pre';
}

function bathroomsFor(rooms: 1 | 2 | 3 | 4): number {
  if (rooms === 1) return 1;
  if (rooms === 2) return 1;
  return 2;
}

/* ── Inventory generation ─────────────────────────────────────────────────── */

function buildInventory(): Apartment[] {
  const units: Apartment[] = [];

  for (const block of BLOCKS) {
    const patterns = PATTERNS[block.id];

    for (let floor = 1; floor <= block.floors; floor += 1) {
      const pattern = patterns[floor % patterns.length];

      for (let pos = 0; pos < block.unitsPerFloor; pos += 1) {
        const planId = pattern[pos] ?? pattern[pattern.length - 1];
        const plan = getFloorPlan(planId);
        if (!plan) continue;

        // One independent draw per unit keeps the whole inventory reproducible.
        const roll = mulberry32(block.letter.charCodeAt(0) * 100_000 + floor * 137 + pos * 17)();

        const view = VIEWS_6[pos] ?? 'courtyard';

        // The price is the developer's published price per m² for this room
        // type (dossier §3) — not a modelled figure. The published prices are
        // exactly `area × price per m²` (24 640 590 = 46,23 × 533 000), so the
        // multiplication is kept unrounded and the figure matches the source to
        // the tenge.
        const pricePerSqm = PROJECT.pricePerSqmByRooms[plan.rooms];
        const price = Math.round(plan.totalArea * pricePerSqm);

        const status = statusFor(block, floor, roll);
        // The panoramic four-room homes on the top floors are the most expensive
        // lots and are sold without the interest-free instalment.
        const installment = !(plan.rooms === 4 && floor >= block.floors - 2);

        units.push({
          id: `${block.letter}-${String(floor).padStart(2, '0')}-${pos + 1}`,
          number: String((floor - 1) * block.unitsPerFloor + pos + 1 + NUMBER_OFFSET[block.id]),
          blockId: block.id,
          blockLetter: block.letter,
          floor,
          rooms: plan.rooms,
          planId: plan.id,
          area: plan.totalArea,
          livingArea: plan.livingArea,
          kitchenArea: plan.kitchenArea,
          bathrooms: bathroomsFor(plan.rooms),
          balconies: plan.layout.filter((r) => r.outside).length,
          ceiling: 3.0,
          price,
          pricePerSqm,
          status,
          view,
          finishing: finishingFor(),
          installment,
          // The developer confirmed the complex does not use the state
          // subsidy programme, so no unit is flagged as programme-eligible.
          stateProgram: false,
          position: pos + 1,
        });
      }
    }
  }

  return units;
}

export const APARTMENTS: Apartment[] = buildInventory();

/**
 * The projection the catalogue ships to the browser.
 *
 * The cards, the filters and the unit grid need exactly these fields, so this is
 * the boundary between "the data model" and "what the client sees".
 */
export type UnitSummary = Pick<
  Apartment,
  | 'id'
  | 'number'
  | 'blockId'
  | 'floor'
  | 'rooms'
  | 'planId'
  | 'area'
  | 'price'
  | 'pricePerSqm'
  | 'status'
  | 'view'
  | 'finishing'
  | 'ceiling'
  | 'stateProgram'
>;

export const UNIT_SUMMARIES: UnitSummary[] = APARTMENTS.map((unit) => ({
  id: unit.id,
  number: unit.number,
  blockId: unit.blockId,
  floor: unit.floor,
  rooms: unit.rooms,
  planId: unit.planId,
  area: unit.area,
  price: unit.price,
  pricePerSqm: unit.pricePerSqm,
  status: unit.status,
  view: unit.view,
  finishing: unit.finishing,
  ceiling: unit.ceiling,
  stateProgram: unit.stateProgram,
}));

/* ── Home-page showroom ───────────────────────────────────────────────────── */

/**
 * The room mix shown on the home page: all four layouts are represented (1-, 2-,
 * 3- and 4-room) plus two extra family-sized lots. Units are picked from
 * available stock only, preferring a new floor and a view not shown yet, and the
 * result is ordered from the least to the most expensive.
 */
const FEATURED_ROOMS: Array<Apartment['rooms']> = [1, 2, 3, 4, 2, 3];

function selectFeatured(): Apartment[] {
  const pool = APARTMENTS.filter((unit) => unit.status === 'available').sort(
    (a, b) => a.price - b.price,
  );

  const chosen: Apartment[] = [];
  const usedFloors = new Set<number>();
  const usedViews = new Set<ViewKind>();

  for (const rooms of FEATURED_ROOMS) {
    const free = (unit: Apartment) => unit.rooms === rooms && !chosen.includes(unit);

    const pick =
      pool.find((u) => free(u) && !usedFloors.has(u.floor) && !usedViews.has(u.view)) ??
      pool.find((u) => free(u) && !usedFloors.has(u.floor)) ??
      pool.find(free);

    if (!pick) continue;
    chosen.push(pick);
    usedFloors.add(pick.floor);
    usedViews.add(pick.view);
  }

  return chosen.sort((a, b) => a.price - b.price);
}

export const FEATURED_UNITS: Apartment[] = selectFeatured();

/**
 * The date the prices and the availability figures are valid for.
 *
 * Without it "от 24,6 млн ₸" and "128 в продаже" read as permanent guarantees.
 * The dossier records the developer's prices and availability as at
 * 21 August 2026, so that is the date shown everywhere prices appear.
 */
export const INVENTORY_UPDATED_AT = '2026-08-21';

/* ── Derived aggregates, computed once ────────────────────────────────────── */

const available = APARTMENTS.filter((a) => a.status === 'available');
const inventoryCounts = countInventory(APARTMENTS);

export const INVENTORY_STATS = {
  ...inventoryCounts,
  minPrice: Math.min(...APARTMENTS.map((a) => a.price)),
  maxPrice: Math.max(...APARTMENTS.map((a) => a.price)),
  minAvailablePrice: available.length ? Math.min(...available.map((a) => a.price)) : 0,
  minArea: Math.min(...APARTMENTS.map((a) => a.area)),
  maxArea: Math.max(...APARTMENTS.map((a) => a.area)),
  /** Units that fit under the state-programme price cap. */
  stateProgramUnits: countInventory(APARTMENTS.filter((a) => a.stateProgram)).available,
  availableByPlan: Object.fromEntries(
    FLOOR_PLANS.map((plan) => [
      plan.id,
      APARTMENTS.filter((a) => a.planId === plan.id && a.status === 'available').length,
    ]),
  ) as Record<string, number>,
  /** Every plan type always has at least this many free units (sanity check). */
  minAvailablePerPlan: Math.min(
    ...FLOOR_PLANS.map(
      (plan) => APARTMENTS.filter((a) => a.planId === plan.id && a.status === 'available').length,
    ),
  ),
};

export const getApartment = (id: string): Apartment | undefined =>
  APARTMENTS.find((a) => a.id === id);

export const getApartmentsByPlan = (planId: string): Apartment[] =>
  APARTMENTS.filter((a) => a.planId === planId);

export const getUnitsForBlockFloor = (blockId: string, floor: number): Apartment[] =>
  APARTMENTS.filter((a) => a.blockId === blockId && a.floor === floor).sort(
    (a, b) => a.position - b.position,
  );

/** Floors that exist in a block, ascending — used by the unit grid layout. */
export const getBlockFloors = (blockId: string): number[] =>
  Array.from({ length: BLOCKS.find((b) => b.id === blockId)?.floors ?? 0 }, (_, i) => i + 1);

export const SIMILAR_LIMIT = 3;

export function getSimilarApartments(unit: Apartment, limit = SIMILAR_LIMIT): Apartment[] {
  return APARTMENTS.filter(
    (a) =>
      a.id !== unit.id &&
      a.status === 'available' &&
      Math.abs(a.rooms - unit.rooms) <= 1 &&
      Math.abs(a.area - unit.area) <= 12,
  )
    .sort((a, b) => Math.abs(a.area - unit.area) - Math.abs(b.area - unit.area))
    .slice(0, limit);
}
