/** Fictional, explicitly marked demo developer records. */

export const DEVELOPER_FOUNDED_YEAR = 2011;

export interface CompletedProject {
  id: string;
  name: { ru: string; kz: string; en: string };
  city: { ru: string; kz: string; en: string };
  year: number;
  units: number;
  area: number;
  /** 2GIS link. Placeholder in demo data — replace with the real object card. */
  mapUrl: string;
  photo: string;
  is_demo: true;
  published: boolean;
}

export const COMPLETED_PROJECTS: CompletedProject[] = [
  {
    id: 'samal-demo',
    name: { ru: 'ЖК «Самал» (демо)', kz: '«Самал» ТҮК (демо)', en: 'Samal Residence (demo)' },
    city: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
    year: 2019,
    units: 186,
    area: 21_400,
    mapUrl: 'https://2gis.kz/astana/search/ЖК%20Самал',
    photo: '/images/aerial.jpg',
    is_demo: true,
    published: true,
  },
  {
    id: 'arqa-demo',
    name: { ru: 'ЖК «Арқа» (демо)', kz: '«Арқа» ТҮК (демо)', en: 'Arqa Residence (demo)' },
    city: { ru: 'Караганда', kz: 'Қарағанды', en: 'Karaganda' },
    year: 2022,
    units: 240,
    area: 27_900,
    mapUrl: 'https://2gis.kz/karaganda/search/ЖК%20Арқа',
    photo: '/images/night-facade.jpg',
    is_demo: true,
    published: true,
  },
];

export const PUBLISHED_COMPLETED_PROJECTS = COMPLETED_PROJECTS.filter((project) => project.published);

export interface DeveloperFact {
  value: string;
  unit?: { ru: string; kz: string; en: string };
  label: { ru: string; kz: string; en: string };
}

export function getDeveloperFacts(currentYear = new Date().getFullYear()): DeveloperFact[] {
  const yearsOnMarket = Math.max(0, currentYear - DEVELOPER_FOUNDED_YEAR);
  const completedArea = PUBLISHED_COMPLETED_PROJECTS.reduce((sum, project) => sum + project.area, 0);
  const completedUnits = PUBLISHED_COMPLETED_PROJECTS.reduce((sum, project) => sum + project.units, 0);

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
      value: String(PUBLISHED_COMPLETED_PROJECTS.length),
      unit: { ru: 'ЖК', kz: 'ТҮК', en: 'complexes' },
      label: { ru: 'опубликовано сданных объектов', kz: 'жарияланған тапсырылған нысан', en: 'published completed projects' },
    },
    {
      value: completedArea.toLocaleString('ru-RU'),
      unit: { ru: 'м²', kz: 'м²', en: 'm²' },
      label: { ru: 'жилья в опубликованных проектах', kz: 'жарияланған жобалардағы тұрғын үй', en: 'in published projects' },
    },
    {
      value: completedUnits.toLocaleString('ru-RU'),
      unit: { ru: 'квартир', kz: 'пәтер', en: 'apartments' },
      label: { ru: 'в опубликованных проектах', kz: 'жарияланған жобаларда', en: 'in published projects' },
    },
  ];
}
