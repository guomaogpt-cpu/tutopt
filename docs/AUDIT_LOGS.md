# Audit Logs (MVP)

Журнал действий администраторов и модераторов. Просмотр: `/admin/audit` (только ADMIN).

## Какие действия логируются

| Action | Кто | Когда |
|--------|-----|-------|
| `listing.approve` | ADMIN, MODERATOR | одобрение объявления |
| `listing.reject` | ADMIN, MODERATOR | отклонение объявления |
| `report.review` | ADMIN, MODERATOR | жалоба рассмотрена (resolve) |
| `report.dismiss` | ADMIN, MODERATOR | жалоба отклонена |
| `user.block` | ADMIN | блокировка пользователя |
| `user.unblock` | ADMIN | разблокировка |
| `user.restrict_listings` | ADMIN | запрет создания объявлений |
| `user.unrestrict_listings` | ADMIN | снятие запрета |
| `user.restrict_leads` | ADMIN | запрет отправки заявок |
| `user.unrestrict_leads` | ADMIN | снятие запрета |
| `user.role_change` | ADMIN | назначение / снятие модератора |

Legacy: до Phase 20 role change писался как `USER_ROLE_CHANGED` — старые записи отображаются с тем же label.

## Какие поля хранятся

Модель `AuditLog` (`audit_logs`) существовала с init migration — новая migration не понадобилась:

- `id`
- `actor_id` → relation на User
- `action` — строка вида `listing.approve`
- `entity_type` — `listing` / `user` / `report`
- `entity_id`
- `metadata` JSONB — плоский объект `Record<string, string | number | boolean | null>`
- `created_at`

В metadata дополнительно пишется `actor_role` (роль на момент действия), а также контекст:
`vertical`, `status_before`, `status_after`, `reason` (block), `report_reason`,
`listing_id` / `seller_profile_id` (для жалоб), `old_role` / `new_role`.

## Что запрещено хранить

- пароли, password hashes
- OTP-коды и токены (session/reset/verification)
- секреты окружения (DATABASE_URL, Google OAuth secrets)
- email/phone пользователей
- текст заявок (lead message) и другой пользовательский контент

Reason при блокировке хранится — его вводит админ осознанно.

## Кто имеет доступ

- `/admin/audit` — только ADMIN (MODERATOR редиректится на `/admin`)
- запись ведётся из admin API routes; публичных путей записи нет

## Почему audit failure не ломает основное действие

`createAuditLog` (`src/lib/audit/audit-log.ts`) ловит все ошибки внутри и пишет их в
`logger.error`. Если запись журнала не удалась (БД недоступна, невалидные данные),
approve/reject/block всё равно завершаются успешно: журнал — вспомогательный механизм,
а не источник истины для бизнес-логики.

## Что позже

- фильтры по дате (date range)
- export CSV
- retention policy (авто-очистка старых записей)
- IP и user-agent актора
- immutable logs (запрет UPDATE/DELETE на уровне БД)
- audit для auth-событий (login, password reset)
- пагинация дальше первых 100 записей
