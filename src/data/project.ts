/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CENTRAL PROJECT DATA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Nothing else in the codebase hard-codes a name, a price, an address or a
 * phone number — every page and component reads from `src/data/*`.
 *
 * SOURCE OF TRUTH: `docs/real-data-dossier.md` (Asylym Park 1 / NAK).
 * Every fact below is confirmed by that dossier; anything it does not confirm
 * is either omitted or flagged `is_demo`. Prices and availability are those the
 * developer published as at 21 August 2026 (see `INVENTORY_UPDATED_AT`).
 *
 * NOTE FOR WHOEVER DEPLOYS THIS: this build demonstrates another developer's
 * real project (see the risks section of the dossier). Before publishing under
 * your own domain get NAK's consent, or restore a fictional identity and keep
 * only the market figures real.
 */

export const PROJECT = {
  name: 'Асылым Парк 1',
  shortName: 'Асылым Парк',
  /** The name as it is written in each locale: Cyrillic in ru/kk, Latin in en. */
  nameByLocale: { ru: 'Асылым Парк 1', kz: 'Асылым Парк 1', en: 'Asylym Park 1' },
  developerLegalName: 'ТОО «Nur Astana Kurylys»',
  developerBrand: 'NAK',
  /** Year the developer was founded — years on the market are computed from it. */
  developerFoundedYear: 2006,

  city: 'Astana',
  cityLocative: 'Astana',
  district: 'Esil district',
  streetAddress: 'ул. Алихан Бокейхан, 18/1',

  /** II class of housing — business class. */
  housingClass: 'business',
  storeys: { min: 9, max: 9 },

  /**
   * Total apartments in the COMPLEX (all ten blocks of Asylym Park 1). This is a
   * distinct figure from the sales inventory size: only blocks №10 and №11 are
   * currently on sale, and `INVENTORY_STATS.total` never exceeds this number.
   */
  complexTotalUnits: 346,

  /** The house is delivered — handover was in 2024. */
  delivery: {
    iso: '2024-12-31',
    ru: 'дом сдан в 2024 году',
    kz: 'үй 2024 жылы тапсырылды',
    en: 'delivered in 2024',
  },

  /** Date the developer's sales office opened (dossier §3). */
  salesOfficeOpened: '2024-01-01',

  /** Minimum published price per square metre, in KZT (August 2026). */
  basePricePerSqm: 498_000,

  /** Published price per m² by room type (August 2026, dossier §3 table). */
  pricePerSqmByRooms: { 1: 533_000, 2: 508_000, 3: 510_000, 4: 498_000 } as Record<
    1 | 2 | 3 | 4,
    number
  >,

  currency: 'KZT',

  /** Every project image is a 3D visualisation, not a photograph of a built house. */
  imagesAreVisualisations: true,
} as const;

/**
 * Sales contacts (dossier §3).
 *
 * Override without touching code by setting NEXT_PUBLIC_SALES_PHONE /
 * NEXT_PUBLIC_WHATSAPP / NEXT_PUBLIC_SALES_EMAIL in .env.local, or in the
 * environment settings of the hosting provider.
 */
const PHONE_DISPLAY = process.env.NEXT_PUBLIC_SALES_PHONE ?? '+7 706 699 95 00';
const PHONE_E164 = (process.env.NEXT_PUBLIC_WHATSAPP ?? '77066999500').replace(/\D/g, '');
const EMAIL = process.env.NEXT_PUBLIC_SALES_EMAIL ?? 'info@nak.kz';

export const CONTACTS = {
  phoneDisplay: PHONE_DISPLAY,
  phoneHref: `tel:+${PHONE_E164}`,
  whatsappNumber: PHONE_E164,
  email: EMAIL,
  /** Second published address for document requests. */
  requestEmail: 'request@nak.kz',
  requestEmailHref: 'mailto:request@nak.kz',
  emailHref: `mailto:${EMAIL}`,
  site: 'https://nak.kz',
  instagram: 'https://instagram.com/nak.holding',
  /** 2GIS company card. */
  mapUrl: 'https://2gis.kz/astana/firm/70000001077133651',
  /** Pre-filled WhatsApp message — the pattern that converts best in KZ. */
  whatsappMessage: {
    ru: `Здравствуйте! Интересует квартира в ЖК ${PROJECT.nameByLocale.ru}. Хотел(а) бы узнать стоимость и доступные планировки.`,
    kz: `Сәлеметсіз бе! ${PROJECT.nameByLocale.kz} ТҮК-дегі пәтер қызықтырады. Құны мен қолжетімді жоспарларды білгім келеді.`,
    en: `Hello! I am interested in an apartment at ${PROJECT.nameByLocale.en}. I would like to know the price and the available floor plans.`,
  },
  office: {
    /** Confirmed address of the sales office (dossier §3). */
    address: 'ул. Алихан Бокейхан, 16, Есиль район, Астана, Z05T0E6',
    hours: {
      ru: 'Ежедневно: 09:00–19:00',
      kz: 'Күн сайын: 09:00–19:00',
      en: 'Daily: 09:00–19:00',
    },
  },
} as const;

/** Blocks of the complex. Only blocks №10 and №11 are in sales. */
export interface Block {
  id: '10' | '11';
  /** Number used in unit ids and in the unit grid. */
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
    id: '10',
    letter: '10',
    floors: 9,
    unitsPerFloor: 6,
    names: { ru: 'Корпус №10', kz: '№10 корпус', en: 'Block 10' },
    delivery: { ru: 'сдан в 2024', kz: '2024 ж. тапсырылды', en: 'delivered 2024' },
    status: 'selling',
  },
  {
    id: '11',
    letter: '11',
    floors: 9,
    unitsPerFloor: 6,
    names: { ru: 'Корпус №11', kz: '№11 корпус', en: 'Block 11' },
    delivery: { ru: 'сдан в 2024', kz: '2024 ж. тапсырылды', en: 'delivered 2024' },
    status: 'selling',
  },
];

export const getBlock = (id: Block['id']): Block | undefined =>
  BLOCKS.find((block) => block.id === id);

export const getBlockByLetter = (letter: string): Block | undefined =>
  BLOCKS.find((block) => block.letter.toLowerCase() === letter.toLowerCase());

/**
 * Parking — the dossier confirms the parking is SURFACE. Specific counts and
 * prices for parking or storage are not published by the developer, so the
 * figures below are demo placeholders flagged `is_demo` and must not be
 * presented as fact.
 */
export const PARKING = {
  type: 'surface' as const,
  is_demo: true,
  /** Demo space count — not published by the developer. */
  spaces: 168,
  /** Demo storage count — not published by the developer. */
  storageRooms: 34,
  /** Demo price for one space, in KZT. */
  spacePriceFrom: 4_200_000,
  storagePriceFrom: 1_800_000,
  instalmentMonths: 18,
} as const;

/**
 * Commercial ground-floor units. The dossier confirms areas of 44,71–233,48 m²
 * and "price on request"; the unit count, ceiling height and feature list are
 * not published, so no price per m² is claimed.
 */
export const COMMERCIAL = {
  areaFrom: 44.71,
  areaTo: 233.48,
  /** No published price — shown as "on request". */
  pricePerSqmFrom: null,
  /** Not published by the developer. */
  is_demo: true,
  features: [
    { ru: 'Отдельный вход с улицы', kz: 'Көше жағынан бөлек кіреберіс', en: 'Separate entrance from the street' },
    { ru: 'Витрины на главный фасад', kz: 'Басты қасбетке витриналар', en: 'Shopfronts onto the main facade' },
    { ru: 'Помещения на первых этажах', kz: 'Бірінші қабаттағы үй-жайлар', en: 'Ground-floor units' },
    { ru: 'Свободная планировка под арендатора', kz: 'Жалға алушыға арналған еркін жоспар', en: 'Layout adaptable for an occupier' },
  ],
} as const;
