/**
 * Developer profile.
 *
 * DATA SOURCE
 * Every figure and project below is a PLACEHOLDER for a fictional developer.
 * The section renders a visible notice saying so.
 *
 * Deliberate omission: NO AWARDS are listed. Award titles are checkable claims
 * about a real company, so inventing them would be exactly the kind of fake
 * trust signal the brief forbids. The awards slot renders an honest
 * "to be filled with the developer's documents" state instead — see
 * `AWARDS_PLACEHOLDER` below.
 */

export interface DeveloperFact {
  /** Numeric part, rendered large. */
  value: string;
  /** Unit shown next to the number. */
  unit?: { ru: string; kz: string; en: string };
  label: { ru: string; kz: string; en: string };
}

export const DEVELOPER_FACTS: DeveloperFact[] = [
  {
    value: '2011',
    label: { ru: 'год основания компании', kz: 'компания құрылған жыл', en: 'the year the company was founded' },
  },
  {
    value: '14',
    unit: { ru: 'лет', kz: 'жыл', en: 'years' },
    label: { ru: 'на строительном рынке', kz: 'құрылыс нарығында', en: 'on the construction market' },
  },
  {
    value: '9',
    unit: { ru: 'ЖК', kz: 'ТҮК', en: 'complexes' },
    label: { ru: 'сдано в эксплуатацию', kz: 'пайдалануға тапсырылды', en: 'completed and handed over' },
  },
  {
    value: '148 000',
    unit: { ru: 'м²', kz: 'м²', en: 'm²' },
    label: { ru: 'жилья построено', kz: 'тұрғын үй салынды', en: 'of housing built' },
  },
  {
    value: '1 940',
    unit: { ru: 'семей', kz: 'отбасы', en: 'families' },
    label: { ru: 'получили ключи', kz: 'кілт алды', en: 'received their keys' },
  },
  {
    value: '1',
    unit: { ru: 'объект', kz: 'нысан', en: 'project' },
    label: { ru: 'строится сейчас', kz: 'қазір салынып жатыр', en: 'under construction now' },
  },
];

export interface CompletedProject {
  id: string;
  /** Neutral placeholder label — no invented project names. */
  label: { ru: string; kz: string; en: string };
  city: { ru: string; kz: string; en: string };
  year: number;
  units: number;
  area: number;
}

export const COMPLETED_PROJECTS: CompletedProject[] = [
  {
    id: 'p-01',
    label: { ru: 'Объект 01', kz: '01 нысан', en: 'Project 01' },
    city: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
    year: 2015,
    units: 186,
    area: 21_400,
  },
  {
    id: 'p-02',
    label: { ru: 'Объект 02', kz: '02 нысан', en: 'Project 02' },
    city: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
    year: 2017,
    units: 240,
    area: 27_900,
  },
  {
    id: 'p-03',
    label: { ru: 'Объект 03', kz: '03 нысан', en: 'Project 03' },
    city: { ru: 'Караганда', kz: 'Қарағанды', en: 'Karaganda' },
    year: 2019,
    units: 132,
    area: 14_600,
  },
  {
    id: 'p-04',
    label: { ru: 'Объект 04', kz: '04 нысан', en: 'Project 04' },
    city: { ru: 'Астана', kz: 'Астана', en: 'Astana' },
    year: 2021,
    units: 268,
    area: 32_100,
  },
  {
    id: 'p-05',
    label: { ru: 'Объект 05', kz: '05 нысан', en: 'Project 05' },
    city: { ru: 'Шымкент', kz: 'Шымкент', en: 'Shymkent' },
    year: 2023,
    units: 204,
    area: 24_800,
  },
];

/**
 * Awards are intentionally not fabricated. This string drives the honest
 * empty state; it is replaced by a real list once the developer supplies
 * certificates and award documents.
 */
export const AWARDS_PLACEHOLDER = {
  title: {
    ru: 'Награды и сертификаты',
    kz: 'Марапаттар мен сертификаттар',
    en: 'Awards and certificates',
  },
  text: {
    ru: 'Здесь размещаются только подтверждённые документом награды и сертификаты застройщика: отраслевые премии, ISO, допуски и лицензии. Мы не публикуем награды, которые нельзя проверить.',
    kz: 'Мұнда тек құжатпен расталған марапаттар мен сертификаттар орналастырылады: салалық жүлделер, ISO, рұқсаттар мен лицензиялар. Тексеруге болмайтын марапаттарды жарияламаймыз.',
    en: 'Only awards and certificates backed by a document go here: industry prizes, ISO, permits and licences. We do not publish awards that cannot be verified.',
  },
  action: {
    ru: 'Сертификаты входят в пакет документов',
    kz: 'Сертификаттар құжаттар пакетіне кіреді',
    en: 'Certificates are part of the document pack',
  },
};
