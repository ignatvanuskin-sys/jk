import type { Locale } from '@/i18n/config';

/**
 * Per-route SEO copy in all three languages.
 *
 * Kept out of the UI dictionary on purpose: this is content, not interface, and
 * it is only ever read on the server. Titles are authored to fit ~60 characters
 * so they are not truncated in a Kazakhstani SERP, descriptions to ~150–160.
 *
 * `{price}` and `{available}` are replaced at render time from live inventory
 * data, so the copy can never drift away from the numbers on the page.
 */
export interface SeoCopy {
  title: string;
  description: string;
}

type RouteKey =
  | 'home'
  | 'complex'
  | 'apartments'
  | 'floorplans'
  | 'infrastructure'
  | 'location'
  | 'construction'
  | 'developer'
  | 'mortgage'
  | 'commercial'
  | 'parking'
  | 'documents'
  | 'faq'
  | 'contacts'
  | 'privacy';

export const ROUTE_SEO: Record<RouteKey, Record<Locale, SeoCopy>> = {
  home: {
    ru: {
      title: 'ЖК QONYS RESIDENCE — квартиры в Астане от {price}',
      description:
        'Комфорт-класс на левом берегу Есиля: 3 корпуса, 214 квартир, закрытый двор без машин, подземный паркинг, потолки 3 метра. Свободно {available} квартир. Сдача — IV кв. 2027.',
    },
    kz: {
      title: 'QONYS RESIDENCE ТҮК — Астанадағы пәтерлер {price} бастап',
      description:
        'Есілдің сол жағалауындағы комфорт-класс: 3 корпус, 214 пәтер, көліксіз жабық аула, жерасты паркингі, 3 метрлік төбелер. {available} пәтер бос. Тапсыру — 2027 ж. IV тоқсан.',
    },
    en: {
      title: 'QONYS RESIDENCE — apartments in Astana from {price}',
      description:
        'Comfort-class on the left bank of the Esil: 3 blocks, 214 apartments, a car-free courtyard, heated underground parking. {available} available. Handover Q4 2027.',
    },
  },
  complex: {
    ru: {
      title: 'О комплексе — QONYS RESIDENCE, Астана',
      description:
        'Три корпуса от 9 до 12 этажей вокруг закрытого двора: монолитный каркас, вентилируемый фасад, панорамное остекление, безбарьерная среда, лобби 3,6 м.',
    },
    kz: {
      title: 'Кешен туралы — QONYS RESIDENCE, Астана',
      description:
        'Жабық ауланы қоршаған қабаттылығы 9–12 болатын үш корпус: монолитті каркас, желдетілетін қасбет, панорамалық әйнектеу, кедергісіз орта, 3,6 м лобби.',
    },
    en: {
      title: 'The complex — QONYS RESIDENCE, Astana',
      description:
        'Three blocks of 9 to 12 storeys around a car-free courtyard: monolithic frame, ventilated facade, full-height glazing, step-free access, a 3.6 m lobby.',
    },
  },
  apartments: {
    ru: {
      title: 'Квартиры в ЖК QONYS RESIDENCE — цены и наличие',
      description:
        'Фильтры по комнатности, площади, этажу и цене, выбор квартиры на шахматке и честные статусы: доступна, забронирована, продана. Свободно {available} квартир от {price}.',
    },
    kz: {
      title: 'QONYS RESIDENCE ТҮК пәтерлері — бағалары мен болуы',
      description:
        'Пәтерлер каталогы: бөлме саны, ауданы, қабаты және бағасы бойынша сүзгілер, пәтер таңдау шахматкасы, нақты мәртебелер. {available} пәтер бос, {price} бастап.',
    },
    en: {
      title: 'Apartments at QONYS RESIDENCE — prices and availability',
      description:
        'Apartment catalogue: filter by rooms, area, floor and price, pick a unit on the building grid, with honest available / reserved / sold statuses. {available} available from {price}.',
    },
  },
  floorplans: {
    ru: {
      title: 'Планировки квартир — QONYS RESIDENCE',
      description:
        'Планировки 1-, 2-, 3- и 4-комнатных квартир с площадями от 38 до 108 м², размерами каждого помещения и ценами. Полноэкранный просмотр с увеличением.',
    },
    kz: {
      title: 'Пәтер жоспарлары — QONYS RESIDENCE',
      description:
        '1, 2, 3 және 4 бөлмелі пәтерлердің жоспарлары: аудандары 38-ден 108 м²-ге дейін, әр бөлменің өлшемдері мен бағалары. Толық экранды қарау.',
    },
    en: {
      title: 'Floor plans — QONYS RESIDENCE',
      description:
        'Layouts for 1, 2, 3 and 4-room apartments from 38 to 108 m², with room-by-room dimensions and prices. Full-screen plan viewer with zoom.',
    },
  },
  infrastructure: {
    ru: {
      title: 'Инфраструктура рядом — QONYS RESIDENCE',
      description:
        'Школа — 5 минут пешком, детский сад — 4, поликлиника — 8 минут на транспорте. Интерактивная схема с фильтром по категориям: образование, медицина, магазины, парки, спорт.',
    },
    kz: {
      title: 'Жақын инфрақұрылым — QONYS RESIDENCE',
      description:
        'Мектеп — 5 минут жаяу, балабақша — 4, емхана — 8 минут көлікпен. Санаттар бойынша сүзгісі бар интерактивті схема: білім, медицина, дүкендер, саябақтар, спорт.',
    },
    en: {
      title: 'Neighbourhood — QONYS RESIDENCE',
      description:
        'School a 5-minute walk, kindergarten 4, clinic 8 minutes by car. Interactive diagram with a category filter: education, healthcare, groceries, parks, sport.',
    },
  },
  location: {
    ru: {
      title: 'Расположение — QONYS RESIDENCE, левый берег Есиля',
      description:
        'До центра города — 15 минут, до набережной — 9, до школы — 5 минут пешком, до аэропорта — 40 минут. Время в пути до основных точек района.',
    },
    kz: {
      title: 'Орналасуы — QONYS RESIDENCE, Есілдің сол жағалауы',
      description:
        'Қала орталығына — 15 минут, жағалауға — 9, мектепке — 5 минут жаяу, әуежайға — 40 минут. Ауданның негізгі нүктелеріне дейінгі жол уақыты.',
    },
    en: {
      title: 'Location — QONYS RESIDENCE, left bank of the Esil',
      description:
        '15 minutes to the city centre, 9 to the embankment, a 5-minute walk to school, 40 minutes to the airport. Travel times to the key points in the district.',
    },
  },
  construction: {
    ru: {
      title: 'Ход строительства — QONYS RESIDENCE по месяцам',
      description:
        'Ежемесячные отчёты по каждому корпусу: процент готовности, фотографии и перечень выполненных работ. Текущая готовность объекта — по корпусам A, B и C.',
    },
    kz: {
      title: 'Құрылыс барысы — QONYS RESIDENCE айлар бойынша',
      description:
        'Әр корпус бойынша ай сайынғы есептер: дайындық пайызы, фотосуреттер және орындалған жұмыстар тізімі. A, B және C корпустарының ағымдағы дайындығы.',
    },
    en: {
      title: 'Construction progress — QONYS RESIDENCE by month',
      description:
        'Monthly reports per block: completion percentage, photographs and the list of completed works. Current completion for blocks A, B and C.',
    },
  },
  developer: {
    ru: {
      title: 'Застройщик — QONYS Development',
      description:
        'Профиль застройщика: опыт, сданные объекты, гарантии дольщику и порядок раскрытия документов. Только проверяемые данные — без неподтверждённых наград.',
    },
    kz: {
      title: 'Құрылыс салушы — QONYS Development',
      description:
        'Құрылыс салушының профилі: тәжірибе, тапсырылған нысандар, үлескерге кепілдіктер және құжаттарды ашу тәртібі. Тек тексерілетін деректер.',
    },
    en: {
      title: 'Developer — QONYS Development',
      description:
        'Developer profile: track record, completed projects, buyer safeguards and how documents are disclosed. Verifiable information only — no unsubstantiated awards.',
    },
  },
  mortgage: {
    ru: {
      title: 'Ипотека и рассрочка — калькулятор платежа',
      description:
        'Расчёт ежемесячного платежа по программам «7-20-25», «Наурыз», «Орда Аймақ», «Зелёная ипотека», банковской ипотеке и рассрочке застройщика. Со ссылками на источники условий.',
    },
    kz: {
      title: 'Ипотека және бөліп төлеу — төлем калькуляторы',
      description:
        '«7-20-25», «Наурыз», «Орда Аймақ» және банк ипотекасы бойынша ай сайынғы төлемді есептеу. Шарттар дереккөздеріне сілтемелермен.',
    },
    en: {
      title: 'Mortgage and payment plans — calculator',
      description:
        'Monthly payment estimates for the 7-20-25, Nauryz, Orda Aimak and Green Mortgage programmes, bank mortgages and the developer payment plan, with cited sources.',
    },
  },
  commercial: {
    ru: {
      title: 'Коммерческие помещения на первых этажах — QONYS',
      description:
        'Помещения с отдельным входом и витринами на главный фасад: площади от 42 до 138 м², потолки 3,9 м, мощность до 30 кВт, вентиляция под общепит.',
    },
    kz: {
      title: 'Бірінші қабаттағы коммерциялық үй-жайлар — QONYS',
      description:
        'Бөлек кіреберісі және басты қасбетке витриналары бар үй-жайлар: аудандары 42-ден 138 м²-ге дейін, төбелері 3,9 м, қуаты 30 кВт-қа дейін.',
    },
    en: {
      title: 'Ground-floor commercial units — QONYS',
      description:
        'Units with a separate entrance and shopfronts onto the main facade: 42 to 138 m², 3.9 m ceilings, up to 30 kW of power, ventilation for food service.',
    },
  },
  parking: {
    ru: {
      title: 'Паркинг и кладовые — QONYS RESIDENCE',
      description:
        'Отапливаемый подземный паркинг на 168 мест и 34 кладовые. Заезд по двум пандусам, лифт к вашей квартире, рассрочка до 18 месяцев.',
    },
    kz: {
      title: 'Паркинг және қоймалар — QONYS RESIDENCE',
      description:
        '168 орынға арналған жылытылатын жерасты паркингі және 34 қойма. Екі пандуспен кіру, пәтеріңізге лифт, 18 айға дейін бөліп төлеу.',
    },
    en: {
      title: 'Parking and storage — QONYS RESIDENCE',
      description:
        'Heated underground parking with 168 spaces and 34 storage rooms. Two ramps, a lift to your floor, and a payment plan of up to 18 months.',
    },
  },
  documents: {
    ru: {
      title: 'Документы и прозрачность — QONYS RESIDENCE',
      description:
        'Разрешение на строительство, гарантия Единого оператора, разрешение акимата, типовой договор долевого участия и условия покупки. С пометками о статусе раскрытия.',
    },
    kz: {
      title: 'Құжаттар және ашықтық — QONYS RESIDENCE',
      description:
        'Құрылыс салуға рұқсат, Бірыңғай оператор кепілдігі, әкімдік рұқсаты, үлестік қатысудың үлгі шарты және сатып алу шарттары.',
    },
    en: {
      title: 'Documents and transparency — QONYS RESIDENCE',
      description:
        'Construction permit, Single Operator guarantee, akimat permission, the standard shared-construction agreement and purchase terms, each with its disclosure status.',
    },
  },
  faq: {
    ru: {
      title: 'Частые вопросы о покупке квартиры — QONYS RESIDENCE',
      description:
        'Отделка при передаче квартиры, перепланировка, стоимость паркинга, документы для ипотеки, сроки выдачи ключей, благоустройство двора и коммерция — с конкретными ответами.',
    },
    kz: {
      title: 'Пәтер сатып алу туралы жиі қойылатын сұрақтар — QONYS',
      description:
        'Пәтерді тапсыру кезіндегі әрлеу, қайта жоспарлау, паркинг құны, ипотека құжаттары, кілттерді беру мерзімі, ауланы абаттандыру — нақты жауаптармен.',
    },
    en: {
      title: 'Frequently asked questions — QONYS RESIDENCE',
      description:
        'Handover finishing, changing the layout, parking prices, mortgage paperwork, key handover dates, courtyard landscaping and commercial units — answered concretely.',
    },
  },
  contacts: {
    ru: {
      title: 'Контакты и офис продаж — QONYS RESIDENCE',
      description:
        'Офис продаж на объекте, телефон, WhatsApp и e-mail. Запись на просмотр квартиры и на встречу с менеджером, часы работы и как добраться.',
    },
    kz: {
      title: 'Байланыс және сату кеңсесі — QONYS RESIDENCE',
      description:
        'Нысандағы сату кеңсесі, телефон, WhatsApp және e-mail. Пәтерді қарауға және менеджермен кездесуге жазылу, жұмыс уақыты және қалай жетуге болады.',
    },
    en: {
      title: 'Contacts and sales office — QONYS RESIDENCE',
      description:
        'Sales office on site, phone, WhatsApp and e-mail. Book a viewing or a meeting with a manager, with opening hours and directions.',
    },
  },
  privacy: {
    ru: {
      title: 'Политика конфиденциальности — QONYS RESIDENCE',
      description:
        'Какие персональные данные собираются через формы сайта, с какой целью, сколько хранятся, кому передаются и как отозвать согласие на обработку.',
    },
    kz: {
      title: 'Құпиялылық саясаты — QONYS RESIDENCE',
      description:
        'Сайт формалары арқылы қандай дербес деректер жиналады, қандай мақсатта, қанша сақталады және келісімді қалай қайтарып алуға болады.',
    },
    en: {
      title: 'Privacy policy — QONYS RESIDENCE',
      description:
        'What personal data the site forms collect, why, how long it is stored, who it is shared with, and how to withdraw your consent.',
    },
  },
};

export function getSeoCopy(route: RouteKey, locale: Locale): SeoCopy {
  return ROUTE_SEO[route][locale];
}
