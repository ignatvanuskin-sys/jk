/**
 * Floor plans.
 *
 * Every plan is described geometrically in metres. Room areas, living area and
 * the plan's total area are all DERIVED from that geometry, so the catalogue,
 * the plan detail page and the SVG drawing can never drift apart.
 *
 * ⚠️  DEMONSTRATION BUILD — the layouts are plausible but invented. Replace the
 * geometry with the developer's real drawings, or swap `layout` for an image
 * source, before launch.
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

/** Plans, authored on a metric grid. */
const PLAN_DEFINITIONS: FloorPlan[] = [
  {
    id: '1A',
    rooms: 1,
    name: { ru: 'Компакт', kz: 'Компакт', en: 'Compact' },
    envelope: { w: 8.0, h: 4.8 },
    layout: [
      { key: 'living', x: 0, y: 2.2, w: 8.0, h: 2.6 },
      { key: 'hall', x: 0, y: 0, w: 2.2, h: 2.2 },
      { key: 'bathroom', x: 2.2, y: 0, w: 1.8, h: 2.2 },
      { key: 'kitchen', x: 4.0, y: 0, w: 2.6, h: 2.2 },
      { key: 'storage', x: 6.6, y: 0, w: 1.4, h: 2.2 },
      { key: 'balcony', x: 0.6, y: 4.8, w: 3.2, h: 1.1, outside: true },
    ],
  },
  {
    id: '1B',
    rooms: 1,
    name: { ru: 'Угловая', kz: 'Бұрыштағы', en: 'Corner' },
    envelope: { w: 8.4, h: 5.4 },
    layout: [
      { key: 'living', x: 0, y: 2.4, w: 8.4, h: 3.0 },
      { key: 'hall', x: 0, y: 0, w: 2.4, h: 2.4 },
      { key: 'bathroom', x: 2.4, y: 0, w: 1.8, h: 2.4 },
      { key: 'kitchen', x: 4.2, y: 0, w: 2.8, h: 2.4 },
      { key: 'storage', x: 7.0, y: 0, w: 1.4, h: 2.4 },
      { key: 'balcony', x: 0.5, y: 5.4, w: 3.4, h: 1.2, outside: true },
      { key: 'balcony', x: 4.5, y: 5.4, w: 3.4, h: 1.2, outside: true },
    ],
  },
  {
    id: '2A',
    rooms: 2,
    name: { ru: 'Евро-2', kz: 'Еуро-2', en: 'Euro 2' },
    envelope: { w: 9.0, h: 5.3 },
    layout: [
      { key: 'living', x: 0, y: 2.3, w: 5.0, h: 3.0 },
      { key: 'bedroom', x: 5.0, y: 2.3, w: 4.0, h: 3.0 },
      { key: 'hall', x: 0, y: 0, w: 2.6, h: 2.3 },
      { key: 'bathroom', x: 2.6, y: 0, w: 1.8, h: 2.3 },
      { key: 'storage', x: 4.4, y: 0, w: 1.6, h: 2.3 },
      { key: 'kitchen', x: 6.0, y: 0, w: 3.0, h: 2.3 },
      { key: 'balcony', x: 0.6, y: 5.3, w: 3.6, h: 1.2, outside: true },
    ],
  },
  {
    id: '2C',
    rooms: 2,
    name: { ru: 'Классика', kz: 'Классика', en: 'Classic' },
    envelope: { w: 9.6, h: 6.2 },
    layout: [
      { key: 'living', x: 0, y: 2.6, w: 5.2, h: 3.6 },
      { key: 'bedroom', x: 5.2, y: 2.6, w: 4.4, h: 3.6 },
      { key: 'kitchen', x: 0, y: 0, w: 3.0, h: 2.6 },
      { key: 'hall', x: 3.0, y: 0, w: 2.4, h: 2.6 },
      { key: 'bathroom', x: 5.4, y: 0, w: 2.0, h: 2.6 },
      { key: 'storage', x: 7.4, y: 0, w: 2.2, h: 2.6 },
      { key: 'balcony', x: 0.6, y: 6.2, w: 4.0, h: 1.3, outside: true },
      { key: 'balcony', x: 5.2, y: 6.2, w: 3.0, h: 1.3, outside: true },
    ],
  },
  {
    id: '3A',
    rooms: 3,
    name: { ru: 'Семейная', kz: 'Отбасылық', en: 'Family' },
    envelope: { w: 10.4, h: 7.4 },
    layout: [
      { key: 'living', x: 0, y: 2.6, w: 4.4, h: 4.8 },
      { key: 'bedroom', x: 4.4, y: 2.6, w: 3.4, h: 4.8 },
      { key: 'bedroom2', x: 7.8, y: 2.6, w: 2.6, h: 4.8 },
      { key: 'kitchen', x: 0, y: 0, w: 3.0, h: 2.6 },
      { key: 'hall', x: 3.0, y: 0, w: 2.6, h: 2.6 },
      { key: 'bathroom', x: 5.6, y: 0, w: 2.0, h: 2.6 },
      { key: 'storage', x: 7.6, y: 0, w: 1.4, h: 2.6 },
      { key: 'bathroom2', x: 9.0, y: 0, w: 1.4, h: 2.6 },
      { key: 'balcony', x: 0.8, y: 7.4, w: 4.2, h: 1.4, outside: true },
      { key: 'balcony', x: 5.4, y: 7.4, w: 3.4, h: 1.4, outside: true },
    ],
  },
  {
    id: '4A',
    rooms: 4,
    name: { ru: 'Панорамная', kz: 'Панорамалық', en: 'Panoramic' },
    envelope: { w: 12.0, h: 9.0 },
    layout: [
      { key: 'living', x: 0, y: 2.8, w: 5.0, h: 6.2 },
      { key: 'bedroom', x: 5.0, y: 2.8, w: 3.6, h: 6.2 },
      { key: 'bedroom2', x: 8.6, y: 2.8, w: 3.4, h: 6.2 },
      { key: 'kitchen', x: 0, y: 0, w: 3.6, h: 2.8 },
      { key: 'hall', x: 3.6, y: 0, w: 3.0, h: 2.8 },
      { key: 'bathroom', x: 6.6, y: 0, w: 2.2, h: 2.8 },
      { key: 'bathroom2', x: 8.8, y: 0, w: 1.6, h: 2.8 },
      { key: 'storage', x: 10.4, y: 0, w: 1.6, h: 2.8 },
      { key: 'balcony', x: 0.6, y: 9.0, w: 4.6, h: 1.5, outside: true },
      { key: 'balcony', x: 5.6, y: 9.0, w: 4.0, h: 1.5, outside: true },
    ],
  },
];

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Public plans: geometry plus every derived figure.
 * Rooms with zero size are dropped (used to keep the 3-room layout aligned
 * without a second WC on every variant).
 */
export const FLOOR_PLANS = PLAN_DEFINITIONS.map((plan) => {
  const layout = plan.layout.filter((r) => r.w > 0 && r.h > 0);
  const inside = layout.filter((r) => !r.outside);

  const totalArea = round1(inside.reduce((sum, r) => sum + area(r), 0));
  const balconyArea = round1(
    layout.filter((r) => r.outside).reduce((sum, r) => sum + area(r), 0),
  );
  const livingArea = round1(
    inside.filter((r) => ['living', 'bedroom', 'bedroom2', 'bedroom3'].includes(r.key))
      .reduce((sum, r) => sum + area(r), 0),
  );
  const kitchenArea = round1(
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
