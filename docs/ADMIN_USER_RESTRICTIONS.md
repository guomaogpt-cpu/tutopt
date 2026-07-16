# Admin User Restrictions (MVP)

Управление блокировками и ограничениями пользователей. Без удаления аккаунтов и без auto-hide объявлений.

## Поля User

Уже было:
- `is_blocked` — login/session отказывают заблокированным

Добавлено в Phase 19 (`20260716110000_add_user_restrictions`):

| Поле | Назначение |
|------|------------|
| `blocked_at` | когда заблокирован |
| `blocked_reason` | причина (optional) |
| `blocked_by_id` | кто заблокировал (ADMIN) |
| `listing_restricted_at` | запрет создания объявлений |
| `lead_restricted_at` | запрет отправки заявок |

При block: `is_blocked=true` + `blocked_at=now()`.  
При unblock: оба сбрасываются вместе с reason / blocked_by.

## Helper

`src/lib/security/user-restrictions.ts`

- `isUserBlocked(user)`
- `canUserCreateListings(user)`
- `canUserSendLeads(user)`
- `getUserRestrictionLabels(user)`
- `getCreateListingRestrictionMessage(user)`
- `getLeadRestrictionMessage(user)`

## Кто может блокировать

Только **ADMIN** (`requireAdmin`).

Guards:
- нельзя ограничить себя
- нельзя ограничить другого ADMIN
- SELLER / BUYER / guest / MODERATOR не могут вызвать API

MODERATOR видит статусы только если попадёт на страницу — `/admin/users` доступен только ADMIN.

## Что запрещает block

- login (через `is_blocked`, уже было)
- session (`getCurrentUser` возвращает null)
- create listing
- send lead
- seller onboarding / upgrade

Публично объявления **не** скрываются автоматически.

## Listing restriction

`listing_restricted_at` → нельзя `POST /api/listings`  
Сообщение: «Создание объявлений временно ограничено.»

## Lead restriction

`lead_restricted_at` → нельзя `POST /api/listings/[id]/leads`  
Сообщение: «Отправка заявок временно ограничена.»

## Admin UI

`/admin/users`:
- badges статуса
- действия: block / unblock / restrict listings / unrestrict / restrict leads / unrestrict
- confirmation modal + optional reason для block

API: `PATCH /api/admin/users/[id]/restrictions`

`/admin/reports`:
- ссылка «Открыть пользователя» → `/admin/users#user-{id}`

## Почему объявления не скрываются

MVP ограничивает **действия** пользователя. Массовое снятие объявлений с каталога — отдельная политика (риск false positive, support, SEO).

## Что позже

- audit log / ban history
- temporary bans с expiry
- auto-hide listings при block
- appeal process
- admin notifications
- Redis-backed restriction cache
