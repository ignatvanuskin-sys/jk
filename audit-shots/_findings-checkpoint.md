# QA Audit checkpoint — jk-flax.vercel.app (view 1440x900, user Chrome)

Tab targetId: tab-vtab-1341884878 (single tab)

## Task 1 — pages (VERIFIED via fetch status + HTML parse)
All 16 routes: HTTP 200, exactly 1 <h1>, <main> present, non-empty text.
- /ru h1 "Дом, где всё уже решено за вас"
- /ru/apartments "Каталог квартир"; /ru/apartments/a-04-1 "№ 19"
- /ru/commercial "Помещения на первых этажах"; /ru/complex "Три корпуса, один закрытый двор"
- /ru/construction "Ход строительства по месяцам"; /ru/contacts "Отдел продаж"
- /ru/developer "Кто строит"; /ru/documents "Документы и прозрачность"
- /ru/faq "Частые вопросы"; /ru/floorplans "Планировки и площади"
- /ru/infrastructure "Что есть рядом"; /ru/location "Всё необходимое — рядом"
- /ru/mortgage "Калькулятор платежа"; /ru/parking "Место для машины и место для хранения"
- /ru/privacy "Политика конфиденциальности"
- /ru/ne-stranica => 404 ; /ru/apartments/net-takoy => 404

## Task 2 — navigation (VERIFIED by real clicks)
Top row click: Квартиры→/ru/apartments, Планировки→/ru/floorplans, Инфраструктура→/ru/infrastructure,
Расположение→/ru/location, Ход строительства→/ru/construction — all correct.
"Ещё" menu items (all correct): О комплексе→/ru/complex, Ипотека и рассрочка→/ru/mortgage,
Коммерция→/ru/commercial, Паркинг и кладовые→/ru/parking, Документы→/ru/documents,
Вопросы→/ru/faq, Контакты→/ru/contacts.
Logo→/ru. Language switch: RU↔KZ↔EN all change URL + htmlLang (ru-KZ, kk-KZ, en) + content,
and preserve path (e.g. /kz/mortgage).
ACTIVE STATE: NONE — no aria-current and no active class on any nav item (FINDING).

## Task 3 — links/buttons (VERIFIED, homepage: 71 <a>, 26 <button>)
No empty href, no href="#", no javascript:void, no localhost/example/vercel-preview/staging/demo.
tel: href="tel:+77001234567", visible "+7 (700) 123-45-67" (also link "Позвонить" same).
wa.me: https://wa.me/77001234567?text=<prefilled RU text> (country code 7 correct, no spaces).
All buttons have onclick except the submit button (type=submit).
CTA clicked: "Получить консультацию" opens lead modal (Оставьте заявку).

## Task 4 — form (/api/lead)
Fields: name(required), phone(required,tel), interest(select), comment(maxlength=600),
website(HONEYPOT: tabindex=-1, autocomplete=off, hidden height 0), consent(required checkbox).
form noValidate=true, no action/method. Initial aria-invalid="false".
EMPTY submit: errors "Укажите имя / Укажите телефон / Отметьте согласие на обработку данных";
aria-invalid=true + aria-describedby=...-error on name/phone/consent; red borders; role=alert.
INVALID: phone "abc"->stripped to ""; phone "123"->"+7 123" err "Проверьте номер: нужен формат +7 XXX XXX XX XX";
name "A"/"Т"->"Слишком короткое имя"; <script>alert(1)</script> accepted as-is (no sanitize); emoji accepted.
No email field exists (email test N/A). comment maxlength=600 (500 ok).
VALID (1 submit): POST /api/lead 200, body {"name":"ТЕСТ АУДИТ","phone":"+77001234567","interest":"","comment":"","subject":"","source":"header","consent":true,"website":""}
response {"ok":true,"delivered":false} <-- delivered:false (lead NOT delivered) FINDING
UI: btn text "Отправляем…" + disabled=true during send; success screen "Заявка отправлена".
DOUBLE SUBMIT: 3 synchronous clicks => 3 POST /api/lead (no request-level dedup) FINDING.
Escape closes modal; focus returns to <body> not trigger (minor).

## Task 5 — console/network (partial)
console errors: [] ; JS exceptions: [] ; warnings: [] (on /ru, /ru/floorplans, /ru/documents, /ru/mortgage, /ru/apartments)
Network: static assets all 200 so far.

## Task 6
6.1 FAQ uses native <details name="faq"> — EXCLUSIVE accordion (only one open). VERIFIED on home.
6.2 /ru/floorplans viewer: opens role=dialog aria-modal, zoom −/+/Сбросить (1.00→2.00→1.50→1.00, step .5).
    NO visible close button anywhere. Escape closes. Focus -> body. FINDING.
6.3 /ru/documents: clicking a document opens the LEAD FORM with ТЕМА ОБРАЩЕНИЯ=<doc name>,
    NOT a document preview/PDF. Copy says "откройте его просмотр" (misleading). Modal has Закрыть. FINDING.
6.4 /ru/mortgage calc: sliders price 15-70M, down 5-90%, term 1-25, rate number, program select.
    Recalculates correctly (25M/20%/25y/7% -> 141 356 ₸; 70M->56M credit; 50%->35M vznos; term10 overpay 13.77M; bank14%/20y->248 704 ₸). Adequate.
6.5 /ru/apartments filters: rooms single-select (1->27,2->98), status multi OR (avail+reserved=149; +Продана=214),
    корпус A->40, цена до 25M->27. Counter "Найдено N квартир" updates. Sort select present. WORKS.

## Remaining
- 6.1 /ru/faq page accordion
- Task 7: 404 design + keyboard (TAB focus, Ещё via keyboard, Escape restore focus)
- Task 5: scan failed/slow/duplicate requests
- Screenshots into audit-shots/
