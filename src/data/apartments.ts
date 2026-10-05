/**
 * Apartment inventory.
 *
 * The complete sales inventory of the complex — 214 apartments across blocks A,
 * B and C — modelled in one place. Every unit is produced by a deterministic,
 * seeded generator, so a unit's number, area, price, status, finish and view are
 * identical on the server, in the browser and in the generated JSON-LD: the
 * catalogue, the unit grid and the structured data can never drift apart.
 *
 * This module is the single source of truth for every consumer. Pages and
 * components read `APARTMENTS`, `UNIT_SUMMARIES`, `INVENTORY_STATS`,
 * `FEATURED_UNITS` and the lookup helpers, and none of them hard-codes a unit.
 * Connecting the developer's CRM means replacing `buildInventory()` with a
 * fetch/API call, or swapping `APARTMENTS` for the live feed — the shape below
 * stays the same.
 */

import { BLOCKS, PROJECT, type Block } from './project';
import { FLOOR_PLANS, getFloorPlan } from './floorplans';

export type UnitStatus = 'available' | 'reserved' | 'sold';
export type ViewKind = 'courtyard' | 'city' | 'steppe' | 'park';
export type FinishKind = 'shell' | 'white' | 'turnkey';

export interface Apartment {
  /** Stable id used in URLs, e.g. `a-03-2`. */
  id: string;
  /** Sales number shown to the buyer, e.g. `204`. */
  number: string;
  blockId: 'a' | 'b' | 'c';
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
  finish: FinishKind;
  /** Sold on a developer payment plan. */
  installment: boolean;
  /** Price sits under the state-programme cap for this city. */
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

const PATTERNS: Record<'a' | 'b' | 'c', string[][]> = {
  a: [
    ['1A', '1B', '2A', '2C', '3A', '2A'],
    ['1A', '2A', '2C', '3A', '2C', '1B'],
    ['1B', '2A', '3A', '4A', '2C', '2A'],
    ['2A', '2C', '3A', '4A', '3A', '2C'],
  ],
  b: [
    ['1A', '2A', '1B', '2C', '2A', '3A'],
    ['1B', '2A', '2C', '2A', '3A', '2C'],
    ['2A', '2C', '3A', '3A', '4A', '2C'],
    ['1B', '2C', '3A', '3A', '4A', '2A'],
  ],
  c: [
    ['1A', '1B', '2A', '2C', '2A', '3A', '3A'],
    ['1A', '2A', '2C', '2A', '3A', '3A', '4A'],
    ['1B', '2A', '2C', '3A', '2C', '3A', '2C'],
    ['2A', '2C', '3A', '3A', '4A', '2C', '3A'],
  ],
};

/** Views by position on the landing — edges see the city, the middle sees the yard. */
const VIEWS_6: ViewKind[] = ['city', 'courtyard', 'courtyard', 'park', 'steppe', 'city'];
const VIEWS_7: ViewKind[] = ['city', 'courtyard', 'courtyard', 'park', 'courtyard', 'steppe', 'city'];

const VIEW_FACTOR: Record<ViewKind, number> = {
  courtyard: 1.0,
  steppe: 1.015,
  park: 1.03,
  city: 1.045,
};

/** Blocks are numbered in the hundreds so numbers are recognisable on the phone. */
const NUMBER_OFFSET: Record<'a' | 'b' | 'c', number> = { a: 0, b: 200, c: 400 };

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

/* ── Sales model: status, finish, bathrooms, payment plan ─────────────────── */

/**
 * Where a unit sits in the sales cycle.
 *
 * Blocks in active sales (A and B) have been on the market long enough for the
 * lower floors — the first to be released and the easiest to sell — to carry
 * noticeably more sold stock, with demand tapering off with height. A block that
 * has only just opened (C) is almost entirely free. `roll` is the unit's own
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

/**
 * Handover condition, driven by the release schedule rather than chance.
 * The ground floors of block C come turnkey, the larger homes on the top two
 * floors of every block are offered white-box, and the rest ship as shell.
 */
function finishFor(block: Block, floor: number, rooms: number): FinishKind {
  if (block.id === 'c' && floor <= 2) return 'turnkey';
  if (floor >= block.floors - 1 && rooms >= 3) return 'white';
  return 'shell';
}

/**
 * Bathroom count is a property of the layout: one-room homes have a single
 * bathroom, three- and four-room homes have two, and the two-room homes split —
 * the larger "Classic" plan (from 55 m²) includes a guest WC, the compact one
 * does not.
 */
function bathroomsFor(rooms: 1 | 2 | 3 | 4, area: number): number {
  if (rooms === 1) return 1;
  if (rooms === 2) return area >= 55 ? 2 : 1;
  return 2;
}

/* ── Inventory generation ─────────────────────────────────────────────────── */

function buildInventory(): Apartment[] {
  const units: Apartment[] = [];

  for (const block of BLOCKS) {
    const patterns = PATTERNS[block.id];
    const views = block.unitsPerFloor === 7 ? VIEWS_7 : VIEWS_6;

    for (let floor = 1; floor <= block.floors; floor += 1) {
      const pattern = patterns[floor % patterns.length];

      for (let pos = 0; pos < block.unitsPerFloor; pos += 1) {
        const planId = pattern[pos] ?? pattern[pattern.length - 1];
        const plan = getFloorPlan(planId);
        if (!plan) continue;

        // One independent draw per unit keeps the whole inventory reproducible.
        const roll = mulberry32(block.letter.charCodeAt(0) * 100_000 + floor * 137 + pos * 17)();

        const view = views[pos] ?? 'courtyard';

        const floorFactor =
          PROJECT.minPriceFloorFactor +
          ((floor - 1) / Math.max(1, block.floors - 1)) * (1.06 - PROJECT.minPriceFloorFactor);
        const price = roundTo(
          plan.totalArea * PROJECT.basePricePerSqm * floorFactor * VIEW_FACTOR[view],
          1_000,
        );

        const status = statusFor(block, floor, roll);
        // The panoramic four-room homes on the top floors are the most expensive
        // lots and are sold without the interest-free instalment.
        const installment = !(plan.rooms === 4 && floor >= block.floors - 2);

        units.push({
          id: `${block.letter.toLowerCase()}-${String(floor).padStart(2, '0')}-${pos + 1}`,
          number: String((floor - 1) * block.unitsPerFloor + pos + 1 + NUMBER_OFFSET[block.id]),
          blockId: block.id,
          blockLetter: block.letter,
          floor,
          rooms: plan.rooms,
          planId: plan.id,
          area: plan.totalArea,
          livingArea: plan.livingArea,
          kitchenArea: plan.kitchenArea,
          bathrooms: bathroomsFor(plan.rooms, plan.totalArea),
          balconies: plan.layout.filter((r) => r.outside).length,
          ceiling: 3.0,
          price,
          pricePerSqm: roundTo(price / plan.totalArea, 100),
          status,
          view,
          finish: finishFor(block, floor, plan.rooms),
          installment,
          stateProgram: price < PROJECT.stateProgramPriceCap,
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
 * Sending all 214 full `Apartment` objects would roughly double the page
 * payload; the cards, the filters and the unit grid need exactly these fields,
 * so this is the boundary between "the data model" and "what the client sees".
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
  | 'finish'
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
  finish: unit.finish,
  ceiling: unit.ceiling,
  stateProgram: unit.stateProgram,
}));

/* ── Home-page showroom ───────────────────────────────────────────────────── */

/**
 * The room mix shown on the home page: all four layouts are represented (1-, 2-,
 * 3- and 4-room) plus two extra family-sized lots, so the teaser runs from the
 * cheapest available entry point up to the panoramic top floor. Units are picked
 * from available stock only, preferring a new floor and a view not shown yet, and
 * the result is ordered from the least to the most expensive.
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

    // A fresh floor with an unseen view first, then a fresh floor, then anything.
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

/* ── Derived aggregates, computed once ────────────────────────────────────── */

const available = APARTMENTS.filter((a) => a.status === 'available');

export const INVENTORY_STATS = {
  total: APARTMENTS.length,
  available: available.length,
  reserved: APARTMENTS.filter((a) => a.status === 'reserved').length,
  sold: APARTMENTS.filter((a) => a.status === 'sold').length,
  minPrice: Math.min(...APARTMENTS.map((a) => a.price)),
  maxPrice: Math.max(...APARTMENTS.map((a) => a.price)),
  minAvailablePrice: available.length ? Math.min(...available.map((a) => a.price)) : 0,
  minArea: Math.min(...APARTMENTS.map((a) => a.area)),
  maxArea: Math.max(...APARTMENTS.map((a) => a.area)),
  /** Units that fit under the state-programme price cap. */
  stateProgramUnits: available.filter((a) => a.stateProgram).length,
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

/** Floors that exist in a block, descending — used by the unit grid layout. */
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
