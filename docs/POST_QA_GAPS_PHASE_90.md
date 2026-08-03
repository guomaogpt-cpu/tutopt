# Post-QA Gaps — Phase 90

Закрытие UX/flow gaps после Product QA Phase 89. Без новых крупных фич, без Prisma refactor.

## 1. Gaps после Phase 89

- Нет отдельного route `/cargo/requests/[id]`
- Legacy buyer/seller routes всё ещё выглядели как «основной кабинет»
- Нет удобного alias `/account/cargo-settings`
- Фильтры местами слишком плотные на mobile
- Admin empty states без нормального заголовка/описания
- Нужна итоговая карта маршрутов

## 2. Что закрыто в Phase 90

- Полноценная страница `/cargo/requests/[id]` с privacy по ролям
- Отклики + modal `CargoRespondModal` на детальной странице
- Ссылки на detail из landing, board, account, notifications, Telegram
- Primary `/account/cargo-settings` (+ legacy redirect с `/seller/cargo-settings`)
- Soft redirects legacy dashboards/listings/leads
- Compact horizontal chips для account listings / seller cargo board
- Admin empty states (moderation, companies, cargo requests, users)
- i18n ключи `cargoRequest.*`, `account.cargoSettingsDescription`, `admin.empty.*`
- Документация и карта маршрутов ниже

## 3. `/cargo/requests/[id]`

| Viewer | Видит | Может |
|---|---|---|
| Guest | Safe preview (товар, маршрут, мета, статус, count) | Login/register CTA; без телефона клиента |
| Owner | Полные данные + контакты клиента + все отклики с контактами компаний | Навигация в `/account/requests` |
| Cargo company | Cargo-поля + свой отклик (если есть) | Отклик через modal, если ещё не откликался |
| Admin | Полная информация | Как owner + admin tools на `/admin/cargo-requests` |

Server-side: `getCargoRequestDetailForViewer` — контакты клиента только owner/admin; чужие отклики/телефоны не отдаются guest/company без права.

## 4. Основные account routes

| Назначение | Route |
|---|---|
| Личный кабинет | `/account` |
| Мои объявления | `/account/listings` |
| Мои заявки | `/account/requests` |
| Компания | `/account/company` |
| Карго-настройки | `/account/cargo-settings` |
| Карго-заявка (detail) | `/cargo/requests/[id]` |

## 5. Legacy routes

| Legacy | Поведение |
|---|---|
| `/buyer/dashboard` | redirect → `/account` |
| `/seller/dashboard` | redirect → `/account` |
| `/seller/listings` | redirect → `/account/listings` |
| `/seller/leads` | redirect → `/account/requests?tab=received` |
| `/buyer/cargo-requests` | redirect → `/account/requests?tab=cargoRequests` |
| `/seller/cargo-settings` | redirect → `/account/cargo-settings` |
| `/seller/cargo-requests` | **оставлен** — рабочий board карго-компаний |
| `/account/cargo-requests` | оставлен (тонкий список), UI ведёт на detail |

## 6. Admin empty states

Пустые списки показывают заголовок + короткое описание (i18n), без «голой» таблицы:

- moderation listings
- companies
- cargo requests
- users

(reports/audit уже имели нормальные empty states)

## 7. Осталось на потом

- Чат / рейтинг / отзывы / платежи — вне scope
- Field grouping на длинной `/listings/new` (P2 из Phase 89)
- Дальнейший CRM pipeline для карго
- Полный mobile drawer для всех catalog filters (сейчас toolbar + chips; не переписывали engine)
- Account security settings

## Phase 90 follow-up fixes

- Detail route + privacy matrix
- Route map (primary account + soft legacy redirects)
- Filter density polish (chips scroll)
- Admin empty polish + docs

## Phase 91 production smoke-test results

See `docs/PRODUCTION_SMOKE_TEST_PHASE_91.md`.

Production confirmed: public pages, uploads via `/api/uploads`, guest auth `next`, cargo guest privacy, sitemap/robots.

P0 fixed: non-UUID path params no longer 500 on listing/cargo/company routes.
