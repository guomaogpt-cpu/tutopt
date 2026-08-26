# Marketplace Analytics MVP — Phase 129

## 1. Цель

Добавить минимальную аналитику для marketplace MVP без BI-системы, тяжёлых графиков и изменений Prisma schema.

Продавец видит свою активность и метрики по объявлениям/заявкам. Админ видит обзор платформы, разрез по разделам и последние события.

---

## 2. Seller metrics

**Route:** `/account`

Блок «Моя активность» (`AccountMyActivityStats`):

| Карточка | Ссылка |
|---|---|
| Активные объявления | `/account/listings?status=active` |
| На модерации | `/account/listings?status=pending` |
| Полученные заявки | `/account/requests?tab=received` |
| Новые заявки | `/account/requests?tab=received&status=new` |
| Отправленные заявки | `/account/requests?tab=sent` |

Empty state: «Пока нет активности» + кнопка «Подать объявление».

Данные: `getAccountDashboardData` (listing stats + lead counts), owner-scoped.

---

## 3. Listing metrics

**Route:** `/account/listings`

На каждой карточке объявления (`SellerListingManageCard`):

- количество заявок (meta + кнопка «Заявки: N» для published)
- статус
- дата создания / обновления / публикации (account labels)
- просмотры — только если `view_count > 0` (поле есть в schema, инкремент не реализован)

Кнопка заявок → `/account/requests?tab=received&listingId=...`

---

## 4. Requests metrics

**Route:** `/account/requests`

Компактная сводка (`AccountRequestsStatusSummary`) для received/sent:

- Всего / Новые / В работе / Завершены / Отклонены

Фильтр: `?status=all|new|viewed|closed|rejected`

Mobile: horizontal chips с overflow-x scroll.

Helpers: `countLeadsByStatus`, `filterLeadsByStatus`, `parseAccountRequestsStatus`.

---

## 5. Admin dashboard metrics

**Route:** `/admin`

Блок «Marketplace overview» (`getAdminMarketplaceMetrics`):

| Карточка | Ссылка |
|---|---|
| Пользователи (admin only) | `/admin/users` |
| Активные объявления | — |
| На модерации | `/admin/moderation/listings` |
| Отклонённые | — |
| Архивные | — |
| Новые заявки | — |
| Жалобы | `/admin/reports` |
| Компании на проверке | `/admin/companies` |

Дополнительно для admin: продавцы, заблокированные, заявки за 7 дней, audit за 7 дней, карго.

Empty state: «Пока нет данных для отображения.»

---

## 6. Разрез по разделам

**Route:** `/admin`

Блок «Объявления по разделам» — grid по vertical (Объявления, Услуги, Опт, Карго):

- всего / активные / на модерации

Клик → `/admin/moderation/listings?vertical=...`

---

## 7. Последние события

**Route:** `/admin`

`getLatestMarketplaceEvents(10)` — merge из:

- новые объявления (`listing.created_at`)
- новые заявки (`lead.created_at`)
- новые жалобы (`report.created_at`)
- audit log (одобрение/отклонение и др.)

Без отдельной activity feed модели. Без телефонов и приватных полей.

---

## 8. Security

| Check | Status |
|---|---|
| Seller видит только свои метрики | ✅ session + seller_profile |
| listingId filter owner-scoped | ✅ |
| Admin metrics только staff role | ✅ redirect non-staff |
| Нет public analytics API | ✅ server components only |
| Телефоны не в overview cards | ✅ counts only |
| No raw errors / no any | ✅ |

---

## 9. Android/WebView considerations

- Компактные карточки, min-w chips для horizontal scroll
- `overflow-x-auto` на chips, `min-w-0 overflow-x-clip` на страницах
- Back работает через обычную навигацию Link
- Bottom nav не перекрывает контент (existing layout)

---

## 10. Known limitations

- `view_count` не инкрементируется — показ только если > 0
- Нет admin listings route — карточка «Активные объявления» без ссылки
- Latest events — merge existing models, не полный audit trail
- Нет CSV export, daily reports, revenue analytics

---

## 11. Future

- Просмотры объявлений (increment + analytics)
- Конверсия просмотры → заявки
- Seller analytics (trends)
- Export CSV
- Daily reports
- Revenue analytics
- Paid promotion analytics

---

## Файлы

| File | Change |
|---|---|
| `src/components/account/AccountMyActivityStats.tsx` | Seller activity cards |
| `src/components/account/AccountRequestsStatusSummary.tsx` | Request status chips |
| `src/features/leads/lib/lead-stats.ts` | Count/filter by status |
| `src/features/account/lib/account-requests-status.ts` | Status URL parsing |
| `src/features/admin/lib/admin-marketplace-events.ts` | Admin metrics + events |
| `src/app/account/page.tsx` | My activity block |
| `src/app/account/requests/page.tsx` | Status summary + filter |
| `src/app/admin/page.tsx` | Marketplace overview + events |
| `src/components/seller/SellerListingManageCard.tsx` | Listing metrics + leads button |
| `src/lib/i18n/dictionaries.ts` | analytics.* keys |

---

## Phase 146 — Import drafts (admin)

Admin-only import pipeline для наполнения каталога без auto-publish:

- `ImportedListingDraft` model + migration
- `/admin/import` manual import + review queue
- Publish → `PENDING_MODERATION` listing
- `rawContact` internal-only; no scraper/workers in this phase

См. `docs/IMPORT_DRAFTS_SYSTEM_PHASE_146.md`.

---

## Migration

Phase 146: да — `ImportedListingDraft` (`20260826120000_import_listing_drafts`).
