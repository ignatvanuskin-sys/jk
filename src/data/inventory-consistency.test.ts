import { describe, expect, it } from 'vitest';

import { APARTMENTS, INVENTORY_STATS, UNIT_SUMMARIES, type UnitStatus } from './apartments';
import { FLOOR_PLANS } from './floorplans';
import { PLAN_SUMMARIES } from './plan-summaries';
import { PROJECT } from './project';

/**
 * Audit 1.1 — one set of numbers.
 *
 * Every counter on the site (hero, home, catalogue, unit grid, floor plans,
 * state-programme) has to be derivable from the seed inventory and from nothing
 * else. The catalogue's default filter state is `status = available`, so its
 * "found" figure and the hero's availability figure must be the same number.
 */

const DEFAULT_STATUS_FILTER: UnitStatus[] = ['available'];

/** Mirrors the catalogue's default filter state (see ApartmentsExplorer). */
const catalogueWithDefaults = () =>
  UNIT_SUMMARIES.filter((unit) => DEFAULT_STATUS_FILTER.includes(unit.status));

describe('inventory counters', () => {
  it('keeps one total for the whole project', () => {
    expect(INVENTORY_STATS.total).toBe(APARTMENTS.length);
    expect(INVENTORY_STATS.total).toBe(PROJECT.totalUnits);
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
