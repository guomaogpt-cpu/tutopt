# Feature: Notifications

**Статус:** MVP ✅  
**Роли:** все auth users

---

## Обзор

In-app уведомления без WebSocket. Хранение в PostgreSQL, доставка через polling каждые 30 секунд.

---

## Реализовано

### Триггеры

| Событие | Type | Recipient | Link |
|---------|------|-----------|------|
| Новая заявка | `NEW_LEAD` | Seller (listing owner) | `/seller/leads` |

### Создание

- При `POST /api/listings/[id]/leads` → `createNewLeadNotification()`
- Каждая заявка = отдельное уведомление
- Поля: `recipient_id`, `actor_id` (buyer), `title`, `message`, `link`

### API

```
GET   /api/notifications              — последние 20
GET   /api/notifications/unread-count — count where read_at IS NULL
PATCH /api/notifications/[id]/read    — mark one
PATCH /api/notifications/read-all     — mark all
```

- Все endpoints: `Cache-Control: no-store`, `force-dynamic`
- Auth required

### Header bell

- `HeaderNotificationsBell` — иконка + badge
- Polling unread-count каждые 30 сек
- Shared store (`notifications-unread-store`) для optimistic updates
- Stale poll protection через `mutationGeneration`

### Страница `/notifications`

- Список уведомлений (newest first)
- Unread: синее выделение + dot badge
- «Отметить все как прочитанные»
- Клик: mark read → navigate to `link`
- Empty state
- Auth → redirect `/login?next=/notifications`

---

## Notification model

```
id, recipient_id, actor_id?, type, title, message, link?, read_at?, created_at
```

- Index: `[recipient_id, read_at]`, `[recipient_id, created_at DESC]`
- Enum `NotificationType`: `NEW_LEAD` (extensible)

---

## UX поведение

- **Просмотр списка** не помечает как прочитанные (by design)
- **Клик** или **read all** → badge обновляется сразу (optimistic)
- Polling не перезаписывает свежие локальные изменения

---

## Не реализовано

- WebSocket / SSE / push notifications
- Email notifications
- SMS notifications
- Notification preferences / settings
- Типы: new message, listing approved, listing rejected, etc.
- Notification sound / browser push
- Mark as unread
- Delete notification
- Pagination (limit 20)

---

## Roadmap

1. Email при NEW_LEAD
2. Notification types: moderation result, new favorite
3. WebSocket для real-time badge
4. User preferences (opt-out)

---

## Связанные решения

- PD-006 (DB + polling)
