# Trust, Safety & Listing Reports — Phase 125

Усиление trust & safety: жалобы на объявления, админ-обработка, запрещённый контент в Terms, подготовка к Google Play UGC requirements.

---

## 1. Цель

Пользователь может пожаловаться на объявление; админ видит жалобы и принимает решение без автоблокировок и AI moderation.

---

## 2. Report flow

| Step | Behaviour |
|---|---|
| 1 | На `/listings/[id]` — блок «Пожаловаться» (не главный CTA) |
| 2 | Modal: причина + необязательный комментарий |
| 3 | Auth required — иначе «Войдите, чтобы пожаловаться» |
| 4 | `POST /api/listings/[id]/report` или `POST /api/reports` |
| 5 | Success: «Жалоба отправлена» + «Мы проверим объявление…» |

Существующая модель **`Report`** использована — новая `ListingReport` не создавалась.

---

## 3. Report reasons (listing)

- Мошенничество (`FRAUD`)
- Запрещённый товар (`PROHIBITED_ITEM`)
- Неверная категория (`WRONG_CATEGORY`)
- Неверная цена (`WRONG_PRICE`) — **new enum**
- Оскорбительный или запрещённый контент (`OFFENSIVE_CONTENT`)
- Дубликат (`DUPLICATE`)
- Объявление неактуально (`OUTDATED`) — **new enum**
- Другое (`OTHER`)

---

## 4. Duplicate guard

- Один пользователь — одна **OPEN** жалоба на объявление
- Проверка в `createUserReport()` перед insert
- Своя жалоба на своё объявление запрещена

---

## 5. Admin review

**`/admin/reports`** (существующая страница):

- Дата, объект, причина, комментарий, отправитель, статус
- Действия: Открыть, **Скрыть объявление**, Отметить рассмотренной, Отклонить

**Скрыть объявление:** `POST /api/admin/listings/[id]/hide` → `REJECTED` + `LISTING_REJECTED` notification (Phase 118 flow).

**Dashboard:** «Новые жалобы: N» на `/admin` (уже было).

---

## 6. Listing moderation integration

- Hide использует `ListingStatus.REJECTED` — объявление скрыто от публичного просмотра
- `createListingModerationNotification({ approved: false })` — автор получает in-app уведомление
- Audit log: `listing.reject` with `source: report_review`
- Hard delete не используется

---

## 7. Android/WebView considerations

- Report modal: `max-h-[92dvh]`, safe-area padding на кнопках
- Back закрывает modal (Radix Dialog)
- Textarea + keyboard не перекрывает submit
- Sticky CTA на detail не конфликтует с report block

---

## 8. Security

| Check | Status |
|---|---|
| Auth required for report | ✅ |
| reporterId from session | ✅ |
| Own listing guard | ✅ |
| Admin reports staff-only | ✅ |
| Comment max 1000 chars | ✅ |
| Rate limit on create | ✅ |
| No raw stack traces | ✅ |

---

## 9. Google Play UGC notes

См. `docs/USER_GENERATED_CONTENT_SAFETY_PHASE_125.md`

---

## 10. Known limitations

- Нет auto-ban / AI moderation
- Нет public report counts
- Seller reports — отдельный flow (сохранён)
- Terms — draft, legal review pending
- Admin hide только для PUBLISHED / PENDING_MODERATION

---

## 11. Future

- User blocking
- Seller rating
- AI moderation assist
- Report user profile
- Spam detection
- Admin report queue pagination

---

## Файлы

| File | Change |
|---|---|
| `prisma/schema.prisma` | `WRONG_PRICE`, `OUTDATED` enum |
| `features/reports/lib/create-report.ts` | Shared create + duplicate guard |
| `api/listings/[id]/report/route.ts` | Dedicated listing report API |
| `api/admin/listings/[id]/hide/route.ts` | Staff hide from report |
| `components/reports/ReportDialog.tsx` | UX polish, listing reasons |
| `components/listings/ListingReportSection.tsx` | Detail page placement |
| `components/admin/AdminReportsTable.tsx` | Hide listing action |
| `app/terms/page.tsx` | Prohibited goods list |

---

## Migration

`20260811120000_report_reasons_wrong_price_outdated` — adds enum values.

---

## Связанные документы

- `docs/USER_GENERATED_CONTENT_SAFETY_PHASE_125.md`
- `docs/GOOGLE_PLAY_RELEASE_BLOCKERS_PHASE_113.md`
- `docs/LISTING_CARDS_DETAIL_PHASE_124.md`
