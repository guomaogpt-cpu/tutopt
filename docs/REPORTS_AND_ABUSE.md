# Reports and Abuse (MVP)

Базовая система жалоб на объявления и продавцов. Без auto-ban, auto-delete и auto-hide.

## Модель

Таблица `reports` уже была в схеме. В Phase 18 расширена:

| Поле | Описание |
|------|----------|
| `id` | UUID |
| `listing_id` | optional — жалоба на объявление |
| `seller_profile_id` | optional — жалоба на продавца |
| `reporter_id` | залогиненный пользователь |
| `reason` | enum `ReportReason` |
| `comment` | optional, max 1000 |
| `status` | `OPEN` / `RESOLVED` / `DISMISSED` |
| `resolved_by` | staff user |
| `reviewed_at` | когда обработана |
| `created_at` / `updated_at` | timestamps |

Migration: `prisma/migrations/20260716100000_extend_reports_for_sellers`

Нужен минимум один target: `listing_id` или `seller_profile_id` (проверка в API).

## Причины

| Code | Label |
|------|-------|
| SPAM | Спам |
| FRAUD | Мошенничество |
| WRONG_CATEGORY | Неверная категория |
| PROHIBITED_ITEM | Запрещённый товар или услуга |
| DUPLICATE | Дубль объявления |
| CONTACTS_IN_WRONG_PLACE | Контакты в запрещённом месте |
| OFFENSIVE_CONTENT | Оскорбительный контент |
| OTHER | Другое |

## Кто может жаловаться

Только **залогиненные** пользователи.  
Guest → modal с кнопкой «Войти» (`/login?next=...`).

Нельзя жаловаться на своё объявление / свой профиль.

## API

- `POST /api/reports` — создать жалобу  
- `PATCH /api/admin/reports/[id]` — `resolve` / `dismiss`

Rate limit: **10 жалоб / час / userId** (in-memory).

## UI

- `/listings/[id]` — «Пожаловаться» в карточке продавца  
- `/seller/[id]` — «Пожаловаться на продавца»  
- `/admin/reports` — очередь жалоб (ADMIN + MODERATOR)  
- `/admin` + AdminNav — ссылка «Жалобы» + count новых

## Почему нет auto-ban

MVP — ручная проверка модератором. Автоблокировки рискуют ложными срабатываниями и усложняют support.

## Analytics

Событие `report_submit`:

- `target_type`: listing | seller  
- `reason`  
- `vertical` (если listing)

**Не** отправляется: message/comment, user id, PII.

## Что не сделано в MVP

- badge «Есть жалобы» на moderation listings (чтобы не утяжелять запросы)  
- admin notifications при новой жалобе  
- auto-hide / auto-ban  
- appeal flow  

## Что позже

- блокировка пользователей из жалобы  
- audit log  
- abuse score  
- авто-скрытие после N жалоб  
- email/admin alert  
- appeal flow  
- Redis rate limit  
