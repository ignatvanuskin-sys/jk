/**
 * Developer record — the real NAK (ТОО «Nur Astana Kurylys»).
 *
 * SOURCE OF TRUTH: `docs/real-data-dossier.md`, §3 "Застройщик" (2GIS company
 * card and nak.kz, captured 06.10.2026).
 *
 * The dossier marks the developer's BIN, licence, awards and review counts as
 * UNCONFIRMED — they must not be published anywhere. Only the confirmed fields
 * below are exposed. Portfolio entries carry only the facts the dossier
 * confirms (houses, year, units, area range, price from) and link to a real
 * public page where one exists.
 */

export const DEVELOPER_FOUNDED_YEAR = 2006;

export const DEVELOPER = {
  legalName: 'ТОО «Nur Astana Kurylys»',
  brand: 'NAK',
  foundedYear: DEVELOPER_FOUNDED_YEAR,
  positioning: {
    ru: 'девелопмент культурных изменений',
    kz: 'мәдени өзгерістер девелопменті',
    en: 'development of cultural change',
  },
  site: 'https://nak.kz',
  instagram: 'https://instagram.com/nak.holding',
  /** 2GIS company card. */
  mapUrl: 'https://2gis.kz/astana/firm/70000001077133651',
  /** 2GIS rating, as published on the company card. */
  rating2gis: 4.7,
  /** 2GIS branch-network size. */
  branches: 12,
  office: {
    ru: 'ул. Алихан Бокейхан, 16, Есиль район, Астана, Z05T0E6',
    kz: 'Әлихан Бөкейхан к-сі, 16, Есіл ауданы, Астана, Z05T0E6',
    en: '16 Alikhan Bokeikhan St, Esil district, Astana, Z05T0E6',
  },
} as const;

export interface DeveloperProject {
  id: string;
  name: { ru: string; kz: string; en: string };
  /** District / address, where confirmed. */
  location: { ru: string; kz: string; en: string };
  /** Number of houses/blocks in the development, where confirmed. */
  houses?: number;
  /** Year the confirmed blocks were completed, where confirmed. */
  year?: number;
  /** Apartments in the development, where confirmed. */
  units?: number;
  /** Apartment area range, m², where confirmed. */
  areaFrom?: number;
  areaTo?: number;
  /** Published minimum price per m², where confirmed. */
  pricePerSqmFrom?: number;
  /** Public page (korter.kz / 2gis.kz / nak.kz), where one exists. */
  url?: string;
  /** These are the developer's real projects — never demo records. */
  is_demo: false;
  published: boolean;
}

export const DEVELOPER_PROJECTS: DeveloperProject[] = [
  {
    id: 'asylym-park-1',
    name: { ru: 'Asylym Park 1', kz: 'Asylym Park 1', en: 'Asylym Park 1' },
    location: { ru: 'ул. Алихан Бокейхан, 18/1, Есильский район', kz: 'Әлихан Бөкейхан к-сі, 18/1, Есіл ауданы', en: '18/1 Alikhan Bokeikhan St, Esil district' },
    houses: 10,
    year: 2024,
    units: 346,
    areaFrom: 37.17,
    areaTo: 184.64,
    pricePerSqmFrom: 498_000,
    url: 'https://korter.kz/%D0%B6%D0%BA-asylym-park-1-%D0%BD%D1%83%D1%80-%D1%81%D1%83%D0%BB%D1%82%D0%B0%D0%BD-%D0%B0%D1%81%D1%82%D0%B0%D0%BD%D0%B0',
    is_demo: false,
    published: true,
  },
  {
    id: 'asylym',
    name: { ru: 'Asylym', kz: 'Asylym', en: 'Asylym' },
    location: { ru: 'просп. Мангилик Ел, 30, Есильский район', kz: 'Мәңгілік Ел д-лы, 30, Есіл ауданы', en: '30 Mangilik El Ave, Esil district' },
    houses: 14,
    year: 2023,
    units: 207,
    areaFrom: 73,
    areaTo: 158,
    pricePerSqmFrom: 515_000,
    url: 'https://2gis.kz/astana/firm/70000001077133651',
    is_demo: false,
    published: true,
  },
  {
    id: 'asylym-prime',
    name: { ru: 'Asylym Prime', kz: 'Asylym Prime', en: 'Asylym Prime' },
    location: { ru: 'ул. Алихан Бокейхан, 16, Есиль район', kz: 'Әлихан Бөкейхан к-сі, 16, Есіл ауданы', en: '16 Alikhan Bokeikhan St, Esil district' },
    url: 'https://2gis.kz/astana/firm/70000001077133651',
    is_demo: false,
    published: true,
  },
  {
    id: 'hazar',
    name: { ru: 'Hazar', kz: 'Hazar', en: 'Hazar' },
    location: { ru: 'просп. Мангилик Ел, 62, Есильский район', kz: 'Мәңгілік Ел д-лы, 62, Есіл ауданы', en: '62 Mangilik El Ave, Esil district' },
    url: 'https://nak.kz',
    is_demo: false,
    published: true,
  },
  {
    id: 'asylym-park-2',
    name: { ru: 'Asylym Park 2', kz: 'Asylym Park 2', en: 'Asylym Park 2' },
    location: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
    url: 'https://nak.kz',
    is_demo: false,
    published: true,
  },
  {
    id: 'bayaan',
    name: { ru: 'Bayaan', kz: 'Bayaan', en: 'Bayaan' },
    location: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
    pricePerSqmFrom: 770_000,
    url: 'https://nak.kz',
    is_demo: false,
    published: true,
  },
  {
    id: 'arai-towers',
    name: { ru: 'Arai Towers', kz: 'Arai Towers', en: 'Arai Towers' },
    location: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
    pricePerSqmFrom: 720_000,
    url: 'https://nak.kz',
    is_demo: false,
    published: true,
  },
  {
    id: 'triumph-exclusive',
    name: { ru: 'Клубный дом Triumph Exclusive', kz: 'Triumph Exclusive клуб үйі', en: 'Triumph Exclusive club house' },
    location: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
    pricePerSqmFrom: 772_000,
    url: 'https://nak.kz',
    is_demo: false,
    published: true,
  },
  {
    id: 'syganak',
    name: { ru: 'Syganak', kz: 'Syganak', en: 'Syganak' },
    location: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
    url: 'https://nak.kz',
    is_demo: false,
    published: true,
  },
  {
    id: 'aulet',
    name: { ru: 'Әулет', kz: 'Әулет', en: 'Aulet' },
    location: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
    url: 'https://nak.kz',
    is_demo: false,
    published: true,
  },
  {
    id: 'shyraq',
    name: { ru: 'Shyraq', kz: 'Shyraq', en: 'Shyraq' },
    location: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
    url: 'https://nak.kz',
    is_demo: false,
    published: true,
  },
  {
    id: 'ansau',
    name: { ru: 'Ansau', kz: 'Ansau', en: 'Ansau' },
    location: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
    url: 'https://nak.kz',
    is_demo: false,
    published: true,
  },
  {
    id: 'dala-jusan',
    name: { ru: 'Dala Jusan', kz: 'Dala Jusan', en: 'Dala Jusan' },
    location: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
    url: 'https://nak.kz',
    is_demo: false,
    published: true,
  },
];

export const PUBLISHED_DEVELOPER_PROJECTS: DeveloperProject[] = DEVELOPER_PROJECTS.filter(
  (project) => project.published,
);

export interface DeveloperFact {
  value: string;
  unit?: { ru: string; kz: string; en: string };
  label: { ru: string; kz: string; en: string };
}

export function getDeveloperFacts(currentYear = new Date().getFullYear()): DeveloperFact[] {
  const yearsOnMarket = Math.max(0, currentYear - DEVELOPER_FOUNDED_YEAR);

  return [
    {
      value: String(DEVELOPER_FOUNDED_YEAR),
      label: { ru: 'год основания компании', kz: 'компания құрылған жыл', en: 'the year the company was founded' },
    },
    {
      value: String(yearsOnMarket),
      unit: { ru: 'лет', kz: 'жыл', en: 'years' },
      label: { ru: 'на строительном рынке', kz: 'құрылыс нарығында', en: 'on the construction market' },
    },
    {
      value: String(PUBLISHED_DEVELOPER_PROJECTS.length),
      unit: { ru: 'проектов', kz: 'жоба', en: 'projects' },
      label: { ru: 'в портфеле застройщика', kz: 'құрылыс салушы портфелінде', en: 'in the developer portfolio' },
    },
    {
      value: DEVELOPER.rating2gis.toLocaleString('ru-RU'),
      unit: { ru: 'из 5', kz: '5-тен', en: 'of 5' },
      label: { ru: 'рейтинг в 2ГИС', kz: '2ГИС рейтингі', en: '2GIS rating' },
    },
    {
      value: String(DEVELOPER.branches),
      unit: { ru: 'филиалов', kz: 'филиал', en: 'branches' },
      label: { ru: 'сеть 2ГИС по Казахстану', kz: 'Қазақстан бойынша 2ГИС желісі', en: '2GIS network across Kazakhstan' },
    },
  ];
}
