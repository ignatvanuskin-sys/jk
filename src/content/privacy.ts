import type { Locale } from '@/i18n/config';

/**
 * Privacy policy.
 *
 * ⚠️  TEMPLATE TEXT. It describes exactly what THIS site does — one lead form,
 * three fields, local storage plus an optional webhook — and nothing more.
 * Before launch it must be reviewed by a lawyer and aligned with the actual
 * data processor named in the developer's documents.
 *
 * It deliberately does not claim cookie-based tracking, because the site sets
 * no analytics or advertising cookies in this build.
 */
export interface PrivacySection {
  title: Record<Locale, string>;
  body: Record<Locale, string[]>;
}

export const PRIVACY_UPDATED_AT = '2026-09-01';

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    title: {
      ru: 'Какие данные мы собираем',
      kz: 'Қандай деректерді жинаймыз',
      en: 'What data we collect',
    },
    body: {
      ru: [
        'Через формы на сайте мы собираем три поля: имя, номер телефона и интересующую вас категорию квартиры. Поле комментария заполняется по желанию.',
        'Дополнительно сервер фиксирует дату и время отправки и источник обращения — раздел сайта, с которого вы отправили заявку. Это нужно, чтобы менеджер понимал контекст разговора.',
      ],
      kz: [
        'Сайттағы формалар арқылы біз үш өрісті жинаймыз: атыңыз, телефон нөміріңіз және қызықтыратын пәтер санаты. Түсініктеме өрісі қалауыңыз бойынша толтырылады.',
        'Қосымша сервер жіберілген күн мен уақытты және өтінім көзін — өтінім жіберілген сайт бөлімін тіркейді. Бұл менеджерге әңгіме контекстін түсіну үшін қажет.',
      ],
      en: [
        'Through the forms on this site we collect three fields: your name, your phone number and the apartment category you are interested in. The comment field is optional.',
        'The server additionally records the date and time of submission and the source of the enquiry — the section of the site the request came from. This lets the manager understand the context of the call.',
      ],
    },
  },
  {
    title: {
      ru: 'Зачем мы их обрабатываем',
      kz: 'Оларды не үшін өңдейміз',
      en: 'Why we process it',
    },
    body: {
      ru: [
        'Единственная цель — связаться с вами по вашему запросу: подобрать квартиру, рассчитать стоимость, объяснить условия покупки или записать на просмотр.',
        'Мы не используем ваши данные для рассылок, о которых вы не просили, и не передаём номер телефона третьим лицам, кроме случаев, прямо предусмотренных законом.',
      ],
      kz: [
        'Жалғыз мақсат — сіздің сұранысыңыз бойынша хабарласу: пәтер таңдау, құнын есептеу, сатып алу шарттарын түсіндіру немесе қарауға жазылу.',
        'Біз деректеріңізді сіз сұрамаған хабарламалар үшін пайдаланбаймыз және заңда тікелей көзделген жағдайларды қоспағанда, телефон нөмірін үшінші тұлғаларға бермейміз.',
      ],
      en: [
        'The only purpose is to contact you about your request: shortlist an apartment, calculate a price, explain the purchase terms or book a viewing.',
        'We do not use your data for marketing you did not ask for, and we do not pass your phone number to third parties except where the law explicitly requires it.',
      ],
    },
  },
  {
    title: {
      ru: 'Правовое основание',
      kz: 'Құқықтық негіз',
      en: 'Legal basis',
    },
    body: {
      ru: [
        'Обработка выполняется на основании вашего согласия, которое вы подтверждаете галочкой перед отправкой формы. Согласие можно отозвать в любой момент.',
        'Отправляя форму, вы подтверждаете, что достигли возраста, с которого самостоятельно даёте согласие на обработку персональных данных.',
      ],
      kz: [
        'Өңдеу форманы жібермес бұрын құсбелгімен растайтын келісіміңіз негізінде жүзеге асырылады. Келісімді кез келген уақытта қайтарып алуға болады.',
        'Форманы жіберу арқылы сіз дербес деректерді өңдеуге келісім беретін жасқа толғаныңызды растайсыз.',
      ],
      en: [
        'Processing is carried out on the basis of your consent, which you confirm with the checkbox before submitting the form. Consent can be withdrawn at any time.',
        'By submitting the form you confirm that you are old enough to give consent to the processing of personal data on your own behalf.',
      ],
    },
  },
  {
    title: {
      ru: 'Сколько храним и кому передаём',
      kz: 'Қанша сақтаймыз және кімге береміз',
      en: 'How long we keep it and who receives it',
    },
    body: {
      ru: [
        'Заявки хранятся до достижения цели обработки, но не дольше срока, установленного законодательством Республики Казахстан для таких данных.',
        'Для обработки заявки данные могут передаваться сотрудникам отдела продаж застройщика и, при необходимости, банку-партнёру — только в объёме, нужном для рассмотрения вашего обращения.',
      ],
      kz: [
        'Өтінімдер өңдеу мақсатына жеткенге дейін, бірақ Қазақстан Республикасының заңнамасында мұндай деректер үшін белгіленген мерзімнен ұзақ сақталмайды.',
        'Өтінімді өңдеу үшін деректер құрылыс салушының сату бөлімінің қызметкерлеріне және қажет болған жағдайда серіктес банкке — тек сіздің өтінішіңізді қарауға қажетті көлемде берілуі мүмкін.',
      ],
      en: [
        'Enquiries are stored until the purpose of processing is achieved, but no longer than the period established by the legislation of the Republic of Kazakhstan for such data.',
        'To process your enquiry, the data may be shared with the developer’s sales team and, where necessary, with a partner bank — only to the extent required to handle your request.',
      ],
    },
  },
  {
    title: {
      ru: 'Ваши права',
      kz: 'Сіздің құқықтарыңыз',
      en: 'Your rights',
    },
    body: {
      ru: [
        'Вы вправе запросить сведения об обработке ваших данных, потребовать их исправления или удаления, а также отозвать согласие.',
        'Для этого достаточно написать на контактный e-mail, указанный в разделе «Контакты». Запрос обрабатывается в сроки, установленные законодательством.',
      ],
      kz: [
        'Сіз деректеріңізді өңдеу туралы мәліметтерді сұрауға, оларды түзетуді немесе жоюды талап етуге, сондай-ақ келісімді қайтарып алуға құқылысыз.',
        'Ол үшін «Байланыс» бөлімінде көрсетілген e-mail мекенжайына жазу жеткілікті. Сұраныс заңнамада белгіленген мерзімде қаралады.',
      ],
      en: [
        'You have the right to request information about how your data is processed, to require its correction or deletion, and to withdraw your consent.',
        'To do so, simply write to the contact e-mail listed in the Contacts section. The request is handled within the period established by law.',
      ],
    },
  },
  {
    title: {
      ru: 'Контакты по персональным данным',
      kz: 'Дербес деректер бойынша байланыс',
      en: 'Personal data contact',
    },
    body: {
      ru: [
        'Оператор персональных данных — застройщик проекта. Реквизиты, БИН и контакт ответственного лица за обработку персональных данных указываются перед публикацией сайта.',
        'Настоящий текст является шаблоном для демонстрационной версии сайта и подлежит юридической проверке перед запуском.',
      ],
      kz: [
        'Дербес деректер операторы — жобаның құрылыс салушысы. Деректемелер, БСН және дербес деректерді өңдеуге жауапты тұлғаның байланысы сайт жарияланбас бұрын көрсетіледі.',
        'Бұл мәтін сайттың демонстрациялық нұсқасына арналған үлгі және іске қосар алдында заңдық тексеруден өтуі тиіс.',
      ],
      en: [
        'The personal data controller is the developer of the project. The company details, BIN and the contact for the person responsible for data processing are filled in before the site goes live.',
        'This text is a template for the demonstration build and must be reviewed legally before launch.',
      ],
    },
  },
];
