# Phase 101 — Company profiles MVP

## 1. Цель

Довести профили компаний до понятного user-friendly MVP: кабинет, публичная витрина, отображение в объявлениях, публикация от компании, verified badge, empty states и базовая admin-проверка.

Карго MVP заморожен для закрытого теста — в этой фазе карго не менялся без необходимости.

## 2. Что проверено

- `/account/company` — создание / редактирование профиля
- `/companies/[id]` — публичная страница + not-found
- `/account` — summary компании
- `/account/listings` — флаг публикации от компании
- `/listings/new` — selector «Разместить от имени»
- `/listings/[id]` — блок компании / автора
- `ListingCard` — бейдж компании + ссылка
- verified badge (публично / владельцу)
- `/admin/companies` — verify / reject / reset
- mobile: отступы под bottom nav, компактный логотип, chips

## 3. Что улучшено

- Публичная страница показывает только объявления с `posted_as_company=true`
- Vertical chips (Все / Объявления / Услуги / Опт / Карго), если направлений больше одного
- Публично ярко только «Проверенная компания»; PENDING/REJECTED скрыты от гостей
- Trust-блок не показывает «На проверке» / «Отклонена» публично
- ListingCard: название компании ведёт на `/companies/[slug|id]`
- `/account/company`: понятный empty CTA и кнопка «Открыть публичную страницу»
- Listing detail: тип компании, «Открыть компанию»
- Soft hint на `/listings/new` без компании
- Safe not-found для `/companies/[id]`
- Admin: локализованная колонка «Действия»

## 5. Phase 127 — Storefront upgrade ✅

- Preview в `/account/company`
- Блок «О компании», actions, report profile
- Admin: публичная ссылка + active listings count
- См. `docs/SELLER_COMPANY_STOREFRONT_PHASE_127.md`

## 4. Как работает `/account/company`

1. Логин + телефон обязательны
2. Если `company_type` не задан — форма создания с описанием ценности компании
3. Поля: название, тип, город, телефон, описание, сайт, логотип
4. После сохранения — публичная ссылка и блок verification (отправить на проверку)
5. Типы в UI человекочитаемые (Магазин / Поставщик / Сервисная / Карго / Другое)

## 5. Как работает публичная страница компании

URL: `/companies/[id|slug]`

Показывает: логотип, название, тип, город, описание, сайт, verified badge (только VERIFIED), дату на сайте, активные company-listings.

Не показывает: admin note, REJECTED/PENDING как яркий статус, private owner fields (для гостей — sanitize).

Не найдена / без `company_type` → safe 404.

## 6. Как компания отображается в объявлениях

- Карточка: бейдж «Компания» (цвет по vertical), verified если VERIFIED, ссылка на компанию
- Деталь: блок компании с типом/городом и «Открыть компанию»
- Личная публикация: автор / поставщик / исполнитель — без company badge

## 7. Как публиковать от компании

На `/listings/new`:

- selector «Личный аккаунт» / «Компания: {name}»
- без профиля — soft hint + ссылка создать
- server: `posted_as_company` только если у текущего пользователя есть `company_type`; `seller_profile_id` всегда из session

## 8. Как работает verified badge

| Статус | Owner | Public |
| --- | --- | --- |
| UNVERIFIED | Не проверена | скрыт / «Не проверена» в trust-блоке |
| PENDING | На проверке | скрыт badge; trust = Не проверена |
| VERIFIED | Проверенная компания | яркий badge |
| REJECTED | Проверка отклонена | скрыт; trust = Не проверена |

Admin: `/admin/companies` (только ADMIN).

## 9. Что осталось

- Employees / roles внутри компании
- Документы / юридический KYC
- Платная верификация
- Отзывы / рейтинги
- Unified redirect `/seller/[id]` → `/companies/[id]` для company profiles
- Фильтр «только проверенные» в каталоге объявлений

## 10. Решение: готово к тесту компаний

**Готово** к закрытому тесту профилей компаний (без KYC, без сотрудников, без рейтингов).
