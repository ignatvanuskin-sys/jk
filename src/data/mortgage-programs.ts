/**
 * Ways to buy, as published for Asylym Park 1 (developer NAK).
 *
 * ⚠️  READ THIS BEFORE PUBLISHING
 * The options below are exactly the ones the developer publishes (see
 * `docs/real-data-dossier.md`, §2 "Как купить", captured 06.10.2026, prices and
 * availability valid as at 21 August 2026). Programmes NOT used by this complex
 * — in particular the state subsidy programme — are deliberately absent, and no
 * programme name or rate is hard-coded anywhere outside this data file.
 *
 * Every programme carries the date its terms were verified (`verified_at`) and a
 * `published` flag. Only programmes whose full parameter set is confirmed are
 * marked `calculatorReady: true`.
 */

export interface MortgageSource {
  id: string;
  label: string;
  url: string;
  date: string;
}

/** Every URL below belongs to a page opened while collecting the dossier. */
export const MORTGAGE_SOURCES: MortgageSource[] = [
  {
    id: 'korter',
    label: 'Korter.kz — ЖК Asylym Park 1: планировки, цены и способы покупки',
    url: 'https://korter.kz/%D0%B6%D0%BA-asylym-park-1-%D0%BD%D1%83%D1%80-%D1%81%D1%83%D0%BB%D1%82%D0%B0%D0%BD-%D0%B0%D1%81%D1%82%D0%B0%D0%BD%D0%B0',
    date: '2026-08-21',
  },
  {
    id: 'nak',
    label: 'Nak.kz — официальный сайт застройщика NAK',
    url: 'https://nak.kz',
    date: '2026-10-06',
  },
  {
    id: 'nak-2gis',
    label: '2ГИС — карточка NAK / Asylym Prime',
    url: 'https://2gis.kz/astana/firm/70000001077133651',
    date: '2026-10-06',
  },
];

export interface MortgageProgram {
  id: string;
  provider: string;
  name: { ru: string; kz: string; en: string };
  /** Annual rate in percent — 0 for the interest-free developer plan. */
  rate: number;
  /** True when `rate` is a loyalty discount rather than a loan rate. */
  rateIsDiscount?: boolean;
  minDownPercent: number;
  /** A second published down-payment tier, where the developer sets one. */
  minDownPercentAlt?: number;
  maxTermYears?: number;
  maxLoan?: number;
  priceCap?: number;
  /** One-off booking fee, in KZT. */
  bookingFee?: number;
  /** Extra, buyer-relevant facts. */
  highlights: { ru: string; kz: string; en: string }[];
  /** Declared risk: what still has to be verified before publication. */
  caveat?: { ru: string; kz: string; en: string };
  /** True only when every figure used by the calculator is confirmed. */
  calculatorReady: boolean;
  sourceIds: string[];
  /** ISO date the programme's terms were last verified against the source. */
  verified_at: string;
  published: boolean;
}

export const MORTGAGE_PROGRAMS: MortgageProgram[] = [
  {
    id: 'instalment',
    provider: 'ТОО «Nur Astana Kurylys» (NAK)',
    name: {
      ru: 'Рассрочка от застройщика',
      kz: 'Құрылыс салушының бөліп төлеуі',
      en: 'Developer payment plan',
    },
    rate: 0,
    minDownPercent: 50,
    minDownPercentAlt: 70,
    bookingFee: 1_000_000,
    highlights: [
      { ru: 'Первоначальный взнос от 50% и 70%', kz: 'Бастапқы жарна 50% және 70%-дан', en: 'Down payment from 50% and 70%' },
      { ru: 'Бронь квартиры — 1 000 000 ₸', kz: 'Пәтерді брондау — 1 000 000 ₸', en: 'Unit reservation — ₸1,000,000' },
      { ru: 'Первый взнос, далее ипотека', kz: 'Алдымен бастапқы жарна, одан кейін ипотека', en: 'Down payment first, then a mortgage' },
    ],
    caveat: {
      ru: 'Срок рассрочки застройщиком не опубликован — уточняется в отделе продаж. Расчёт в калькуляторе для неё не выполняется.',
      kz: 'Бөліп төлеу мерзімі құрылыс салушы жарияламаған — сату бөлімінде нақтыланады. Калькуляторда есептеу жүргізілмейді.',
      en: 'The developer does not publish the payment-plan term — confirm it with the sales office. The calculator does not model it.',
    },
    calculatorReady: false,
    sourceIds: ['korter', 'nak'],
    verified_at: '2026-08-21',
    published: true,
  },
  {
    id: 'ckb-income',
    provider: 'Банк Центр Кредит',
    name: {
      ru: 'Ипотека Банк Центр Кредит (с подтверждением дохода)',
      kz: 'Банк Центр Кредит ипотекасы (табысты растаумен)',
      en: 'Bank CenterCredit mortgage (income confirmed)',
    },
    rate: 5,
    minDownPercent: 20,
    maxTermYears: 15,
    maxLoan: 80_000_000,
    highlights: [
      { ru: 'Ставка от 5% годовых', kz: 'Жылдық мөлшерлеме 5%-дан', en: 'Rate from 5% per year' },
      { ru: 'Первоначальный взнос 20%', kz: 'Бастапқы жарна 20%', en: 'Down payment 20%' },
      { ru: 'Срок до 15 лет', kz: 'Мерзімі 15 жылға дейін', en: 'Term up to 15 years' },
      { ru: 'Сумма займа до 80 000 000 ₸', kz: 'Несие сомасы 80 000 000 ₸-ға дейін', en: 'Loan up to ₸80,000,000' },
    ],
    caveat: {
      ru: 'Условия публикует застройщик для ЖК Asylym Park 1. Точную ставку банк указывает в решении по заявке.',
      kz: 'Шарттарды құрылыс салушы Asylym Park 1 ТҮК үшін жариялайды. Нақты мөлшерлемені банк өтінім шешімінде көрсетеді.',
      en: 'The developer publishes these terms for Asylym Park 1. The bank states the exact rate in its decision.',
    },
    calculatorReady: true,
    sourceIds: ['korter'],
    verified_at: '2026-08-21',
    published: true,
  },
  {
    id: 'ckb-no-income',
    provider: 'Банк Центр Кредит',
    name: {
      ru: 'Ипотека Банк Центр Кредит (без подтверждения дохода)',
      kz: 'Банк Центр Кредит ипотекасы (табысты растамай)',
      en: 'Bank CenterCredit mortgage (no income proof)',
    },
    rate: 6.5,
    minDownPercent: 30,
    maxTermYears: 15,
    maxLoan: 80_000_000,
    highlights: [
      { ru: 'Ставка от 6,5% годовых', kz: 'Жылдық мөлшерлеме 6,5%-дан', en: 'Rate from 6.5% per year' },
      { ru: 'Без подтверждения дохода', kz: 'Табысты растамай', en: 'Without proof of income' },
      { ru: 'Первоначальный взнос 30%', kz: 'Бастапқы жарна 30%', en: 'Down payment 30%' },
      { ru: 'Срок до 15 лет', kz: 'Мерзімі 15 жылға дейін', en: 'Term up to 15 years' },
      { ru: 'Сумма займа до 80 000 000 ₸', kz: 'Несие сомасы 80 000 000 ₸-ға дейін', en: 'Loan up to ₸80,000,000' },
    ],
    caveat: {
      ru: 'Условия публикует застройщик для ЖК Asylym Park 1. Точную ставку банк указывает в решении по заявке.',
      kz: 'Шарттарды құрылыс салушы Asylym Park 1 ТҮК үшін жариялайды. Нақты мөлшерлемені банк өтінім шешімінде көрсетеді.',
      en: 'The developer publishes these terms for Asylym Park 1. The bank states the exact rate in its decision.',
    },
    calculatorReady: true,
    sourceIds: ['korter'],
    verified_at: '2026-08-21',
    published: true,
  },
  {
    id: 'nak-club',
    provider: 'NAK',
    name: {
      ru: 'Программа лояльности NAK Club',
      kz: 'NAK Club адалдық бағдарламасы',
      en: 'NAK Club loyalty programme',
    },
    rate: 3,
    rateIsDiscount: true,
    minDownPercent: 0,
    highlights: [
      { ru: 'Скидка 3% на первую покупку', kz: 'Бірінші сатып алуға 3% жеңілдік', en: '3% off the first purchase' },
      { ru: 'Скидка 4% на 2–3-ю покупку', kz: '2–3-ші сатып алуға 4% жеңілдік', en: '4% off the 2nd–3rd purchase' },
      { ru: 'Скидка 5% на 4–5-ю покупку', kz: '4–5-ші сатып алуға 5% жеңілдік', en: '5% off the 4th–5th purchase' },
    ],
    caveat: {
      ru: 'Программа лояльности застройщика, а не ипотека — скидка к цене квартиры. Расчёт в калькуляторе не выполняется.',
      kz: 'Бұл — ипотека емес, құрылыс салушының адалдық бағдарламасы: пәтер бағасына жеңілдік. Калькуляторда есептелмейді.',
      en: 'A developer loyalty programme, not a mortgage — a discount off the unit price. The calculator does not model it.',
    },
    calculatorReady: false,
    sourceIds: ['korter', 'nak-2gis'],
    verified_at: '2026-08-21',
    published: true,
  },
];

export const PUBLISHED_MORTGAGE_PROGRAMS = MORTGAGE_PROGRAMS.filter((p) => p.published);

export const CALCULATOR_PROGRAMS = MORTGAGE_PROGRAMS.filter((p) => p.calculatorReady);

export const getProgram = (id: string): MortgageProgram | undefined =>
  MORTGAGE_PROGRAMS.find((p) => p.id === id);

export const getSources = (ids: string[]): MortgageSource[] =>
  MORTGAGE_SOURCES.filter((s) => ids.includes(s.id));

export const CITY_LIMIT_LABEL = {
  ru: 'Лимит стоимости жилья для Астаны',
  kz: 'Астана үшін тұрғын үй құнының шегі',
  en: 'Property price cap for Astana',
};
