/**
 * Neighbourhood infrastructure.
 *
 * ⚠️  DEMONSTRATION BUILD
 * Objects are described by GENERIC TYPE, never by an invented proper name — no
 * fake school numbers, no invented shopping-centre brands, no fabricated
 * distances presented as fact. Times and distances below are placeholders and
 * the section carries a visible notice saying so.
 *
 * Replace with real, verified POIs (name + address + walking time) before
 * launch. The grouping and the "time to landmark" presentation come from the
 * market research: it is how the strongest KZ developer sites handle location.
 */

export type InfraCategory =
  | 'education'
  | 'medicine'
  | 'shops'
  | 'malls'
  | 'parks'
  | 'sport'
  | 'cafes'
  | 'transport';

export interface InfraObject {
  id: string;
  category: InfraCategory;
  /** Generic descriptor — deliberately not a brand or institution name. */
  label: { ru: string; kz: string; en: string };
  /** Walking minutes from the main entrance (placeholder). */
  minutes: number;
  /** How the time was measured, so "7 мин" is never ambiguous. */
  mode: 'walk' | 'transport';
}

export const INFRA_CATEGORIES: InfraCategory[] = [
  'education',
  'medicine',
  'shops',
  'malls',
  'parks',
  'sport',
  'cafes',
  'transport',
];

export const INFRASTRUCTURE: InfraObject[] = [
  {
    id: 'school',
    category: 'education',
    label: {
      ru: 'Общеобразовательная школа',
      kz: 'Жалпы білім беретін мектеп',
      en: 'Secondary school',
    },
    minutes: 5,
    mode: 'walk',
  },
  {
    id: 'kindergarten',
    category: 'education',
    label: { ru: 'Детский сад', kz: 'Балабақша', en: 'Kindergarten' },
    minutes: 4,
    mode: 'walk',
  },
  {
    id: 'gymnasium',
    category: 'education',
    label: { ru: 'Гимназия', kz: 'Гимназия', en: 'Gymnasium' },
    minutes: 8,
    mode: 'walk',
  },
  {
    id: 'art-school',
    category: 'education',
    label: {
      ru: 'Детская школа искусств',
      kz: 'Балалар өнер мектебі',
      en: "Children's art school",
    },
    minutes: 12,
    mode: 'walk',
  },
  {
    id: 'polyclinic',
    category: 'medicine',
    label: { ru: 'Поликлиника', kz: 'Емхана', en: 'Outpatient clinic' },
    minutes: 8,
    mode: 'transport',
  },
  {
    id: 'hospital',
    category: 'medicine',
    label: { ru: 'Больница', kz: 'Аурухана', en: 'Hospital' },
    minutes: 15,
    mode: 'transport',
  },
  {
    id: 'pharmacy',
    category: 'medicine',
    label: { ru: 'Аптека', kz: 'Дәріхана', en: 'Pharmacy' },
    minutes: 3,
    mode: 'walk',
  },
  {
    id: 'dentist',
    category: 'medicine',
    label: { ru: 'Стоматология', kz: 'Стоматология', en: 'Dental clinic' },
    minutes: 6,
    mode: 'walk',
  },
  {
    id: 'supermarket',
    category: 'shops',
    label: { ru: 'Супермаркет', kz: 'Супермаркет', en: 'Supermarket' },
    minutes: 4,
    mode: 'walk',
  },
  {
    id: 'minimarket',
    category: 'shops',
    label: {
      ru: 'Минимаркет в доме',
      kz: 'Үйдегі минимаркет',
      en: 'Convenience store in the building',
    },
    minutes: 1,
    mode: 'walk',
  },
  {
    id: 'market',
    category: 'shops',
    label: { ru: 'Рынок', kz: 'Базар', en: 'Market' },
    minutes: 10,
    mode: 'walk',
  },
  {
    id: 'mall-1',
    category: 'malls',
    label: { ru: 'Торгово-развлекательный центр', kz: 'Сауда-ойын-сауық орталығы', en: 'Shopping mall' },
    minutes: 7,
    mode: 'transport',
  },
  {
    id: 'mall-2',
    category: 'malls',
    label: {
      ru: 'Второй торговый центр',
      kz: 'Екінші сауда орталығы',
      en: 'Second shopping centre',
    },
    minutes: 12,
    mode: 'transport',
  },
  {
    id: 'park-city',
    category: 'parks',
    label: { ru: 'Городской парк', kz: 'Қалалық саябақ', en: 'City park' },
    minutes: 12,
    mode: 'walk',
  },
  {
    id: 'square',
    category: 'parks',
    label: { ru: 'Сквер', kz: 'Сквер', en: 'Public square' },
    minutes: 6,
    mode: 'walk',
  },
  {
    id: 'embankment',
    category: 'parks',
    label: { ru: 'Набережная', kz: 'Жағалау', en: 'Embankment' },
    minutes: 9,
    mode: 'walk',
  },
  {
    id: 'fitness',
    category: 'sport',
    label: { ru: 'Фитнес-клуб', kz: 'Фитнес-клуб', en: 'Fitness club' },
    minutes: 7,
    mode: 'walk',
  },
  {
    id: 'pool',
    category: 'sport',
    label: { ru: 'Бассейн', kz: 'Бассейн', en: 'Swimming pool' },
    minutes: 11,
    mode: 'transport',
  },
  {
    id: 'stadium',
    category: 'sport',
    label: { ru: 'Стадион', kz: 'Стадион', en: 'Stadium' },
    minutes: 14,
    mode: 'transport',
  },
  {
    id: 'coffee',
    category: 'cafes',
    label: { ru: 'Кофейня', kz: 'Кофехана', en: 'Coffee shop' },
    minutes: 2,
    mode: 'walk',
  },
  {
    id: 'restaurant',
    category: 'cafes',
    label: { ru: 'Ресторан', kz: 'Мейрамхана', en: 'Restaurant' },
    minutes: 5,
    mode: 'walk',
  },
  {
    id: 'bakery',
    category: 'cafes',
    label: { ru: 'Пекарня', kz: 'Наубайхана', en: 'Bakery' },
    minutes: 3,
    mode: 'walk',
  },
  {
    id: 'bus-stop',
    category: 'transport',
    label: { ru: 'Остановка автобуса', kz: 'Автобус аялдамасы', en: 'Bus stop' },
    minutes: 4,
    mode: 'walk',
  },
  {
    id: 'brt-stop',
    category: 'transport',
    label: { ru: 'Остановка BRT', kz: 'BRT аялдамасы', en: 'BRT stop' },
    minutes: 9,
    mode: 'walk',
  },
  {
    id: 'railway',
    category: 'transport',
    label: { ru: 'Железнодорожный вокзал', kz: 'Теміржол вокзалы', en: 'Railway station' },
    minutes: 20,
    mode: 'transport',
  },
];

export const INFRA_BY_CATEGORY = INFRA_CATEGORIES.map((category) => ({
  category,
  objects: INFRASTRUCTURE.filter((o) => o.category === category).sort(
    (a, b) => a.minutes - b.minutes,
  ),
}));

/** Grouping buckets used by the schematic map and the list view. */
export const INFRA_TIME_BUCKETS = [5, 10, 15] as const;

export const infraInBucket = (max: number, min = 0) =>
  INFRASTRUCTURE.filter((o) => o.minutes > min && o.minutes <= max);

/**
 * Normalised positions for the schematic SVG map (0–1 within the map frame).
 * Hand-placed so the diagram reads clearly; PLACEHOLDER coordinates, not real
 * geography — the map makes no claim about actual bearings.
 */
export const INFRA_MAP_POSITIONS: Record<string, { x: number; y: number }> = {
  school: { x: 0.2, y: 0.26 },
  kindergarten: { x: 0.72, y: 0.2 },
  gymnasium: { x: 0.14, y: 0.55 },
  'art-school': { x: 0.09, y: 0.79 },
  polyclinic: { x: 0.36, y: 0.12 },
  hospital: { x: 0.5, y: 0.06 },
  pharmacy: { x: 0.83, y: 0.36 },
  dentist: { x: 0.9, y: 0.62 },
  supermarket: { x: 0.63, y: 0.44 },
  minimarket: { x: 0.47, y: 0.57 },
  market: { x: 0.28, y: 0.9 },
  'mall-1': { x: 0.86, y: 0.16 },
  'mall-2': { x: 0.94, y: 0.44 },
  'park-city': { x: 0.06, y: 0.36 },
  square: { x: 0.24, y: 0.68 },
  embankment: { x: 0.55, y: 0.86 },
  fitness: { x: 0.7, y: 0.7 },
  pool: { x: 0.34, y: 0.4 },
  stadium: { x: 0.2, y: 0.08 },
  coffee: { x: 0.52, y: 0.48 },
  restaurant: { x: 0.66, y: 0.28 },
  bakery: { x: 0.4, y: 0.66 },
  'bus-stop': { x: 0.58, y: 0.34 },
  'brt-stop': { x: 0.78, y: 0.52 },
  railway: { x: 0.12, y: 0.16 },
};
