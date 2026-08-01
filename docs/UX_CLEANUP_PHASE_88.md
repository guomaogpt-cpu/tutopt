# UX Cleanup — Phase 88

## 1. Цель фазы

Исправить оставшиеся P0/P1 из `docs/UX_PRODUCT_AUDIT_PHASE_87.md`: безопасность контактов карго, CTA/empty states, returnUrl/`next`, vertical theme на ключевых CTA, mobile bottom-nav overlap, нейтральная терминология.

Новые крупные функции не добавлялись.

## 2. Что было исправлено

### Security / P0
- `/seller/cargo-requests`: контакты (`name`, `phone`) blanked для не-админов на сервере (`includeContacts`).
- Onboarding/post-auth path builders используют `isSafeInternalPath` (без open redirect).

### Navigation / auth
- Header + SettingsDrawer: login/register с `next` = текущий pathname.
- Primary nav без изменений: кабинет → `/account`, подать → `/listings/new`.

### Account / listing flow
- Hub empty states с CTA (подать / смотреть объявления / карго-заявка).
- Success `/listings/new`: открыть / мои объявления / подать ещё одно.

### Cargo
- Empty board: title + description + CTA на карго-настройки.
- Landing colors уже были orange (Phase 84/86); не ломались.

### Visual / mobile
- Vertical theme на MobileBottomNav, listing CTAs, lead form, post-as.
- Safe-area padding на favorites, notifications, company.

### Terminology
- User-facing «Продавец» → «Автор» / нейтральные тексты (profiles, listing labels, empty copy).
- Admin technical role names не трогались.

## 3. Навигация после cleanup

| Место | Цель |
|---|---|
| Logo | `/` |
| Опт / Объявления / Услуги / Карго | `/opt` `/market` `/services` `/cargo` |
| Избранное | `/favorites` |
| Уведомления | `/notifications` |
| Профиль / mobile profile | `/account` |
| Подать | `/listings/new` (+ login `next` для guest) |
| Profile menu | account / listings / requests / company / cargo-settings |

## 4. Auth / returnUrl после cleanup

- Параметр: `next` (не `returnUrl`).
- Safe internal only: `isSafeInternalPath`.
- Guest «Подать» → `/login?next=/listings/new`.
- Guest header login → `/login?next=<current path>`.
- Favorites / account / company → login с соответствующим `next`.
- Post-auth default для BUYER/SELLER → `/account`.

## 5. Account flow после cleanup

- `/account` hub: quick actions + summaries с empty CTA.
- Объявления / заявки / компания / карго / избранное / уведомления доступны без buyer/seller dashboards.
- Legacy dashboards остаются с soft-notice (Phase 87).

## 6. Cargo flow после cleanup

- Публичный `/cargo`: без private phones.
- Board `/seller/cargo-requests`: phones только admin; empty CTA → settings.
- Settings `/seller/cargo-settings` временно operational.

## 7. Mobile fixes

- Bottom nav color follows vertical theme.
- Extra bottom padding на account-adjacent pages, чтобы CTA не перекрывались nav.
- Listing sticky CTA использует цвет вертикали.

## 8. Что осталось

### P2
- Soft/hard redirects `/buyer/*` `/seller/dashboard|listings|leads` → `/account*`.
- Alias `/account/cargo-settings`.
- Catalog mobile filter density.
- Admin empty-state CTA consistency.
- Дальнейшая группировка полей `/listings/new`.

### P3
- Empty-state micro-animations.
- Status badge icons.
- Visual polish на legacy seller pages.

### Future UX backlog
- Unified cargo ops under `/account/*`.
- Deprecate unused `RoleSelector`.
- Full public copy pass remaining seller SEO strings if needed.
