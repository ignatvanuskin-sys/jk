import type { Locale } from '@/i18n/config';
import { FLOOR_PLANS } from './floorplans';
import { APARTMENTS } from './apartments';
import { countInventory } from '@/lib/domain/inventory';

/**
 * Compact, serialisable projection of each floor plan.
 *
 * The plan viewer runs in the browser, so it needs the geometry (to draw the
 * SVG), the counts and the price — but not the 214-unit inventory. This is the
 * boundary that keeps the client payload small.
 */
export interface PlanSummary {
  id: string;
  rooms: 1 | 2 | 3 | 4;
  name: Record<Locale, string>;
  envelope: { w: number; h: number };
  layout: { key: string; x: number; y: number; w: number; h: number; outside?: boolean }[];
  totalArea: number;
  livingArea: number;
  kitchenArea: number;
  bathrooms: number;
  balconies: number;
  kitchenInLiving: boolean;
  /** Floors on which this layout is still available. */
  floors: number[];
  /** Number of units of this layout currently available. */
  available: number;
  /** Lowest available price for this layout. */
  priceFrom: number;
}

export const PLAN_SUMMARIES: PlanSummary[] = FLOOR_PLANS.map((plan) => {
  const units = APARTMENTS.filter((unit) => unit.planId === plan.id);
  const available = units.filter((unit) => unit.status === 'available');
  const pricePool = available.length > 0 ? available : units;

  return {
    id: plan.id,
    rooms: plan.rooms,
    name: plan.name,
    envelope: plan.envelope,
    layout: plan.layout.map((room) => ({
      key: room.key,
      x: room.x,
      y: room.y,
      w: room.w,
      h: room.h,
      outside: room.outside,
    })),
    totalArea: plan.totalArea,
    livingArea: plan.livingArea,
    kitchenArea: plan.kitchenArea,
    bathrooms: plan.bathrooms,
    balconies: plan.layout.filter((room) => room.outside).length,
    kitchenInLiving: plan.kitchenInLiving,
    floors: Array.from(new Set(available.map((unit) => unit.floor))).sort((a, b) => a - b),
    available: countInventory(units).available,
    priceFrom: pricePool.length ? Math.min(...pricePool.map((unit) => unit.price)) : 0,
  };
});

export const getPlanSummary = (id: string): PlanSummary | undefined =>
  PLAN_SUMMARIES.find((plan) => plan.id === id);

export const plansForRooms = (rooms: 1 | 2 | 3 | 4): PlanSummary[] =>
  PLAN_SUMMARIES.filter((plan) => plan.rooms === rooms);
