# Seller Listing Management — Phase 126

Улучшение управления объявлениями в личном кабинете продавца: статусы, действия, фильтры, заявки по объявлению.

---

## 1. Цель

Пользователь понимает состояние своих объявлений и может:
- видеть статусы с подсказками
- редактировать / отправить на модерацию
- архивировать / восстанавливать
- перейти к заявкам по объявлению

Без платного продвижения, платежей и сложной аналитики.

---

## 2. Что было до фазы

- `/account/listings` с фильтрами и `SellerListingManageCard`
- Archive/restore через `/api/listings/[id]/lifecycle`
- Edit → moderation при изменении published/rejected (Phase 110)
- Leads count в карточке без ссылки
- Нет submit API для draft/rejected
- Dashboard pending включал DRAFT

---

## 3. Статусы объявлений

UI labels (enum без изменений):

| Status | Label | Hint |
|---|---|---|
| DRAFT | Черновик | Ещё не отправлено на публикацию |
| PENDING_MODERATION | На модерации | Проверяем, после одобрения — в поиске |
| PUBLISHED | Активно | Опубликовано и видно |
| REJECTED | Отклонено | Измените и отправьте повторно |
| ARCHIVED | В архиве | Скрыто, можно восстановить |

Hints: `ListingStatusBadge showHint` + `status.hint.*` i18n.

---

## 4. Карточки моих объявлений

`SellerListingManageCard` показывает:
- фото, title, price, city, category
- status + hint, views, leads (link)
- rejection reason (если есть)
- status-specific actions

---

## 5. Действия по статусам

| Status | Actions |
|---|---|
| PUBLISHED | Открыть, Редактировать, Заявки, В архив, Продлить |
| PENDING | Открыть, Редактировать (заявки скрыты) |
| REJECTED | Редактировать, Отправить на модерацию, Открыть, В архив |
| ARCHIVED | Восстановить, Редактировать |
| DRAFT | Продолжить (edit), Отправить на модерацию |

---

## 6. Повторная отправка на модерацию

**API:** `POST /api/listings/[id]/submit`

- Owner only
- DRAFT / REJECTED → PENDING_MODERATION
- Guard: уже pending, нет title/description/photo
- `notifyListingSubmittedIfNeeded` (Phase 118)
- Audit: `listing.submit`

Edit published/rejected still triggers moderation via `PATCH /api/listings/[id]` when title/description/photos/category change (existing policy).

---

## 7. Архивирование / восстановление

**Archive:** `POST /api/listings/[id]/lifecycle` `{ action: "archive" }`  
Confirm: «Вы точно хотите скрыть объявление из поиска?»

**Restore:** `{ action: "restore" }` → PENDING_MODERATION (existing)  
Confirm + LISTING_SUBMITTED notification on restore.

---

## 8. Заявки по объявлению

- Карточка: link `Заявки (N)` → `/account/requests?tab=received&listingId=...`
- `getSellerLeads({ listingId })` filter
- Requests page header: «Заявки по объявлению «...»»
- Owner-only listing lookup (seller_profile_id match)

---

## 9. Фильтры

URL: `/account/listings?status=active|pending|rejected|archived|draft`

Empty states per filter (i18n keys `accountListings.empty*`).

Account dashboard:
- Clickable stat cards → filtered listings
- Activity summary links: active, pending, rejected, new leads

---

## 10. Android/WebView considerations

- Action buttons min-h 44px (`h-11`)
- Confirm dialog (Radix) — Back closes
- Horizontal filter chips with scroll
- No page horizontal overflow

---

## 11. Security

| Check | Status |
|---|---|
| Owner-only submit/archive/restore | ✅ session + seller_profile.user_id |
| listingId filter owner-scoped | ✅ |
| No raw errors | ✅ withApiHandler |
| Admin routes hidden | ✅ redirect |

---

## 12. Future

- Paid promotion / bump
- View analytics dashboard
- Bulk actions
- Auto-renewal
- Seller analytics

---

## Phase 129 — Marketplace analytics MVP

- Per-listing leads count + dates on `/account/listings`
- Leads button → `/account/requests?listingId=...`
- Views shown only when `view_count > 0` (no increment in this phase)

См. `docs/MARKETPLACE_ANALYTICS_PHASE_129.md`

---

## Файлы

| File | Change |
|---|---|
| `api/listings/[id]/submit/route.ts` | Submit for moderation |
| `SellerListingManageCard.tsx` | Status actions + hints |
| `AccountListingsEmptyState.tsx` | Filter-specific empty |
| `AccountListingsSummary.tsx` | Clickable stats |
| `AccountActivitySummary.tsx` | Links + rejected |
| `account/requests/page.tsx` | listingId filter |
| `leads-data.ts` | listingId in getSellerLeads |
| `account-dashboard-data.ts` | Pending excludes DRAFT |

---

## Migration

Нет — используются existing `ListingStatus` values.

---

## Связанные документы

- `docs/LISTING_MODERATION_NOTIFICATIONS_PHASE_118.md`
- `docs/LISTING_LEADS_CONTACT_FLOW_PHASE_119.md`
- `docs/SELLER_LISTING_MANAGEMENT_PHASE_126.md`
- `docs/SELLER_COMPANY_STOREFRONT_PHASE_127.md`
- `docs/LISTING_LEADS_WORKFLOW_PHASE_128.md`
- `docs/MARKETPLACE_ANALYTICS_PHASE_129.md`
