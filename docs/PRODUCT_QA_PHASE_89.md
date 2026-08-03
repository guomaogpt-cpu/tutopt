# Product QA — Phase 89

Проверка реальных пользовательских цепочек после UX Phase 87/88.

## Summary

| Сценарий | Статус | P0 | P1 |
|---|---|---|---|
| 1. Guest browsing | OK | — | price color (fixed) |
| 2. Guest registration / post | OK | — | — |
| 3. Post listing | OK | — | — |
| 4. Service listing | OK after fix | — | «Что продаёте?» (fixed) |
| 5. Wholesale listing | OK after fix | — | section title (fixed) |
| 6. Company profile | OK | — | — |
| 7. Cargo client | Fixed | contacts loop | success CTA |
| 8. Cargo company | OK | board phones admin-only (by design) | respond button color |
| 9. Account dashboard | OK after fix | — | double bottom padding |
| 10. Admin moderation | OK | — | staff post CTA hidden |
| 11. Mobile | OK after fix | — | double pb, staff nav |
| 12. Errors / empty | OK | — | response status i18n |

---

## 1. Guest browsing flow

**Шаги:** `/` → `/market` → search → `/listings/[id]` → try lead/favorite  
**Ожидание:** просмотр без auth; login только на действие  
**Факт:** OK (contacts gated, lead/favorite → `next`)  
**Проблемы:** цена в contact card всегда синяя  
**Исправлено:** цвет цены берёт vertical theme  
**Осталось:** —

## 2. Guest registration flow

**Шаги:** Подать → login/register `next=/listings/new` → после auth вернуться  
**Ожидание:** нет buyer/seller выбора; форма с типом публикации  
**Факт:** OK (`BUYER` по умолчанию, RoleSelector не в register)  
**Проблемы:** нет  
**Исправлено:** —  
**Осталось:** —

## 3. Post listing flow

**Шаги:** `/listings/new` → MARKET → фото → submit → success → `/account/listings`  
**Ожидание:** success + объявление в кабинете (в т.ч. pending)  
**Факт:** OK  
**Проблемы:** нет  
**Исправлено:** —  
**Осталось:** P2 field grouping

## 4. Service listing flow

**Шаги:** `/listings/new?vertical=services`  
**Ожидание:** тексты про услугу, зелёный theme, `/services` каталог  
**Факт:** labels OK; секция была «Что продаёте?»  
**Проблемы:** P1 product wording  
**Исправлено:** `services.formSectionTitle`  
**Осталось:** —

## 5. Wholesale listing flow

**Шаги:** `/listings/new?vertical=opt`  
**Ожидание:** MOQ, синий theme, `/opt`  
**Факт:** OK  
**Проблемы:** generic section title  
**Исправлено:** `opt.formSectionTitle`  
**Осталось:** —

## 6. Company profile flow

**Шаги:** `/account/company` → create → account summary → post-as-company → `/companies/[id]`  
**Ожидание:** компания видна, soft hint без блока  
**Факт:** OK  
**Проблемы:** нет  
**Исправлено:** —  
**Осталось:** —

## 7. Cargo client flow

**Шаги:** `/cargo` → modal → submit → `/account/requests` → see responses  
**Ожидание:** success понятен; отклики с контактами компании; guest phones не публичны  
**Факт:** P0 — контакты компании не показывались владельцу заявки; success без CTA  
**Проблемы:** contact loop broken; guest dead-end messaging  
**Исправлено:**
- contacts в `AccountCargoResponseCard` + `/account/cargo-requests`
- success → Мои заявки / login+register для guest
- copy под модель «компания оставляет контакт в отклике»  
**Осталось:** отдельный `/cargo/requests/[id]` (backlog; сейчас account pages)

## 8. Cargo company flow

**Шаги:** cargo listing → `/seller/cargo-settings` → board → respond  
**Ожидание:** Telegram; отклик; клиент видит контакт; клиентский phone скрыт на board  
**Факт:** board phones admin-only (Phase 88 security); respond works  
**Проблемы:** P1 rose button vs orange theme  
**Исправлено:** orange primary на respond  
**Осталось:** `/account/cargo-settings` alias (P2)

## 9. Account dashboard flow

**Шаги:** `/account` quick actions  
**Ожидание:** listings/requests/favorites/notifications/company/cargo/post  
**Факт:** OK; двойной bottom padding  
**Проблемы:** P1 mobile gap  
**Исправлено:** убран page-level pb (layout уже паддит)  
**Осталось:** —

## 10. Admin moderation flow

**Шаги:** admin menu only for staff; moderation empty CTA  
**Ожидание:** обычный user не видит admin  
**Факт:** OK  
**Проблемы:** P1 moderator «Подать» → login URL  
**Исправлено:** post tab скрыт для staff в mobile nav  
**Осталось:** —

## 11. Mobile flow

**Шаги:** key pages + bottom nav  
**Ожидание:** нет overlap CTA, нет double gap  
**Факт:** layout pb + page pb = двойной зазор  
**Проблемы:** P1  
**Исправлено:** page-level pb убран на account/favorites/notifications/cargo  
**Осталось:** catalog filter density (P2)

## 12. Error / empty states

**Шаги:** bad login, empty search, empty account, cargo empty, response status  
**Ожидание:** короткие тексты, без stack  
**Факт:** mostly OK; response status был NEW/ACCEPTED  
**Проблемы:** P1  
**Исправлено:** i18n статусов откликов  
**Осталось:** admin empty polish (P2)

---

## Fixes done in Phase 89

### P0
- Владелец карго-заявки видит `contact_name` / `contact_phone` из отклика компании

### P1
- Cargo success CTA → `/account/requests` (+ guest login/register)
- Services / Opt form section titles
- Listing price color = vertical theme
- Cargo respond button orange
- Double mobile bottom padding removed
- Staff mobile post CTA hidden
- Cargo response status i18n

## Backlog (P2/P3)

- Field grouping on long `/listings/new`

## Phase 90 follow-up fixes

Закрыто в `docs/POST_QA_GAPS_PHASE_90.md`:

- `/cargo/requests/[id]` detail + privacy
- Soft redirects legacy buyer/seller dashboards
- `/account/cargo-settings` primary alias
- Filter density (horizontal chips)
- Admin empty-state polish

## Phase 91 production smoke-test results

Live Railway check: `docs/PRODUCTION_SMOKE_TEST_PHASE_91.md`.

- Public/SEO/uploads/auth redirects OK
- P0: invalid UUID ids caused 500 on listing/cargo/company — fixed with `isUuid` guards
- Logged-in create/cargo/Telegram/admin: requires manual account test

## Phase 92 manual production QA results

See `docs/MANUAL_PRODUCTION_QA_PHASE_92.md`.

Checklist A–G prepared; UX: cargo open-detail CTA, Telegram refresh status, photo uploaded hint. Live login e2e remains owner-run.

