# Release Blockers Hotfix — Phase 134-pre

> **Статус:** hotfix по результатам ручного теста **signed Android release AAB**.  
> **Не публикуем** в Google Play в этой фазе.

---

## 1. Цель

Исправить критичные release blockers перед Google Play Internal Testing:

- mobile search на Android
- false error при создании объявления
- 404 публичной страницы компании
- неочевидная навигация «Мои объявления» в кабинете

---

## 2. Найденные проблемы

| # | Проблема | Приоритет |
|---|---|---|
| 1 | Поиск на Android: query исчезает, переход на `/listings` без `q` | P0 |
| 2 | Создание объявления: запись создаётся, но пользователь видит ошибку | P0 |
| 3 | Публичная страница компании `/companies/[id]` → 404 | P0 |
| 4 | В кабинете непонятно, где «Мои объявления» | P1 |

---

## 3. Root cause: mobile search

- На Android WebView `type="search"` может очищать поле **до** чтения React state при submit.
- Form submit читал `query` из state, который уже пустой → `router.push("/listings")` без `?q=`.
- На `/listings` поле синхронизируется с URL → поиск «не работает».

---

## 4. Root cause: listing create false error

- `POST /api/listings` создаёт listing, затем вызывает `createListingSubmittedNotification`.
- Если notification insert падает (часто: enum `LISTING_SUBMITTED` не применён в production DB), API возвращает **500**.
- Frontend показывает ошибку, хотя listing уже в БД.
- Повторный submit → duplicate guard → «такое объявление уже создано».

---

## 5. Root cause: company public 404

- Публичные ссылки использовали `slug`, который **меняется** при первом сохранении профиля компании.
- Старый slug → 404; также возможна путаница slug vs `SellerProfile.id`.
- `/seller/[id]` не редиректил на `/companies/[id]` для company profiles.

---

## 6. Account navigation fix

- Карусель метрик (`AccountMyActivityStats`) выглядела как единственная навигация.
- «Мои объявления» не был явной кнопкой на mobile.

**Fix:** блок «Управление» на `/account` с list rows: Мои объявления, Мои заявки, Компания, Избранное, Уведомления, Поддержка — **над** аналитикой.

---

## 7. Что исправлено (код)

| Область | Fix |
|---|---|
| Search | `type="text"` + `inputMode="search"`; чтение значения из DOM при submit (`data-search-input`) |
| Listing create | Notification wrapped in try/catch — listing success не блокируется |
| Company page | Все internal links используют стабильный `SellerProfile.id`; redirect seller→company; decode param |
| Account | Блок «Управление» с явными list rows над аналитикой |

---

## 8. Migration / Railway status

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

**Migration: Railway migrate deploy required** (если ещё не выполнен).

---

## 9. Как проверить на телефоне

1. **Поиск (Android):** главная → ввести «фасовщик» → Enter → `/listings?q=фасовщик`, query в поле сохранён.
2. **Listing create:** `/listings/new` → submit → success UI, без ошибки; в админке moderation queue.
3. **Company:** `/account/company` → save → «Открыть публичную страницу» → 200, не 404.
4. **Admin company link:** `/admin/companies` → open public → 200.
5. **Account:** `/account` → блок «Управление» → «Мои объявления» → `/account/listings`.

Viewport: 390×844, 430×932.

---

## 10. Повторная проверка на Android release build

- [ ] Homepage search → listings with q
- [ ] Listings page search update
- [ ] Create listing → success (no false error)
- [ ] Company public page from account
- [ ] Company public page from admin
- [ ] Account «Мои объявления» navigation
- [ ] Cyrillic search query
- [ ] Back button after search

---

## 11. Что осталось перед Google Play Internal Testing

| Item | Status |
|---|---|
| Deploy Railway migrations | ⏳ owner |
| Redeploy production web | ⏳ after migrations |
| Retest signed AAB on device | ⏳ after deploy |
| Screenshots | Missing |
| Test account in Play Console | Missing |
| Legal sign-off privacy/terms | Needs review |
| Upload AAB to internal testing | ⏳ after retest pass |

**Not ready for internal testing** until: migrations deployed + device retest pass.

---

## Migration

**Railway migrate deploy required** — см. §8.

---

## Связанные документы

- `docs/ANDROID_REAL_DEVICE_RELEASE_TEST_PHASE_133.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
