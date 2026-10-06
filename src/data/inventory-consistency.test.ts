import { describe, expect, it } from 'vitest';

import { APARTMENTS, INVENTORY_STATS, UNIT_SUMMARIES, type UnitStatus } from './apartments';
import { FLOOR_PLANS } from './floorplans';
import { PLAN_SUMMARIES } from './plan-summaries';
import { PROJECT } from './project';

/**
 * Audit 1.1 — one set of numbers.
 *
 * Every counter on the site (hero, home, catalogue, unit grid, floor plans) has
 * to be derivable from the seed inventory and from nothing else. This suite no
 * longer asserts that the inventory equals the complex total: only blocks №10
 * and №11 are on sale, so the inventory must be ≤ the complex total (346) and
 * equal to `APARTMENTS.length`.
 */

const DEFAULT_STATUS_FILTER: UnitStatus[] = ['available'];

/** Mirrors the catalogue's default filter state (see ApartmentsExplorer). */
const catalogueWithDefaults = () =>
  UNIT_SUMMARIES.filter((unit) => DEFAULT_STATUS_FILTER.includes(unit.status));

/** The real published plan areas (dossier §3), 2 decimals. */
const PUBLISHED_PLAN_AREAS = [46.23, 60.74, 86.07, 91.81, 104.69, 171.73];

describe('inventory counters', () => {
  it('keeps the inventory total equal to the number of generated units', () => {
    expect(INVENTORY_STATS.total).toBe(APARTMENTS.length);
  });

  it('never exceeds the complex total', () => {
    expect(INVENTORY_STATS.total).toBeLessThanOrEqual(PROJECT.complexTotalUnits);
    expect(INVENTORY_STATS.available + INVENTORY_STATS.reserved + INVENTORY_STATS.sold).toBe(
      INVENTORY_STATS.total,
    );
  });

  it('matches the catalogue default filter', () => {
    const found = catalogueWithDefaults();

    expect(found.length).toBe(INVENTORY_STATS.available);
    expect(found.length).toBeGreaterThan(0);
    expect(found.every((unit) => unit.status === 'available')).toBe(true);
  });

  it('derives the hero price from the same available set', () => {
    const prices = APARTMENTS.filter((unit) => unit.status === 'available').map((unit) => unit.price);

    expect(INVENTORY_STATS.minAvailablePrice).toBe(Math.min(...prices));
  });

  it('keeps the state-programme counter on available units only', () => {
    const eligible = APARTMENTS.filter((unit) => unit.stateProgram && unit.status === 'available');

    expect(INVENTORY_STATS.stateProgramUnits).toBe(eligible.length);
  });
});

describe('floor plans and finishing', () => {
  it('puts every plan of the catalogue on the floor-plan page', () => {
    expect(PLAN_SUMMARIES.length).toBe(FLOOR_PLANS.length);
    expect(PLAN_SUMMARIES.length).toBeGreaterThan(4);

    for (const plan of PLAN_SUMMARIES) {
      expect(APARTMENTS.some((unit) => unit.planId === plan.id)).toBe(true);
    }
  });

  it('derives each plan total to a real published area', () => {
    const totals = FLOOR_PLANS.map((plan) => plan.totalArea).sort((a, b) => a - b);

    expect(totals).toEqual(PUBLISHED_PLAN_AREAS);
  });

  it('keeps every apartment consistent with its plan', () => {
    for (const unit of APARTMENTS) {
      const plan = FLOOR_PLANS.find((candidate) => candidate.id === unit.planId);

      expect(plan, `unknown plan for unit ${unit.id}`).toBeDefined();
      expect(unit.area).toBe(plan?.totalArea);
      expect(unit.rooms).toBe(plan?.rooms);
    }
  });

  it('accounts for every available apartment in exactly one plan', () => {
    const perPlan = PLAN_SUMMARIES.reduce((sum, plan) => sum + plan.available, 0);

    expect(perPlan).toBe(INVENTORY_STATS.available);
  });

  it('hands every apartment over with the documented finishing', () => {
    expect(APARTMENTS.every((unit) => unit.finishing === 'pre')).toBe(true);
  });
});
