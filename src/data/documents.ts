/**
 * Public document pack.
 *
 * ⚠️  DEMONSTRATION BUILD
 * No document is fabricated here. Each entry describes what the document IS,
 * what it must contain, and what has to be verified. The preview modal renders
 * a clearly-marked demonstration sample — never a fake legal instrument.
 *
 * Legal context for Kazakhstan (verified during research): shared-construction
 * agreements may be signed only after a guarantee agreement with the Single
 * Operator is in place, or after the local executive body (akimat) grants
 * permission to attract buyers' funds. Sites that state this openly are the
 * ones buyers trust, and it is the single most common trust gap on the market.
 */

export type DocumentStatus = 'published' | 'on-request';

export interface ProjectDocument {
  id: string;
  /** Key into dictionary `documents.types`. */
  typeKey:
    | 'permit'
    | 'guarantee'
    | 'akimat'
    | 'contract'
    | 'conditions'
    | 'privacy'
    | 'developer';
  status: DocumentStatus;
  /** PLACEHOLDER date. */
  updatedAt: string;
  /** What the document is, in one sentence — no marketing language. */
  summary: { ru: string; kz: string; en: string };
  /** What the buyer must check inside this document. */
  verifiable: { ru: string; kz: string; en: string }[];
}

export const PROJECT_DOCUMENTS: ProjectDocument[] = [
  {
    id: 'construction-permit',
    typeKey: 'permit',
    status: 'published',
    updatedAt: '2026-02-10',
    summary: {
      ru: 'Документ, дающий право на строительство объекта. Проверяется по номеру и дате в реестре местного исполнительного органа.',
      kz: 'Нысанды салуға құқық беретін құжат. Жергілікті атқарушы органның тізілімінде нөмірі мен күні бойынша тексеріледі.',
      en: 'The document that authorises construction. Verified by its number and date in the local executive body’s register.',
    },
    verifiable: [
      {
        ru: 'Номер и дата выдачи документа',
        kz: 'Құжаттың нөмірі мен берілген күні',
        en: 'Document number and date of issue',
      },
      {
        ru: 'Наименование объекта должно совпадать с адресом продаж',
        kz: 'Нысан атауы сатылым мекенжайымен сәйкес болуы керек',
        en: 'The project name must match the address being sold',
      },
      {
        ru: 'Срок действия на дату сделки',
        kz: 'Мәміле күніндегі қолданылу мерзімі',
        en: 'Validity at the date of the deal',
      },
    ],
  },
  {
    id: 'operator-guarantee',
    typeKey: 'guarantee',
    status: 'published',
    updatedAt: '2026-02-18',
    summary: {
      ru: 'Гарантия Единого оператора — основание, по которому застройщик вправе привлекать деньги дольщиков.',
      kz: 'Бірыңғай оператор кепілдігі — құрылыс салушының үлескерлер ақшасын тартуға құқығының негізі.',
      en: 'The Single Operator guarantee — the basis on which the developer may attract buyers’ funds.',
    },
    verifiable: [
      {
        ru: 'Срок действия гарантии',
        kz: 'Кепілдіктің қолданылу мерзімі',
        en: 'Guarantee validity period',
      },
      {
        ru: 'Наименование застройщика и объекта',
        kz: 'Құрылыс салушы мен нысанның атауы',
        en: 'Developer and project name',
      },
      {
        ru: 'Перечень домов, на которые распространяется гарантия',
        kz: 'Кепілдік қамтитын үйлердің тізімі',
        en: 'The list of buildings covered by the guarantee',
      },
    ],
  },
  {
    id: 'akimat-permission',
    typeKey: 'akimat',
    status: 'published',
    updatedAt: '2026-02-18',
    summary: {
      ru: 'Разрешение местного исполнительного органа на привлечение денег дольщиков — альтернативное основание к гарантии Единого оператора.',
      kz: 'Үлескерлер ақшасын тартуға жергілікті атқарушы органның рұқсаты — Бірыңғай оператор кепілдігіне баламалы негіз.',
      en: 'Permission from the local executive body to attract buyers’ funds — an alternative basis to the Single Operator guarantee.',
    },
    verifiable: [
      {
        ru: 'Номер и дата решения',
        kz: 'Шешімнің нөмірі мен күні',
        en: 'Decision number and date',
      },
      {
        ru: 'Совпадение объекта и застройщика',
        kz: 'Нысан мен құрылыс салушының сәйкестігі',
        en: 'That the project and the developer match',
      },
      {
        ru: 'Отсутствие ограничений по конкретному корпусу',
        kz: 'Нақты корпус бойынша шектеулердің жоқтығы',
        en: 'That there are no restrictions on the specific block',
      },
    ],
  },
  {
    id: 'standard-contract',
    typeKey: 'contract',
    status: 'published',
    updatedAt: '2026-03-02',
    summary: {
      ru: 'Типовой договор долевого участия: предмет, срок передачи, гарантийные обязательства и порядок расчётов.',
      kz: 'Үлестік қатысудың үлгі шарты: нысана, тапсыру мерзімі, кепілдік міндеттемелер және есеп айырысу тәртібі.',
      en: 'The standard shared-construction agreement: subject, handover date, warranties and the settlement procedure.',
    },
    verifiable: [
      {
        ru: 'Срок передачи квартиры и порядок его изменения',
        kz: 'Пәтерді тапсыру мерзімі және оны өзгерту тәртібі',
        en: 'The handover date and how it can be changed',
      },
      {
        ru: 'Ответственность за нарушение срока',
        kz: 'Мерзімді бұзғаны үшін жауапкершілік',
        en: 'Liability for a missed deadline',
      },
      {
        ru: 'Порядок приёмки квартиры и устранения замечаний',
        kz: 'Пәтерді қабылдау және ескертулерді жою тәртібі',
        en: 'The inspection process and how snags are fixed',
      },
    ],
  },
  {
    id: 'purchase-conditions',
    typeKey: 'conditions',
    status: 'published',
    updatedAt: '2026-03-02',
    summary: {
      ru: 'Условия покупки: график платежей, порядок рассрочки, скидки при полной оплате и перечень банков-партнёров.',
      kz: 'Сатып алу шарттары: төлем кестесі, бөліп төлеу тәртібі, толық төлем кезіндегі жеңілдіктер және серіктес банктер тізімі.',
      en: 'Purchase terms: the payment schedule, payment-plan rules, discounts for full payment and the list of partner banks.',
    },
    verifiable: [
      {
        ru: 'Размер удорожания при рассрочке, если он есть',
        kz: 'Бөліп төлеу кезіндегі қымбаттау мөлшері, егер бар болса',
        en: 'Whether a payment plan adds a price premium, and how much',
      },
      {
        ru: 'Точный график платежей по вашей квартире',
        kz: 'Сіздің пәтеріңіз бойынша нақты төлем кестесі',
        en: 'The exact payment schedule for your apartment',
      },
      {
        ru: 'Что происходит при просрочке платежа',
        kz: 'Төлем кешіккен жағдайда не болады',
        en: 'What happens if a payment is late',
      },
    ],
  },
  {
    id: 'privacy-policy',
    typeKey: 'privacy',
    status: 'published',
    updatedAt: '2026-09-01',
    summary: {
      ru: 'Политика конфиденциальности: какие данные собираются через формы, зачем, сколько хранятся и как их удалить.',
      kz: 'Құпиялылық саясаты: формалар арқылы қандай деректер жиналады, не үшін, қанша сақталады және оларды қалай жоюға болады.',
      en: 'Privacy policy: which data the forms collect, why, how long it is stored and how to have it deleted.',
    },
    verifiable: [
      {
        ru: 'Перечень обрабатываемых персональных данных',
        kz: 'Өңделетін дербес деректердің тізімі',
        en: 'The list of personal data processed',
      },
      {
        ru: 'Срок хранения и способ отзыва согласия',
        kz: 'Сақтау мерзімі және келісімді қайтарып алу тәсілі',
        en: 'Retention period and how to withdraw consent',
      },
      {
        ru: 'Контакт для запросов по персональным данным',
        kz: 'Дербес деректер бойынша сұраныстарға арналған байланыс',
        en: 'The contact for personal-data requests',
      },
    ],
  },
  {
    id: 'developer-info',
    typeKey: 'developer',
    status: 'on-request',
    updatedAt: '2026-03-02',
    summary: {
      ru: 'Сведения о застройщике: учредительные данные, БИН, опыт, сданные объекты и финансовые показатели.',
      kz: 'Құрылыс салушы туралы мәліметтер: құрылтай деректері, БСН, тәжірибе, тапсырылған нысандар және қаржылық көрсеткіштер.',
      en: 'Developer information: incorporation details, BIN, track record, completed projects and financials.',
    },
    verifiable: [
      {
        ru: 'Полное юридическое наименование и БИН',
        kz: 'Толық заңды атауы мен БСН',
        en: 'Full legal name and BIN',
      },
      {
        ru: 'Список сданных объектов с адресами',
        kz: 'Мекенжайлары көрсетілген тапсырылған нысандар тізімі',
        en: 'Completed projects with addresses',
      },
      {
        ru: 'Год регистрации и участие в судебных спорах',
        kz: 'Тіркелген жылы және сот дауларына қатысуы',
        en: 'Year of registration and involvement in litigation',
      },
    ],
  },
];

export const DOCUMENTS_UPDATED_AT = '2026-09-01';
