import type { Locale } from '@/i18n/config';

/**
 * Per-route SEO copy in all three languages.
 *
 * Kept out of the UI dictionary on purpose: this is content, not interface, and
 * it is only ever read on the server. Titles are authored to fit ~60 characters
 * so they are not truncated in a Kazakhstani SERP, descriptions to ~150–160.
 *
 * `{price}` and `{available}` are replaced at render time from live inventory
 * data, so the copy can never drift away from the numbers on the page. Every
 * fact matches `docs/real-data-dossier.md` (Asylym Park 1 / NAK).
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
      title: 'ЖК Асылым Парк 1 — квартиры в Астане от {price}',
      description:
        'Бизнес-класс в Есильском районе Астаны: 10 домов, 346 квартир, дом сдан в 2024 году. Продажи в корпусах №10 и №11. Свободно {available} квартир. Цены — на 21 августа 2026.',
    },
    kz: {
      title: 'Асылым Парк 1 ТҮК — Астанадағы пәтерлер {price} бастап',
      description:
        'Астананың Есіл ауданындағы бизнес-класс: 10 үй, 346 пәтер, үй 2024 жылы тапсырылды. Сатылым №10 және №11 корпустарда. {available} пәтер бос. Бағалар — 2026 жылғы 21 тамыздағы.',
    },
    en: {
      title: 'Asylym Park 1 — apartments in Astana from {price}',
      description:
        'Business class in Astana’s Esil district: 10 houses, 346 apartments, delivered in 2024. Sales in blocks 10 and 11. {available} available. Prices as at 21 August 2026.',
    },
  },
  complex: {
    ru: {
      title: 'О комплексе — Асылым Парк 1, Астана',
      description:
        'Комплекс из 10 домов в Есильском районе: монолитно-каркасная технология, фиброцементный фасад, потолки 3,0 м, предчистовая отделка, наземный паркинг и закрытый двор.',
    },
    kz: {
      title: 'Кешен туралы — Асылым Парк 1, Астана',
      description:
        'Есіл ауданындағы 10 үйден тұратын кешен: монолитті-қаңқалы технология, фиброцемент қасбет, 3,0 м төбе, алдын ала таза әрлеу, жерүсті паркингі және жабық аула.',
    },
    en: {
      title: 'The complex — Asylym Park 1, Astana',
      description:
        'A complex of 10 houses in the Esil district: cast-in-place frame, fibre-cement facade, 3.0 m ceilings, pre-finishing, surface parking and a secured courtyard.',
    },
  },
  apartments: {
    ru: {
      title: 'Квартиры в ЖК Асылым Парк 1 — цены и наличие',
      description:
        'Фильтры по комнатности, площади, этажу и цене, выбор квартиры на шахматке и статусы. Свободно {available} квартир от {price}. Цены и наличие — на 21 августа 2026.',
    },
    kz: {
      title: 'Асылым Парк 1 ТҮК пәтерлері — бағалары мен болуы',
      description:
        'Бөлме саны, ауданы, қабаты және бағасы бойынша сүзгілер, пәтер таңдау шахматкасы, мәртебелер. {available} пәтер бос, {price} бастап. — 2026 жылғы 21 тамыз.',
    },
    en: {
      title: 'Apartments at Asylym Park 1 — prices and availability',
      description:
        'Filter by rooms, area, floor and price, pick a unit on the building grid, with available / reserved / sold statuses. {available} available from {price}. As at 21 August 2026.',
    },
  },
  floorplans: {
    ru: {
      title: 'Планировки квартир — Асылым Парк 1',
      description:
        'Планировки 1-, 2-, 3- и 4-комнатных квартир с площадями от 37,17 до 184,64 м², размерами каждого помещения и ценами. Полноэкранный просмотр с увеличением.',
    },
    kz: {
      title: 'Пәтер жоспарлары — Асылым Парк 1',
      description:
        '1, 2, 3 және 4 бөлмелі пәтерлердің жоспарлары: аудандары 37,17-ден 184,64 м²-ге дейін, әр бөлменің өлшемдері мен бағалары. Толық экранды қарау.',
    },
    en: {
      title: 'Floor plans — Asylym Park 1',
      description:
        'Layouts for 1, 2, 3 and 4-room apartments from 37.17 to 184.64 m², with room-by-room dimensions and prices. Full-screen plan viewer with zoom.',
    },
  },
  infrastructure: {
    ru: {
      title: 'Инфраструктура рядом — Асылым Парк 1',
      description:
        'Ботанический сад и Триумфальная арка — 1 км, река Ишим — 20 минут пешком, остановка — 195 м. Схема с фильтром по категориям. Расстояния — по данным застройщика.',
    },
    kz: {
      title: 'Жақын инфрақұрылым — Асылым Парк 1',
      description:
        'Ботаникалық бақ пен Триумф аркасы — 1 км, Есіл өзені — 20 минут жаяу, аялдама — 195 м. Санаттар бойынша сүзгісі бар схема. Қашықтықтар — құрылыс салушының деректері бойынша.',
    },
    en: {
      title: 'Neighbourhood — Asylym Park 1',
      description:
        'Botanical garden and Triumphal Arch 1 km, the Ishim river 20 minutes on foot, a bus stop 195 m. A diagram with a category filter. Distances per the developer’s data.',
    },
  },
  location: {
    ru: {
      title: 'Расположение — Асылым Парк 1, левый берег',
      description:
        'ул. Алихан Бокейхан, 18/1, Есильский район. До школ №45, №75 и лицея №76 — 1 км, до ТРЦ «Абу Даби Плаза» и «Экспо-2017» — 5–10 минут. Данные застройщика.',
    },
    kz: {
      title: 'Орналасуы — Асылым Парк 1, сол жағалау',
      description:
        'Әлихан Бөкейхан к-сі, 18/1, Есіл ауданы. №45, №75 мектептер мен №76 лицейге — 1 км, «Абу Даби Плаза» және «Экспо-2017» СОО-ға — 5–10 минут. Құрылыс салушы деректері.',
    },
    en: {
      title: 'Location — Asylym Park 1, left bank',
      description:
        '18/1 Alikhan Bokeikhan St, Esil district. 1 km to schools No. 45 and No. 75 and lyceum No. 76, 5–10 minutes to Abu Dhabi Plaza and Expo 2017 malls. Developer data.',
    },
  },
  construction: {
    ru: {
      title: 'Ход строительства — Асылым Парк 1',
      description:
        'Asylym Park 1 сдан в эксплуатацию в 2024 году. Проценты готовности и фотолетопись не публикуются: дом уже построен. Продажи — в корпусах №10 и №11.',
    },
    kz: {
      title: 'Құрылыс барысы — Асылым Парк 1',
      description:
        'Asylym Park 1 2024 жылы пайдалануға берілді. Дайындық пайызы мен фотошежіре жарияланбайды: үй салынып біткен. Сатылым — №10 және №11 корпустарда.',
    },
    en: {
      title: 'Construction — Asylym Park 1',
      description:
        'Asylym Park 1 was put into operation in 2024. Completion percentages and a photo log are not published: the house is already built. Sales in blocks 10 and 11.',
    },
  },
  developer: {
    ru: {
      title: 'Застройщик — NAK (Nur Astana Kurylys)',
      description:
        'NAK работает на рынке с 2006 года. Портфель проектов в Астане, рейтинг 2ГИС 4.7. Только подтверждённые данные — без неподтверждённых БИН, лицензий и наград.',
    },
    kz: {
      title: 'Құрылыс салушы — NAK (Nur Astana Kurylys)',
      description:
        'NAK нарықта 2006 жылдан бері жұмыс істейді. Астанадағы жобалар портфелі, 2ГИС рейтингі 4.7. Тек расталған деректер — расталмаған БСН, лицензия және марапаттарсыз.',
    },
    en: {
      title: 'Developer — NAK (Nur Astana Kurylys)',
      description:
        'NAK has operated since 2006, with a portfolio of projects in Astana and a 2GIS rating of 4.7. Confirmed information only — no unconfirmed BIN, licences or awards.',
    },
  },
  mortgage: {
    ru: {
      title: 'Ипотека и рассрочка — калькулятор платежа',
      description:
        'Рассрочка от застройщика и ипотека Банк Центр Кредит: от 5% и от 6,5%. Калькулятор ежемесячного платежа и переплаты. Условия застройщика на 21 августа 2026.',
    },
    kz: {
      title: 'Ипотека және бөліп төлеу — төлем калькуляторы',
      description:
        'Құрылыс салушының бөліп төлеуі және Банк Центр Кредит ипотекасы: 5%-дан және 6,5%-дан. Ай сайынғы төлем мен артық төлем калькуляторы. — 2026 жылғы 21 тамыз.',
    },
    en: {
      title: 'Mortgage and payment plans — calculator',
      description:
        'A developer payment plan and a Bank CenterCredit mortgage: from 5% and from 6.5%. Monthly-payment and interest calculator. Developer terms as at 21 August 2026.',
    },
  },
  commercial: {
    ru: {
      title: 'Коммерческие помещения на первых этажах — Асылым Парк 1',
      description:
        'Помещения с отдельным входом и витринами: площади от 44,71 до 233,48 м². Цена — по запросу. Условия подтверждает коммерческий отдел застройщика.',
    },
    kz: {
      title: 'Бірінші қабаттағы коммерциялық үй-жайлар — Асылым Парк 1',
      description:
        'Бөлек кіреберісі және витриналары бар үй-жайлар: аудандары 44,71-ден 233,48 м²-ге дейін. Бағасы — сұраныс бойынша. Шарттарды құрылыс салушының коммерциялық бөлімі растайды.',
    },
    en: {
      title: 'Ground-floor commercial units — Asylym Park 1',
      description:
        'Units with a separate entrance and shopfronts: 44.71 to 233.48 m². Price on request. The developer’s commercial team confirms the terms.',
    },
  },
  parking: {
    ru: {
      title: 'Паркинг и кладовые — Асылым Парк 1',
      description:
        'Наземный паркинг на территории комплекса. Места и кладовые продаются отдельно от квартиры. Точные условия подтверждает отдел продаж застройщика.',
    },
    kz: {
      title: 'Паркинг және қоймалар — Асылым Парк 1',
      description:
        'Кешен аумағындағы жерүсті паркингі. Орындар мен қоймалар пәтерден бөлек сатылады. Нақты шарттарды құрылыс салушының сату бөлімі растайды.',
    },
    en: {
      title: 'Parking and storage — Asylym Park 1',
      description:
        'Surface parking within the complex. Spaces and storage rooms are sold separately from the apartment. The developer’s sales office confirms the exact terms.',
    },
  },
  documents: {
    ru: {
      title: 'Документы и прозрачность — Асылым Парк 1',
      description:
        'Раздел документов появится, когда застройщик раскроет пакет по проекту. Запросите документы у отдела продаж — мы передадим запрос застройщику.',
    },
    kz: {
      title: 'Құжаттар және ашықтық — Асылым Парк 1',
      description:
        'Құрылыс салушы жоба бойынша құжаттар пакетін ашқан кезде бөлім пайда болады. Құжаттарды сату бөлімінен сұраңыз — сұранысты құрылыс салушыға жеткіземіз.',
    },
    en: {
      title: 'Documents and transparency — Asylym Park 1',
      description:
        'The document section will appear once the developer discloses the project pack. Request the documents from the sales office — we will pass the request on.',
    },
  },
  faq: {
    ru: {
      title: 'Частые вопросы о покупке квартиры — Асылым Парк 1',
      description:
        'Отделка при передаче квартиры, перепланировка, стоимость паркинга, документы для ипотеки, сроки выдачи ключей, благоустройство двора и коммерция — с конкретными ответами.',
    },
    kz: {
      title: 'Пәтер сатып алу туралы жиі қойылатын сұрақтар — Асылым Парк 1',
      description:
        'Пәтерді тапсыру кезіндегі әрлеу, қайта жоспарлау, паркинг құны, ипотека құжаттары, кілттерді беру мерзімі, ауланы абаттандыру — нақты жауаптармен.',
    },
    en: {
      title: 'Frequently asked questions — Asylym Park 1',
      description:
        'Handover finishing, changing the layout, parking prices, mortgage paperwork, key handover dates, courtyard landscaping and commercial units — answered concretely.',
    },
  },
  contacts: {
    ru: {
      title: 'Контакты и офис продаж — Асылым Парк 1',
      description:
        'Офис продаж: ул. Алихан Бокейхан, 16, Есиль район, Астана. Телефон +7 706 699 95 00, WhatsApp, e-mail. Часы работы: 09:00–19:00.',
    },
    kz: {
      title: 'Байланыс және сату кеңсесі — Асылым Парк 1',
      description:
        'Сату кеңсесі: Әлихан Бөкейхан к-сі, 16, Есіл ауданы, Астана. Телефон +7 706 699 95 00, WhatsApp, e-mail. Жұмыс уақыты: 09:00–19:00.',
    },
    en: {
      title: 'Contacts and sales office — Asylym Park 1',
      description:
        'Sales office: 16 Alikhan Bokeikhan St, Esil district, Astana. Phone +7 706 699 95 00, WhatsApp, e-mail. Opening hours 09:00–19:00.',
    },
  },
  privacy: {
    ru: {
      title: 'Политика конфиденциальности — Асылым Парк 1',
      description:
        'Какие персональные данные собираются через формы сайта, с какой целью, сколько хранятся, кому передаются и как отозвать согласие на обработку.',
    },
    kz: {
      title: 'Құпиялылық саясаты — Асылым Парк 1',
      description:
        'Сайт формалары арқылы қандай дербес деректер жиналады, қандай мақсатта, қанша сақталады және келісімді қалай қайтарып алуға болады.',
    },
    en: {
      title: 'Privacy policy — Asylym Park 1',
      description:
        'What personal data the site forms collect, why, how long it is stored, who it is shared with, and how to withdraw your consent.',
    },
  },
};

export function getSeoCopy(route: RouteKey, locale: Locale): SeoCopy {
  return ROUTE_SEO[route][locale];
}
