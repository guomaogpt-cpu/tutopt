# Listing Moderation Notifications — Phase 118

> **Цель:** закрыть gap после Phase 116/117 — in-app (и push где уместно) уведомления по жизненному циклу модерации объявлений.

---

## 1. Цель

Пользователь видит статусы модерации не только в «Мои объявления», но и в `/notifications`:

- объявление отправлено на модерацию
- объявление одобрено / опубликовано
- объявление отклонено

Быстрый переход: `/account/listings` или `/listings/[id]`.

---

## 2. Почему это было gap после Phase 117

Phase 117 добавила push foundation и частично `LISTING_APPROVED` / `LISTING_REJECTED` при действии админа, но:

- не было `LISTING_SUBMITTED` при создании/повторной отправке
- фильтр «Объявления» не показывал полноценный контент
- тексты approve/reject не соответствовали продуктовому copy

Phase 118 закрывает полный цикл без большого refactor.

---

## 3. Notification types

| Type | Push | Когда |
|---|---|---|
| `LISTING_SUBMITTED` | нет (anti-spam) | статус → `PENDING_MODERATION` |
| `LISTING_APPROVED` | да | админ approve |
| `LISTING_REJECTED` | да | админ reject |

Migration: `20260808140000_listing_submitted_notification` (`LISTING_SUBMITTED`).

`LISTING_APPROVED` / `LISTING_REJECTED` — из Phase 117 migration.

---

## 4. Когда создаются уведомления

### LISTING_SUBMITTED (in-app only)

- `POST /api/listings` — новое объявление
- `PATCH /api/listings/[id]` — редактирование published/rejected → повторная модерация
- `POST /api/listings/[id]/lifecycle` — restore из архива
- `POST /api/listings/[id]/renew` — просроченное published → повторная модерация

Guard: `previousStatus !== PENDING_MODERATION && nextStatus === PENDING_MODERATION`

**Не создаётся:**

- draft autosave (нет server draft create)
- правки объявления уже на модерации без смены статуса
- мгновенная публикация без модерации (в продукте не используется)

---

## 5. Approve flow

`PATCH /api/admin/listings/[id]/moderation` (`action: approve`):

- Только если `status === PENDING_MODERATION` (duplicate guard)
- In-app: «Объявление опубликовано»
- Link: `/listings/[id]`
- Push через `dispatchUserPush` (Phase 117 helper)
- Ошибка notification/push **не блокирует** moderation (try/catch)

---

## 6. Reject flow

`action: reject`:

- In-app: «Объявление отклонено»
- Link: `/account/listings`
- Push: да
- `rejection_reason` — опционально в helper, если появится user-facing reason в API

---

## 7. Push integration

- Reuse `dispatchUserPush` / `sendPushToUser` from Phase 117
- Payload: `title`, `body`, `url`, `notificationId`, `type`
- `LISTING_SUBMITTED` — **без push** (достаточно in-app)
- Firebase не настроен → push silently skipped

---

## 8. Duplicate prevention

| Сценарий | Guard |
|---|---|
| Повторный approve/reject | API требует `PENDING_MODERATION` |
| Повторный submitted | `notifyListingSubmittedIfNeeded` — только при смене статуса |
| Edit on pending | `requiresModeration` false для `PENDING_MODERATION` |

---

## 9. Security notes

- Recipient = owner (`sellerProfile.user_id`) only; userId из session на API
- Links — relative paths only (`/account/listings`, `/listings/[id]`)
- Internal admin notes не попадают в notification (reject reason UI/API пока нет)
- No `any`, no secrets in push payload

---

## 10. Known limitations

- Reject reason не сохраняется в moderation API — текст фиксированный
- Admin не получает notification о новых объявлениях (out of scope)
- iOS push не включён

---

## 11. Future

- Reason templates при reject
- Admin notification audit
- User appeal flow

---

## 12. Phase 119 — Listing leads/contact flow (related)

Phase 119 улучшает **заявки по объявлениям** (`NEW_LEAD`) — отдельно от moderation notifications Phase 118.

- In-app only для новых заявок; push для leads **не включён**
- Moderation push (`LISTING_APPROVED` / `LISTING_REJECTED`) без изменений

См. `docs/LISTING_LEADS_CONTACT_FLOW_PHASE_119.md`

---

## Связанные документы

- `docs/APP_NOTIFICATIONS_ACTIVITY_PHASE_116.md`
- `docs/ANDROID_PUSH_NOTIFICATIONS_PHASE_117.md`
- `src/features/notifications/lib/notifications-data.ts`
