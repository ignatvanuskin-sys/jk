/**
 * Financing programmes available to buyers in Kazakhstan.
 *
 * ⚠️  READ THIS BEFORE PUBLISHING
 * Rates and caps below were taken from the sources listed in `MORTGAGE_SOURCES`
 * during desk research and are shown with the date of the source. Programme
 * terms change often — they MUST be re-checked against the official rules
 * (otbasybank.kz, gov.kz, bank websites) before the site goes live.
 *
 * Programmes whose parameters could not be confirmed in full are marked
 * `calculatorReady: false`: they are still listed for the buyer, but the
 * calculator will not use them to produce a payment figure.
 */

export interface MortgageSource {
  id: string;
  label: string;
  url: string;
  date: string;
}

/** Every URL below was returned by web_search/web_fetch during research. */
export const MORTGAGE_SOURCES: MortgageSource[] = [
  {
    id: 'finratings',
    label: 'Finratings.kz — обзор ипотечных программ Казахстана',
    url: 'https://finratings.kz/news/2589-ipoteka-v-kazakhstane-2025-obzor-samykh-populiarnykh-programm/',
    date: '2025-04-25',
  },
  {
    id: 'zakon',
    label: 'Zakon.kz — государственные жилищные программы',
    url: 'https://special.zakon.kz/halyk_mortgage_programs',
    date: '2025',
  },
  {
    id: 'krisha-nauryz',
    label: 'Krisha.kz — ипотеки «Наурыз» и «Наурыз жұмыскер»: ответы на главные вопросы',
    url: 'https://krisha.kz/kz/content/articles/2025/2025-ipoteki-nauryz-i-nauryz-zhumysker-otvety-na-glavnye-voprosy',
    date: '2025-11',
  },
  {
    id: 'krisha-instalment',
    label: 'Krisha.kz — рассрочка вместо ипотеки: как купить квартиру без переплаты',
    url: 'https://krisha.kz/content/articles/2025/2025-rassrochka-vmesto-ipoteki-kak-kupit-kvartiru-bez-pereplaty',
    date: '2025-06-04',
  },
  {
    id: 'digitalbusiness',
    label: 'Digitalbusiness.kz — жильё в рассрочку: что предлагают застройщики в Казахстане',
    url: 'https://digitalbusiness.kz/2025-03-08/zhile-v-rassrochku-chto-seychas-predlagayut-zastroyshchiki-v-kazahstane/',
    date: '2025-03-08',
  },
  {
    id: 'inbusiness',
    label: 'Inbusiness.kz — в РК утвердили новые правила господдержки на жильё',
    url: 'https://inbusiness.kz/ru/last/v-rk-utverdili-novye-pravila-gospodderzhki-na-zhile',
    date: '2025-06-05',
  },
];

export interface MortgageProgram {
  id: string;
  provider: string;
  name: { ru: string; kz: string; en: string };
  /** Annual rate in percent — the programme's headline figure. */
  rate: number;
  /** Rate floor and ceiling where the programme is graded by category. */
  rateRange?: { min: number; max: number; note: { ru: string; kz: string; en: string } };
  minDownPercent: number;
  /** Higher down payment where a programme distinguishes finishing types. */
  minDownPercentFinished?: number;
  maxTermYears: number;
  /** Cap on the price of the property, where the programme sets one. */
  priceCap?: number;
  maxLoan?: number;
  /** Extra, buyer-relevant facts. */
  highlights: { ru: string; kz: string; en: string }[];
  /** Declared risk: what still has to be verified before publication. */
  caveat?: { ru: string; kz: string; en: string };
  /** True only when every figure used by the calculator is sourced. */
  calculatorReady: boolean;
  sourceIds: string[];
}

const CITY_LIMIT_NOTE = {
  ru: 'Лимит стоимости жилья для Астаны',
  kz: 'Астана үшін тұрғын үй құнының шегі',
  en: 'Property price cap for Astana',
};

export const MORTGAGE_PROGRAMS: MortgageProgram[] = [
  {
    id: '7-20-25',
    provider: 'Отбасы банк / банки-партнёры',
    name: {
      ru: 'Государственная программа «7-20-25»',
      kz: '«7-20-25» мемлекеттік бағдарламасы',
      en: 'State programme "7-20-25"',
    },
    rate: 7,
    minDownPercent: 20,
    maxTermYears: 25,
    priceCap: 25_000_000,
    highlights: [
      { ru: 'Ставка 7% годовых', kz: 'Жылдық 7% мөлшерлеме', en: '7% annual rate' },
      {
        ru: 'Первоначальный взнос от 20%',
        kz: 'Бастапқы жарна 20%-дан',
        en: 'Down payment from 20%',
      },
      { ru: 'Срок до 25 лет', kz: 'Мерзімі 25 жылға дейін', en: 'Term up to 25 years' },
      {
        ru: 'Лимит стоимости жилья для Астаны — 25 млн ₸',
        kz: 'Астана үшін тұрғын үй құнының шегі — 25 млн ₸',
        en: 'Property price cap in Astana — ₸25 million',
      },
    ],
    caveat: {
      ru: 'Лимиты и условия программы периодически пересматриваются. Перед публикацией сверьте с правилами на официальном ресурсе оператора программы.',
      kz: 'Бағдарламаның шектеулері мен шарттары мезгіл-мезгіл қайта қаралады. Жариялау алдында бағдарлама операторының ресми ресурсындағы ережелермен салыстырыңыз.',
      en: 'Programme limits and terms are revised periodically. Before publication, verify against the official rules of the programme operator.',
    },
    calculatorReady: true,
    sourceIds: ['finratings', 'zakon'],
  },
  {
    id: 'nauryz',
    provider: 'Отбасы банк',
    name: {
      ru: 'Программа «Наурыз»',
      kz: '«Наурыз» бағдарламасы',
      en: 'Programme "Nauryz"',
    },
    rate: 9,
    rateRange: {
      min: 7,
      max: 9,
      note: {
        ru: '7% — для социально уязвимых категорий, 9% — для остальных',
        kz: '7% — әлеуметтік осал санаттар үшін, 9% — қалғандары үшін',
        en: '7% for vulnerable groups, 9% for everyone else',
      },
    },
    minDownPercent: 20,
    minDownPercentFinished: 10,
    maxTermYears: 19,
    highlights: [
      {
        ru: 'Первоначальный взнос 10% при чистовой отделке, 20% при черновой',
        kz: 'Таза әрлеуде бастапқы жарна 10%, шикі әрлеуде 20%',
        en: 'Down payment 10% with finished interiors, 20% with shell',
      },
      {
        ru: 'Срок до 19 лет',
        kz: 'Мерзімі 19 жылға дейін',
        en: 'Term up to 19 years',
      },
      {
        ru: 'Только через Отбасы банк и только для тех, кто не владел жильём последние 5 лет',
        kz: 'Тек Отбасы банк арқылы және соңғы 5 жылда тұрғын үйі болмағандарға',
        en: 'Available only via Otbasy Bank, and only if you have owned no housing in the last 5 years',
      },
    ],
    caveat: {
      ru: 'Программа работает по конкурсному отбору (баллы) либо по отдельным условиям для работников. Максимальная сумма займа в источниках указана по-разному (30 или 36 млн ₸) — требует сверки.',
      kz: 'Бағдарлама конкурстық іріктеу (балл) бойынша немесе жұмысшыларға арналған жекелеген шарттар бойынша жүреді. Ең жоғары несие сомасы дереккөздерде әртүрлі (30 немесе 36 млн ₸) — салыстыру қажет.',
      en: 'The programme runs on a points-based selection, or on separate terms for employees. The maximum loan amount differs between sources (₸30m or ₸36m) and needs verification.',
    },
    calculatorReady: true,
    sourceIds: ['krisha-nauryz', 'inbusiness'],
  },
  {
    id: 'orda-aimak',
    provider: 'Казахстанская Жилищная Компания (КЖК)',
    name: {
      ru: 'Программа «Орда Аймақ»',
      kz: '«Орда Аймақ» бағдарламасы',
      en: 'Programme "Orda Aimak"',
    },
    rate: 15.9,
    minDownPercent: 20,
    maxTermYears: 20,
    maxLoan: 75_000_000,
    highlights: [
      {
        ru: 'Для строящихся аккредитованных ЖК в регионах',
        kz: 'Аймақтардағы салынып жатқан аккредиттелген ТҮК үшін',
        en: 'For accredited developments under construction in the regions',
      },
      {
        ru: 'Сумма займа от 1 до 75 млн ₸',
        kz: 'Несие сомасы 1-ден 75 млн ₸-ға дейін',
        en: 'Loan from ₸1m to ₸75m',
      },
      {
        ru: 'КЖК берёт на себя обязательства по завершению строительства',
        kz: 'КЖК құрылысты аяқтау бойынша міндеттемелер алады',
        en: 'KHC assumes the obligation to complete construction',
      },
    ],
    caveat: {
      ru: 'Ставка 15,9% указана в обзоре; эффективная ставка (ГЭСВ) по источнику выше — от 17,26%. Уточняйте перед публикацией.',
      kz: '15,9% мөлшерлемесі шолуда көрсетілген; дереккөз бойынша тиімді мөлшерлеме (ЖТМС) жоғары — 17,26%-дан. Жариялау алдында нақтылаңыз.',
      en: 'The 15.9% rate comes from the review; the effective rate per the source is higher — from 17.26%. Verify before publication.',
    },
    calculatorReady: true,
    sourceIds: ['finratings'],
  },
  {
    id: 'zelenaya',
    provider: 'Отбасы банк / банки-партнёры',
    name: {
      ru: '«Зелёная ипотека»',
      kz: '«Жасыл ипотека»',
      en: '"Green mortgage"',
    },
    rate: 7,
    rateRange: {
      min: 7,
      max: 12.5,
      note: {
        ru: 'Ставка зависит от класса энергоэффективности дома',
        kz: 'Мөлшерлеме үйдің энергия тиімділігі сыныбына байланысты',
        en: 'The rate depends on the building’s energy-efficiency rating',
      },
    },
    minDownPercent: 20,
    maxTermYears: 20,
    maxLoan: 50_000_000,
    highlights: [
      {
        ru: 'Только для ЖК с сертификатом энергоэффективности',
        kz: 'Тек энергия тиімділігі сертификаты бар ТҮК үшін',
        en: 'Only for buildings with an energy-efficiency certificate',
      },
      { ru: 'Сумма до 50 млн ₸', kz: 'Сомасы 50 млн ₸-ға дейін', en: 'Loan up to ₸50m' },
      {
        ru: 'Первоначальный взнос от 20%',
        kz: 'Бастапқы жарна 20%-дан',
        en: 'Down payment from 20%',
      },
    ],
    caveat: {
      ru: 'Срок займа и максимальная сумма подтверждены не полностью — программа вынесена из расчёта и приведена для справки.',
      kz: 'Несие мерзімі мен ең жоғары сома толық расталмаған — бағдарлама есептеуден шығарылды және анықтама ретінде берілген.',
      en: 'The term and the maximum amount are not fully confirmed — the programme is excluded from the calculator and listed for reference only.',
    },
    calculatorReady: false,
    sourceIds: ['finratings'],
  },
  {
    id: 'bank',
    provider: 'Банки-партнёры',
    name: {
      ru: 'Банковская ипотека (ставку задаёт банк)',
      kz: 'Банк ипотекасы (мөлшерлемені банк белгілейді)',
      en: 'Bank mortgage (rate set by the bank)',
    },
    rate: 18,
    minDownPercent: 20,
    maxTermYears: 20,
    highlights: [
      {
        ru: 'Отбасы банк, Halyk Bank, Freedom Bank, Банк ЦентрКредит, ForteBank, Altyn Bank',
        kz: 'Отбасы банк, Halyk Bank, Freedom Bank, Банк ЦентрКредит, ForteBank, Altyn Bank',
        en: 'Otbasy Bank, Halyk Bank, Freedom Bank, Bank CenterCredit, ForteBank, Altyn Bank',
      },
      {
        ru: 'Одну заявку можно подать в несколько банков через менеджера',
        kz: 'Бір өтінімді менеджер арқылы бірнеше банкке беруге болады',
        en: 'One manager can submit a single application to several banks',
      },
      {
        ru: 'Ставка в расчёте — пример. Фактическую ставку банк указывает в решении по заявке',
        kz: 'Есептеудегі мөлшерлеме — мысал. Нақты мөлшерлемені банк өтінім шешімінде көрсетеді',
        en: 'The rate in the calculation is an example. The bank states the actual rate in its decision',
      },
    ],
    caveat: {
      ru: 'Ставка 18% — ориентир для расчёта, не предложение банка. Замените на актуальную партнёрскую ставку или на диапазон банков-партнёров.',
      kz: '18% мөлшерлемесі — есептеуге арналған бағдар, банктің ұсынысы емес. Оны өзекті серіктестік мөлшерлемемен немесе серіктес банктер ауқымымен ауыстырыңыз.',
      en: 'The 18% rate is a calculation placeholder, not a bank offer. Replace it with the current partner rate or a range across partner banks.',
    },
    calculatorReady: true,
    sourceIds: [],
  },
  {
    id: 'instalment',
    provider: 'QONYS Development',
    name: {
      ru: 'Рассрочка от застройщика',
      kz: 'Құрылыс салушының бөліп төлеуі',
      en: 'Developer payment plan',
    },
    rate: 0,
    minDownPercent: 20,
    maxTermYears: 2,
    highlights: [
      {
        ru: 'Первоначальный взнос от 20%',
        kz: 'Бастапқы жарна 20%-дан',
        en: 'Down payment from 20%',
      },
      {
        ru: 'Без процентов; срок — до окончания строительства',
        kz: 'Пайызсыз; мерзімі құрылыс аяқталғанға дейін',
        en: 'Interest-free; runs until construction completes',
      },
      {
        ru: 'Право собственности переходит после 100% оплаты',
        kz: 'Меншік құқығы 100% төлемнен кейін ауысады',
        en: 'Ownership transfers after 100% payment',
      },
    ],
    caveat: {
      ru: 'На рынке часть застройщиков добавляет к цене 3–5% при рассрочке. Условия по конкретному лоту подтверждает менеджер.',
      kz: 'Нарықта кейбір құрылыс салушылар бөліп төлеу кезінде бағаға 3–5% қосады. Нақты лот бойынша шарттарды менеджер растайды.',
      en: 'On the market, some developers add 3–5% to the price for a payment plan. A manager confirms the terms for a specific unit.',
    },
    calculatorReady: true,
    sourceIds: ['krisha-instalment', 'digitalbusiness'],
  },
];

export const CALCULATOR_PROGRAMS = MORTGAGE_PROGRAMS.filter((p) => p.calculatorReady);

export const getProgram = (id: string): MortgageProgram | undefined =>
  MORTGAGE_PROGRAMS.find((p) => p.id === id);

export const getSources = (ids: string[]): MortgageSource[] =>
  MORTGAGE_SOURCES.filter((s) => ids.includes(s.id));

export const CITY_LIMIT_LABEL = CITY_LIMIT_NOTE;
