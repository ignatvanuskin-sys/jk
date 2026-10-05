/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CENTRAL PROJECT DATA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️  DEMONSTRATION BUILD
 * Everything in this file that describes the development itself (name, prices,
 * areas, addresses, phone numbers, dates) is a PLACEHOLDER. It is internally
 * consistent and realistic, but it is not real data.
 *
 * To launch for a real project, replace the values below and keep the shape.
 * Nothing else in the codebase hard-codes project facts — every page and
 * component reads from `src/data/*`.
 *
 * Market grounding (verified, see research/kz-market.md):
 *   • Average new-build price in Kazakhstan, May 2025 — 521 596 ₸/m² (ERI)
 *   • Almaty new-build — 633 217 ₸/m²; Astana is comparably high (ERI)
 * The base price per m² used below sits inside that real range on purpose.
 */

export const DEMO = {
  /** Flipped to false (and the notices removed) when real data is loaded. */
  isDemo: true,
  /** Short, visible marker used next to the logo and in the footer. */
  label: 'DEMO',
} as const;

export const PROJECT = {
  /** PLACEHOLDER brand name. */
  name: 'QONYS RESIDENCE',
  shortName: 'QONYS',
  /** PLACEHOLDER legal entity of the developer. */
  developerLegalName: 'ТОО «QONYS Development»',
  developerBrand: 'QONYS Development',
  /** PLACEHOLDER BIN — replace with the real one before launch. */
  developerBin: '000000000000',

  city: 'Astana',
  cityLocative: 'Astana',
  district: 'Esil district',
  /** PLACEHOLDER street address — deliberately not published in structured data. */
  streetAddress: 'улица Примерная, 1',

  /** Class of housing — used in meta descriptions and structured data. */
  housingClass: 'comfort',
  storeys: { min: 9, max: 12 },
  totalUnits: 214,

  /** PLACEHOLDER handover date. */
  delivery: {
    iso: '2027-12-31',
    ru: 'IV квартал 2027 года',
    kz: '2027 жылдың IV тоқсаны',
    en: 'Q4 2027',
  },

  /** PLACEHOLDER deadline for the whole project (three phases). */
  salesOfficeOpened: '2026-02-01',

  /** Base price per square metre, in KZT. See the market note above. */
  basePricePerSqm: 520_000,

  /** Discount applied to the cheapest possible unit — shown as "от …" */
  minPriceFloorFactor: 0.97,

  /** Style-programme cap that a unit price must stay under (7-20-25, Astana). */
  stateProgramPriceCap: 25_000_000,

  /** Area used in the "от ₸ за м²" line: the base price. */
  currency: 'KZT',

  /** Every project image is a 3D visualisation, not a photograph of a built house. */
  imagesAreVisualisations: true,
} as const;

/**
 * Sales contacts. PLACEHOLDER values.
 * Override without touching code by setting NEXT_PUBLIC_SALES_PHONE /
 * NEXT_PUBLIC_WHATSAPP / NEXT_PUBLIC_SALES_EMAIL in .env.local.
 */
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_SALES_PHONE ?? '+7 (700) 000-00-00';
const PHONE_E164 = (process.env.NEXT_PUBLIC_WHATSAPP ?? '77000000000').replace(/\D/g, '');
const EMAIL = process.env.NEXT_PUBLIC_SALES_EMAIL ?? 'sales@example.kz';

export const CONTACTS = {
  phoneDisplay: PHONE_DISPLAY,
  phoneHref: `tel:+${PHONE_E164}`,
  whatsappNumber: PHONE_E164,
  email: EMAIL,
  emailHref: `mailto:${EMAIL}`,
  /** Pre-filled WhatsApp message — the pattern that converts best in KZ. */
  whatsappMessage: {
    ru: `Здравствуйте! Интересует квартира в ЖК ${PROJECT.name}. Хотел(а) бы узнать стоимость и доступные планировки.`,
    kz: `Сәлеметсіз бе! ${PROJECT.name} ТҮК-дегі пәтер қызықтырады. Құны мен қолжетімді жоспарларды білгім келеді.`,
    en: `Hello! I am interested in an apartment at ${PROJECT.name}. I would like to know the price and the available floor plans.`,
  },
  office: {
    /** PLACEHOLDER — see the on-page notice in the contacts section. */
    hours: {
      ru: 'Пн–Сб: 09:00–19:00, Вс: 10:00–17:00',
      kz: 'Дс–Сб: 09:00–19:00, Жс: 10:00–17:00',
      en: 'Mon–Sat: 09:00–19:00, Sun: 10:00–17:00',
    },
  },
} as const;

/** Blocks of the complex. Areas and floor counts are PLACEHOLDER values. */
export interface Block {
  id: 'a' | 'b' | 'c';
  /** Latin letter used in unit ids and in the unit grid. */
  letter: string;
  floors: number;
  unitsPerFloor: number;
  /** Localisation keys resolve in the component; these are the RU strings. */
  names: { ru: string; kz: string; en: string };
  delivery: { ru: string; kz: string; en: string };
  status: 'selling' | 'soon' | 'built';
}

export const BLOCKS: Block[] = [
  {
    id: 'a',
    letter: 'A',
    floors: 12,
    unitsPerFloor: 6,
    names: { ru: 'Корпус A', kz: 'A корпусы', en: 'Block A' },
    delivery: { ru: 'IV кв. 2027', kz: '2027 ж. IV тоқсан', en: 'Q4 2027' },
    status: 'selling',
  },
  {
    id: 'b',
    letter: 'B',
    floors: 12,
    unitsPerFloor: 6,
    names: { ru: 'Корпус B', kz: 'B корпусы', en: 'Block B' },
    delivery: { ru: 'IV кв. 2027', kz: '2027 ж. IV тоқсан', en: 'Q4 2027' },
    status: 'selling',
  },
  {
    id: 'c',
    letter: 'C',
    floors: 10,
    unitsPerFloor: 7,
    names: { ru: 'Корпус C', kz: 'C корпусы', en: 'Block C' },
    delivery: { ru: 'II кв. 2028', kz: '2028 ж. II тоқсан', en: 'Q2 2028' },
    status: 'soon',
  },
];

export const getBlock = (id: Block['id']): Block | undefined =>
  BLOCKS.find((block) => block.id === id);

export const getBlockByLetter = (letter: string): Block | undefined =>
  BLOCKS.find((block) => block.letter.toLowerCase() === letter.toLowerCase());

/** Parking and storage inventory — PLACEHOLDER figures. */
export const PARKING = {
  undergroundSpaces: 168,
  storageRooms: 34,
  /** PLACEHOLDER price for one space, in KZT. */
  spacePriceFrom: 4_200_000,
  storagePriceFrom: 1_800_000,
  instalmentMonths: 18,
} as const;

/** Commercial ground-floor units — PLACEHOLDER figures. */
export const COMMERCIAL = {
  units: 9,
  areaFrom: 42,
  areaTo: 138,
  pricePerSqmFrom: 780_000,
  ceiling: 3.9,
  features: [
    {
      ru: 'Отдельный вход с улицы',
      kz: 'Көше жағынан бөлек кіреберіс',
      en: 'Separate entrance from the street',
    },
    {
      ru: 'Витрины на главный фасад',
      kz: 'Басты қасбетке витриналар',
      en: 'Shopfronts onto the main facade',
    },
    {
      ru: 'Высота потолков 3,9 м',
      kz: 'Төбе биіктігі 3,9 м',
      en: '3.9 m ceiling height',
    },
    {
      ru: 'Электрическая мощность до 30 кВт',
      kz: 'Электр қуаты 30 кВт-қа дейін',
      en: 'Electrical capacity up to 30 kW',
    },
    {
      ru: 'Отдельная вентиляция под общепит',
      kz: 'Қоғамдық тамақтануға бөлек желдету',
      en: 'Dedicated ventilation for food service',
    },
    {
      ru: 'Парковка перед входом',
      kz: 'Кіреберіс алдында тұрақ',
      en: 'Parking in front of the entrance',
    },
  ],
} as const;
