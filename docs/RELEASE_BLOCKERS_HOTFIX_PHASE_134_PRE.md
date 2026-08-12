# Release Blockers Hotfix — Phase 134-pre

> **Статус:** hotfix по результатам ручного теста Android release build.  
> **Не публикуем** в Google Play в этой фазе.

---

## 1. Найденные проблемы

| # | Проблема | Приоритет |
|---|---|---|
| 1 | Поиск на Android: query исчезает, переход на `/listings` без `q` | P0 |
| 2 | Создание объявления: запись создаётся, но пользователь видит ошибку | P0 |
| 3 | Публичная страница компании `/companies/[id]` → 404 | P0 |
| 4 | В кабинете непонятно, где «Мои объявления» | P1 |

---

## 2. Root cause

### Mobile search

- На Android WebView `type="search"` может очищать поле **до** чтения React state при submit.
- Form submit читал `query` из state, который уже пустой → `router.push("/listings")` без `?q=`.
- На `/listings` поле синхронизируется с URL → поиск «не работает».

### Listing create false error

- `POST /api/listings` создаёт listing, затем вызывает `createListingSubmittedNotification`.
- Если notification insert падает (часто: enum `LISTING_SUBMITTED` не применён в production DB), API возвращает **500**.
- Frontend показывает ошибку, хотя listing уже в БД.
- Повторный submit → duplicate guard → «такое объявление уже создано».

### Company public page 404

- Публичные ссылки использовали `slug`, который **меняется** при первом сохранении профиля компании.
- Старый slug → 404; также возможна путаница slug vs `SellerProfile.id`.
- `/seller/[id]` не редиректил на `/companies/[id]` для company profiles.

### Account navigation

- Карусель метрик (`AccountMyActivityStats`) выглядела как единственная навигация.
- «Мои объявления» не был явной кнопкой на mobile.

---

## 3. Что исправлено

| Область | Fix |
|---|---|
| Search | `type="text"` + `inputMode="search"`; чтение значения из DOM при submit (`data-search-input`) |
| Listing create | Notification wrapped in try/catch — listing success не блокируется |
| Company page | Все internal links используют стабильный `SellerProfile.id`; redirect seller→company; decode param |
| Account | Блок «Управление» с явными list rows над аналитикой |

---

## 4. Railway migration deploy

**Да, Railway migration deploy required** (если ещё не выполнен после Phase 118+).

Критичные migrations для этих багов:

| Migration | Зачем |
|---|---|
| `20260808140000_listing_submitted_notification` | Enum `LISTING_SUBMITTED` для in-app notification |
| `20260801140000_company_profile_fields` | `company_type`, `posted_as_company` |
| `20260801150000_company_verification_status` | `verification_status` |

**Владельцу проекта:**

- выполнить **только deploy migrations** на Railway
- **не** делать reset / drop database
- **не** делать seed без причины
- **не** удалять данные

После deploy: redeploy web service если нужно.

Code fix для notification делает create устойчивым даже без migration, но migration всё равно нужна для полноценных уведомлений.

---

## 5. Как проверить на production

1. **Поиск (Android):** главная → ввести «фасовщик» → Enter → `/listings?q=фасовщик`, query в поле сохранён.
2. **Listing create:** `/listings/new` → submit → success UI, без ошибки; в админке moderation queue.
3. **Company:** `/account/company` → save → «Открыть публичную страницу» → 200, не 404.
4. **Admin company link:** `/admin/companies` → open public → 200.
5. **Account:** `/account` → блок «Управление» → «Мои объявления» → `/account/listings`.

---

## 6. Повторная проверка на Android release build

- [ ] Homepage search → listings with q
- [ ] Listings page search update
- [ ] Create listing → success (no false error)
- [ ] Company public page from account
- [ ] Company public page from admin
- [ ] Account «Мои объявления» navigation
- [ ] Cyrillic search query
- [ ] Back button after search

---

## Migration

**Railway migration deploy required** — см. §4.

---

## Связанные документы

- `docs/ANDROID_REAL_DEVICE_RELEASE_TEST_PHASE_133.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
