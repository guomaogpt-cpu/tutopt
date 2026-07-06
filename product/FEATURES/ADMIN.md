# Feature: Admin

**Статус:** MVP ✅  
**Роли:** MODERATOR, ADMIN

---

## Обзор

Панель управления для модерации объявлений и (для ADMIN) управления ролями пользователей.

---

## Реализовано

### Layout `/admin/*`

- Auth required → `/login?next=/admin/moderation/listings`
- Staff only (`ADMIN` | `MODERATOR`) → иначе redirect `/`
- `AdminNav` — табы по ролям
- Общий header: «Панель управления»

### Модерация объявлений `/admin/moderation/listings`

**Доступ:** MODERATOR + ADMIN

- Список объявлений со статусом `PENDING_MODERATION`
- Сортировка: `created_at asc` (старые первые)
- Карточка: фото, title, category, city, seller, date
- Actions: Approve / Reject
- API: `PATCH /api/admin/listings/[id]/moderation` body `{ action: "approve" | "reject" }`
- Guard: `requireStaff()`
- Empty state: «Нет объявлений на модерации»
- Error banner при ошибке API

**Результат модерации:**
- Approve → `PUBLISHED`, `published_at = now()`
- Reject → `REJECTED`

### Управление пользователями `/admin/users`

**Доступ:** только ADMIN

- Таблица всех users: email, phone, name, role, blocked, created_at
- Actions: назначить MODERATOR / снять MODERATOR
- API: `PATCH /api/admin/users/[id]/role` body `{ role: "BUYER" | "MODERATOR" }`
- Guard: `requireAdmin()`
- Ограничения:
  - Нельзя менять ADMIN
  - Нельзя менять SELLER role
  - MODERATOR → BUYER (с учётом seller profile)
- Audit log: `logUserRoleChanged()` → `AuditLog`

### Redirects

- `/admin/moderation` → `/admin/moderation/listings`
- Non-ADMIN на `/admin/users` → `/admin/moderation`

---

## Роли и доступ

| Действие | MODERATOR | ADMIN |
|----------|-----------|-------|
| Модерация объявлений | ✅ | ✅ |
| Просмотр non-published listings | ✅ | ✅ |
| Управление пользователями | ❌ | ✅ |
| Назначение MODERATOR | ❌ | ✅ |

---

## Header menu

- MODERATOR: «Модерация объявлений»
- ADMIN: «Админка», «Пользователи», «Модерация объявлений»
- CTA «Подать объявление» скрыт для MODERATOR/ADMIN в header

---

## Schema (admin-related)

- `AuditLog` — action, actor_id, target, metadata (role changes)
- `User.is_blocked` — поле есть, UI блокировки нет
- `Report` — schema есть, UI нет

---

## Не реализовано

- Блокировка пользователей (UI)
- Просмотр audit log (UI)
- Модерация отчётов (Report)
- Dashboard со статистикой
- Модерация seller documents
- Bulk moderation
- Причина отклонения объявления (comment)
- Email уведомление seller при approve/reject
- Admin activity log viewer

---

## Создание ADMIN

```bash
npm run admin:create
```

Script: `scripts/create-admin.ts`

---

## Roadmap

1. Reject reason + notification to seller
2. User blocking UI
3. Reports moderation
4. Admin dashboard stats
5. Seller verification workflow
