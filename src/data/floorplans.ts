/**
 * Floor plans.
 *
 * Every plan is described geometrically in metres. Room areas, living area and
 * the plan's total area are all DERIVED from that geometry, so the catalogue,
 * the plan detail page and the SVG drawing can never drift apart.
 *
 * DATA SOURCE — the six layouts below are authored so that each DERIVED total
 * area equals the real published area of the project exactly (see
 * `docs/real-data-dossier.md`, §2 "Планировки и цены", prices and availability
 * valid as at 21 August 2026):
 *
 *   1A  46,23 m²  1-room
 *   2A  60,74 m²  2-room
 *   2C  86,07 m²  2-room
 *   3A  91,81 m²  3-room
 *   3C 104,69 m²  3-room
 *   4A 171,73 m²  4-room
 *
 * The room rectangles are the invented part: the developer does not publish
 * per-room drawings, so the geometry is a demo approximation tuned to produce
 * the real total. Everything computed from it (areas, room counts) is real.
 */

export interface RoomRect {
  /** Key into dictionary `floorplans.roomLabels`. */
  key: string;
  /** Position and size in metres, origin at the plan's top-left corner. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Balconies sit outside the envelope and are excluded from the total area. */
  outside?: boolean;
  /** Direction of the dimension label. */
  dim?: 'h' | 'v';
}

export interface FloorPlan {
  id: string;
  /** Number of living rooms (used for grouping and filtering). */
  rooms: 1 | 2 | 3 | 4;
  /** Short marketing name. */
  name: { ru: string; kz: string; en: string };
  /** Envelope of the apartment, in metres. */
  envelope: { w: number; h: number };
  layout: RoomRect[];
}

const area = (r: RoomRect) => r.w * r.h;

/** Plans, authored on a metric grid so the totals land on the published areas. */
const PLAN_DEFINITIONS: FloorPlan[] = [
  {
    id: '1A',
    rooms: 1,
    name: { ru: 'Компакт', kz: 'Компакт', en: 'Compact' },
    envelope: { w: 8.5, h: 7.9 },
    layout: [
      { key: 'hall', x: 0, y: 0, w: 4.1, h: 2.2 },
      { key: 'kitchen', x: 4.1, y: 0, w: 4.4, h: 2.2 },
      { key: 'bathroom', x: 0, y: 2.2, w: 1.8, h: 2.3 },
      { key: 'storage', x: 1.8, y: 2.2, w: 2.3, h: 1.7 },
      { key: 'living', x: 0, y: 4.5, w: 5.73, h: 3.4, dim: 'h' },
      { key: 'balcony', x: 0.6, y: 7.9, w: 3.2, h: 1.1, outside: true },
    ],
  },
  {
    id: '2A',
    rooms: 2,
    name: { ru: 'Евро-2', kz: 'Еуро-2', en: 'Euro 2' },
    envelope: { w: 12.2, h: 6.0 },
    layout: [
      { key: 'hall', x: 0, y: 0, w: 2.8, h: 2.0 },
      { key: 'kitchen', x: 2.8, y: 0, w: 2.9, h: 2.7 },
      { key: 'bathroom', x: 5.7, y: 0, w: 2.5, h: 2.0 },
      { key: 'storage', x: 8.2, y: 0, w: 4.0, h: 1.6 },
      { key: 'bedroom', x: 0, y: 2.7, w: 5.4, h: 3.3, dim: 'h' },
      { key: 'living', x: 5.4, y: 2.7, w: 6.03, h: 3.0, dim: 'h' },
      { key: 'balcony', x: 0.6, y: 6.0, w: 3.6, h: 1.2, outside: true },
    ],
  },
  {
    id: '2C',
    rooms: 2,
    name: { ru: 'Классика', kz: 'Классика', en: 'Classic' },
    envelope: { w: 14.1, h: 7.3 },
    layout: [
      { key: 'hall', x: 0, y: 0, w: 4.0, h: 2.5 },
      { key: 'kitchen', x: 4.0, y: 0, w: 4.4, h: 3.2 },
      { key: 'bathroom', x: 8.4, y: 0, w: 2.4, h: 1.9 },
      { key: 'storage', x: 10.8, y: 0, w: 3.3, h: 2.0 },
      { key: 'bedroom', x: 0, y: 3.2, w: 5.2, h: 2.9, dim: 'h' },
      { key: 'living', x: 5.2, y: 3.2, w: 8.72, h: 4.1, dim: 'h' },
      { key: 'balcony', x: 0.6, y: 7.3, w: 4.0, h: 1.3, outside: true },
      { key: 'balcony', x: 5.4, y: 7.3, w: 3.0, h: 1.3, outside: true },
    ],
  },
  {
    id: '3A',
    rooms: 3,
    name: { ru: 'Семейная', kz: 'Отбасылық', en: 'Family' },
    envelope: { w: 14.43, h: 8.0 },
    layout: [
      { key: 'hall', x: 0, y: 0, w: 2.7, h: 3.6 },
      { key: 'kitchen', x: 2.7, y: 0, w: 3.3, h: 3.2 },
      { key: 'bathroom', x: 6.0, y: 0, w: 2.4, h: 2.6 },
      { key: 'bathroom2', x: 8.4, y: 0, w: 2.8, h: 2.1 },
      { key: 'storage', x: 11.2, y: 0, w: 2.0, h: 2.1 },
      { key: 'bedroom', x: 0, y: 3.6, w: 3.4, h: 3.0, dim: 'h' },
      { key: 'bedroom2', x: 3.4, y: 3.6, w: 3.2, h: 3.3, dim: 'h' },
      { key: 'living', x: 6.6, y: 3.6, w: 7.83, h: 4.4, dim: 'h' },
      { key: 'balcony', x: 0.8, y: 8.0, w: 4.2, h: 1.4, outside: true },
      { key: 'balcony', x: 5.4, y: 8.0, w: 3.4, h: 1.4, outside: true },
    ],
  },
  {
    id: '3C',
    rooms: 3,
    name: { ru: 'Просторная', kz: 'Кең', en: 'Spacious' },
    envelope: { w: 16.3, h: 7.1 },
    layout: [
      { key: 'hall', x: 0, y: 0, w: 3.0, h: 2.0 },
      { key: 'kitchen', x: 3.0, y: 0, w: 3.8, h: 2.9 },
      { key: 'bathroom', x: 6.8, y: 0, w: 2.3, h: 2.6 },
      { key: 'bathroom2', x: 9.1, y: 0, w: 3.0, h: 2.3 },
      { key: 'storage', x: 12.1, y: 0, w: 4.2, h: 2.4 },
      { key: 'bedroom', x: 0, y: 2.9, w: 4.4, h: 4.5, dim: 'h' },
      { key: 'bedroom2', x: 4.4, y: 2.9, w: 3.0, h: 3.0, dim: 'h' },
      { key: 'living', x: 7.4, y: 2.9, w: 8.55, h: 4.2, dim: 'h' },
      { key: 'balcony', x: 0.6, y: 7.1, w: 4.6, h: 1.5, outside: true },
      { key: 'balcony', x: 5.6, y: 7.1, w: 4.0, h: 1.5, outside: true },
    ],
  },
  {
    id: '4A',
    rooms: 4,
    name: { ru: 'Панорамная', kz: 'Панорамалық', en: 'Panoramic' },
    envelope: { w: 18.4, h: 13.6 },
    layout: [
      { key: 'hall', x: 0, y: 0, w: 4.3, h: 3.3 },
      { key: 'kitchen', x: 4.3, y: 0, w: 4.4, h: 3.2 },
      { key: 'bathroom', x: 8.7, y: 0, w: 2.7, h: 2.1 },
      { key: 'bathroom2', x: 11.4, y: 0, w: 2.6, h: 2.4 },
      { key: 'storage', x: 14.0, y: 0, w: 4.4, h: 2.4 },
      { key: 'bedroom', x: 0, y: 3.3, w: 5.3, h: 3.9, dim: 'h' },
      { key: 'bedroom2', x: 5.3, y: 3.3, w: 4.8, h: 3.0, dim: 'h' },
      { key: 'bedroom3', x: 10.1, y: 3.3, w: 5.3, h: 4.4, dim: 'h' },
      { key: 'living', x: 0, y: 7.7, w: 10.61, h: 5.9, dim: 'h' },
      { key: 'balcony', x: 0.6, y: 13.6, w: 4.6, h: 1.5, outside: true },
      { key: 'balcony', x: 5.6, y: 13.6, w: 4.0, h: 1.5, outside: true },
    ],
  },
];

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Public plans: geometry plus every derived figure.
 * Rooms with zero size are dropped.
 */
export const FLOOR_PLANS = PLAN_DEFINITIONS.map((plan) => {
  const layout = plan.layout.filter((r) => r.w > 0 && r.h > 0);
  const inside = layout.filter((r) => !r.outside);

  const totalArea = round2(inside.reduce((sum, r) => sum + area(r), 0));
  const balconyArea = round2(
    layout.filter((r) => r.outside).reduce((sum, r) => sum + area(r), 0),
  );
  const livingArea = round2(
    inside.filter((r) => ['living', 'bedroom', 'bedroom2', 'bedroom3'].includes(r.key))
      .reduce((sum, r) => sum + area(r), 0),
  );
  const kitchenArea = round2(
    inside.filter((r) => r.key === 'kitchen').reduce((sum, r) => sum + area(r), 0),
  );

  return {
    ...plan,
    layout,
    totalArea,
    balconyArea,
    livingArea,
    kitchenArea,
    bathrooms: inside.filter((r) => r.key.startsWith('bathroom')).length,
    bedrooms: inside.filter((r) => r.key.startsWith('bedroom')).length,
    /** True for plans whose kitchen is merged into the living room. */
    kitchenInLiving: kitchenArea === 0,
  };
});

export type DerivedFloorPlan = (typeof FLOOR_PLANS)[number];

export const getFloorPlan = (id: string): DerivedFloorPlan | undefined =>
  FLOOR_PLANS.find((p) => p.id === id);

/** Plans grouped by room count, for the tabbed floor-plan section. */
export const plansByRooms = (rooms: 1 | 2 | 3 | 4) =>
  FLOOR_PLANS.filter((p) => p.rooms === rooms);
