/**
 * Neighbourhood infrastructure.
 *
 * SOURCE OF TRUTH: `docs/real-data-dossier.md`, §4 "Локация и инфраструктура"
 * (the developer's own description on korter.kz, captured 06.10.2026).
 *
 * Distances and travel times are the figures the developer publishes, shown with
 * the caption "по данным застройщика" (`INFRA_CAPTION`). Where the source gives a
 * distance it is stored as a distance; where it gives a time it is stored as a
 * time — nothing is converted or invented. The schematic map places each object
 * by an approximate walking-time proxy that is used for the drawing only.
 */

import type { Locale } from '@/i18n/config';

export type InfraCategory =
  | 'education'
  | 'medicine'
  | 'shops'
  | 'malls'
  | 'parks'
  | 'sport'
  | 'cafes'
  | 'transport';

export interface InfraMetric {
  /** `m` / `km` — a distance; `min` — a travel time. */
  kind: 'm' | 'km' | 'min';
  value: number;
}

export interface InfraObject {
  id: string;
  category: InfraCategory;
  label: { ru: string; kz: string; en: string };
  /** The figure exactly as the developer publishes it. */
  distance: InfraMetric;
  /** How the figure was measured, so the number is never ambiguous. */
  mode: 'walk' | 'transport';
  /** Extra published detail (bus routes, a time range), where present. */
  note?: { ru: string; kz: string; en: string };
  /** Approximate walking minutes — used only to place the object on the map. */
  minutes: number;
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

/** The on-page notice that the location figures come from the developer. */
export const INFRA_CAPTION = {
  ru: 'Расстояния и время в пути — по данным застройщика.',
  kz: 'Қашықтық пен жол уақыты — құрылыс салушының деректері бойынша.',
  en: 'Distances and travel times are per the developer’s data.',
};

export const INFRASTRUCTURE: InfraObject[] = [
  // ── Education ────────────────────────────────────────────────────────────
  {
    id: 'school-45',
    category: 'education',
    label: { ru: 'Школа №45', kz: '№45 мектеп', en: 'School No. 45' },
    distance: { kind: 'km', value: 1 },
    mode: 'walk',
    minutes: 12,
  },
  {
    id: 'school-75',
    category: 'education',
    label: { ru: 'Школа №75', kz: '№75 мектеп', en: 'School No. 75' },
    distance: { kind: 'km', value: 1 },
    mode: 'walk',
    minutes: 12,
  },
  {
    id: 'lyceum-76',
    category: 'education',
    label: { ru: 'Школа-лицей №76', kz: '№76 мектеп-лицей', en: 'School-lyceum No. 76' },
    distance: { kind: 'km', value: 1 },
    mode: 'walk',
    minutes: 12,
  },
  {
    id: 'nurseries',
    category: 'education',
    label: {
      ru: 'Детсады №78 «Асыл», «Данышпан», «Карлыгаш»',
      kz: '№78 «Асыл», «Данышпан», «Қарлығаш» балабақшалары',
      en: 'Kindergartens No. 78 Asyl, Danyshpan, Karlygash',
    },
    distance: { kind: 'km', value: 1 },
    mode: 'walk',
    minutes: 12,
  },
  {
    id: 'rfm-school',
    category: 'education',
    label: {
      ru: 'Республиканская физико-математическая школа',
      kz: 'Республикалық физика-математика мектебі',
      en: 'Republican Physics and Mathematics School',
    },
    distance: { kind: 'km', value: 1.5 },
    mode: 'walk',
    minutes: 18,
  },
  {
    id: 'nurseries-15',
    category: 'education',
    label: {
      ru: 'Детсады №15 «Дарын», №87, «Олимпикус»',
      kz: '№15 «Дарын», №87, «Олимпикус» балабақшалары',
      en: 'Kindergartens No. 15 Daryn, No. 87, Olympicus',
    },
    distance: { kind: 'km', value: 1.5 },
    mode: 'walk',
    minutes: 18,
  },

  // ── Medicine ─────────────────────────────────────────────────────────────
  {
    id: 'polyclinic-9',
    category: 'medicine',
    label: { ru: 'Поликлиника №9', kz: '№9 емхана', en: 'Polyclinic No. 9' },
    distance: { kind: 'km', value: 1.5 },
    mode: 'walk',
    minutes: 18,
  },
  {
    id: 'iclinic',
    category: 'medicine',
    label: { ru: 'Медицинский центр IClinic', kz: 'IClinic медициналық орталығы', en: 'IClinic medical centre' },
    distance: { kind: 'km', value: 2 },
    mode: 'transport',
    minutes: 5,
  },

  // ── Shops ────────────────────────────────────────────────────────────────
  {
    id: 'shops-1km',
    category: 'shops',
    label: {
      ru: 'Магазины, аптеки и банкоматы',
      kz: 'Дүкендер, дәріханалар және банкоматтар',
      en: 'Shops, pharmacies and ATMs',
    },
    distance: { kind: 'km', value: 1 },
    mode: 'walk',
    minutes: 12,
  },
  {
    id: 'supermarkets',
    category: 'shops',
    label: { ru: 'Супермаркеты', kz: 'Супермаркеттер', en: 'Supermarkets' },
    distance: { kind: 'km', value: 2 },
    mode: 'walk',
    minutes: 24,
  },

  // ── Malls ────────────────────────────────────────────────────────────────
  {
    id: 'abu-dhabi-plaza',
    category: 'malls',
    label: { ru: 'ТРЦ «Абу Даби Плаза»', kz: '«Абу Даби Плаза» СОО', en: 'Abu Dhabi Plaza mall' },
    distance: { kind: 'min', value: 8 },
    mode: 'transport',
    note: { ru: '5–10 минут езды', kz: '5–10 минут көлікпен', en: '5–10 minutes by car' },
    minutes: 8,
  },
  {
    id: 'expo-2017',
    category: 'malls',
    label: { ru: '«Экспо-2017»', kz: '«Экспо-2017»', en: 'Expo 2017' },
    distance: { kind: 'min', value: 8 },
    mode: 'transport',
    note: { ru: '5–10 минут езды', kz: '5–10 минут көлікпен', en: '5–10 minutes by car' },
    minutes: 8,
  },
  {
    id: 'mega-silk-way',
    category: 'malls',
    label: { ru: 'ТРЦ Mega Silk Way', kz: 'Mega Silk Way СОО', en: 'Mega Silk Way mall' },
    distance: { kind: 'min', value: 8 },
    mode: 'transport',
    note: { ru: '5–10 минут езды', kz: '5–10 минут көлікпен', en: '5–10 minutes by car' },
    minutes: 8,
  },

  // ── Parks & landmarks ────────────────────────────────────────────────────
  {
    id: 'botanical',
    category: 'parks',
    label: {
      ru: 'Ботанический сад и Триумфальная арка',
      kz: 'Ботаникалық бақ және Триумф аркасы',
      en: 'Botanical garden and Triumphal Arch',
    },
    distance: { kind: 'km', value: 1 },
    mode: 'walk',
    minutes: 12,
  },
  {
    id: 'ishim-river',
    category: 'parks',
    label: {
      ru: 'Река Ишим и Центральный бульвар',
      kz: 'Есіл өзені және Орталық бульвар',
      en: 'Ishim river and Central boulevard',
    },
    distance: { kind: 'min', value: 20 },
    mode: 'walk',
    note: { ru: '20 минут пешком', kz: '20 минут жаяу', en: '20 minutes on foot' },
    minutes: 20,
  },
  {
    id: 'nazarbayev-centre',
    category: 'parks',
    label: { ru: 'Назарбаев центр', kz: 'Назарбаев орталығы', en: 'Nazarbayev Centre' },
    distance: { kind: 'km', value: 1.5 },
    mode: 'walk',
    minutes: 18,
  },

  // ── Sport ────────────────────────────────────────────────────────────────
  {
    id: 'stadium',
    category: 'sport',
    label: { ru: 'Стадион', kz: 'Стадион', en: 'Stadium' },
    distance: { kind: 'km', value: 1 },
    mode: 'walk',
    minutes: 12,
  },

  // ── Cafés ────────────────────────────────────────────────────────────────
  {
    id: 'restaurants',
    category: 'cafes',
    label: { ru: 'Кафе и рестораны', kz: 'Кафелер мен мейрамханалар', en: 'Cafés and restaurants' },
    distance: { kind: 'km', value: 1 },
    mode: 'walk',
    minutes: 12,
  },
  {
    id: 'coffee-bar',
    category: 'cafes',
    label: { ru: 'Кофейни и бары', kz: 'Кофеханалар мен барлар', en: 'Coffee shops and bars' },
    distance: { kind: 'km', value: 2 },
    mode: 'walk',
    minutes: 24,
  },

  // ── Transport ────────────────────────────────────────────────────────────
  {
    id: 'bus-stop',
    category: 'transport',
    label: {
      ru: 'Автобусная остановка',
      kz: 'Автобус аялдамасы',
      en: 'Bus stop',
    },
    distance: { kind: 'm', value: 195 },
    mode: 'walk',
    note: {
      ru: 'Маршруты 15, 15А, 28, 35, 46, 52, 54, 70; интервал 8–10 минут',
      kz: '15, 15А, 28, 35, 46, 52, 54, 70 бағыттары; аралығы 8–10 минут',
      en: 'Routes 15, 15A, 28, 35, 46, 52, 54, 70; every 8–10 minutes',
    },
    minutes: 3,
  },
  {
    id: 'rail-nursultan-1',
    category: 'transport',
    label: {
      ru: 'Автовокзал и ж/д «Нур-Султан-1»',
      kz: 'Автовокзал және «Нұр-Сұлтан-1» т/ж',
      en: 'Bus station and Nur-Sultan-1 rail terminal',
    },
    distance: { kind: 'km', value: 11.5 },
    mode: 'transport',
    minutes: 20,
  },
  {
    id: 'rail-nurly-zhol',
    category: 'transport',
    label: { ru: 'Ж/д «Нурлы Жол»', kz: '«Нұрлы Жол» т/ж', en: 'Nurly Zhol rail station' },
    distance: { kind: 'km', value: 9 },
    mode: 'transport',
    minutes: 16,
  },
  {
    id: 'airport',
    category: 'transport',
    label: {
      ru: 'Аэропорт «Нурсултан Назарбаев»',
      kz: '«Нұрсұлтан Назарбаев» әуежайы',
      en: 'Nursultan Nazarbayev airport',
    },
    distance: { kind: 'min', value: 16 },
    mode: 'transport',
    minutes: 16,
  },
];

/** Human-readable distance/time for an object, in the visitor's locale. */
export function formatInfraDistance(object: InfraObject, locale: Locale): string {
  const { kind, value } = object.distance;
  const formatted = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'ru-RU', {
    maximumFractionDigits: 2,
  }).format(value);

  if (kind === 'min') return `${formatted} ${locale === 'en' ? 'min' : 'мин'}`;
  if (kind === 'km') return `${formatted} ${locale === 'en' ? 'km' : 'км'}`;
  return `${formatted} ${locale === 'en' ? 'm' : 'м'}`;
}

export const INFRA_BY_CATEGORY = INFRA_CATEGORIES.map((category) => ({
  category,
  objects: INFRASTRUCTURE.filter((o) => o.category === category).sort(
    (a, b) => a.minutes - b.minutes,
  ),
}));
