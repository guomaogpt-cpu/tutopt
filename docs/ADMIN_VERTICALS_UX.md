# Admin & moderation UX by vertical

Phase 10: админка и модерация понимают направления **без изменения Prisma schema**.

## Routes

| Route | Доступ |
|-------|--------|
| `/admin` | ADMIN + MODERATOR (MODERATOR без блока пользователей) |
| `/admin/moderation/listings` | ADMIN + MODERATOR |
| `/admin/users` | ADMIN only |

Guards: `src/app/admin/layout.tsx` (`isStaffRole`) + page-level ADMIN check на users.

## Dashboard `/admin`

- очередь модерации + пользователи (ADMIN)
- cards по ТутОпт / ТутМаркет / ТутУслуги / ТутКарго с counts (всего + на модерации)
- ссылки на `/admin/moderation/listings?vertical=…`

## Модерация

Фильтры (server-side):

- `/admin/moderation/listings`
- `?vertical=OPT|MARKET|SERVICES|CARGO`

На карточке:

- `VerticalListingBadge`
- категория, город, продавец, статус, дата
- подсказка модерации по vertical (`getModerationHint`)

Empty states: `getModerationEmptyMessage`.

Approve/reject API не менялся.

## Users

Через `groupBy` по listings:

- `listingCount`
- badges активных vertical

## Helper

`src/features/admin/lib/moderation-vertical.ts`

## Не сделано (Phase 11+)

- reject reason presets / UI (поле `rejection_reason` в schema есть, UI нет)
- отдельные admin pages для categories / SEO / banners
