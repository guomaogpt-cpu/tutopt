# Security and Antispam (MVP)

Базовый слой защиты Tutopt от спама, злоупотреблений и низкокачественных объявлений. Реализован без изменений Prisma schema и без внешних сервисов (Redis и т.п.).

## Что реализовано

### Валидация объявлений (`POST /api/listings`)

Файлы:
- `src/features/listings/validators/listing.validators.ts`
- `src/lib/moderation/content-checks.ts`
- `src/app/api/listings/route.ts`

Правила:

| Поле | Правило |
|------|---------|
| Title | trim, min 5, max 120, не пустой |
| Description | trim, min 20, max 5000 |
| Price | finite number, ≥ 0 |
| MOQ | int, ≥ 0 |
| Vertical | OPT / MARKET / SERVICES / CARGO (default: OPT, как в текущем flow) |
| Category | обязательна; `category.vertical` должен совпадать с `listing.vertical` |
| Images | min 1, max 10 (без изменений upload flow) |

Контент-проверки (`validateListingContent`):
- телефон / ссылки / email в **заголовке** → ошибка валидации
- повторяющиеся символы, избыток CAPS (>70% при длине >20), ≥3 ссылок → ошибка
- контакты в описании пока **не блокируются** (только предупреждение модератору)

### Валидация заявок (`POST /api/listings/[id]/leads`)

Файлы:
- `src/features/leads/validators/lead.validators.ts`
- `src/app/api/listings/[id]/leads/route.ts`

Правила:

| Поле | Правило |
|------|---------|
| message | trim, min 5, max 2000, обязательно |
| quantity | int, min 1 |
| contact_phone / contact_email | опционально, как раньше |

Дополнительно:
- нельзя отправить заявку на своё объявление (уже было)
- только по `PUBLISHED` объявлениям (уже было)
- проверка подозрительного текста в message
- дубль заявки (тот же normalized message за 10 минут) → 409

### Rate limit (in-memory)

Файл: `src/lib/security/rate-limit.ts`

| Действие | Лимит | Окно |
|----------|-------|------|
| Создание объявления | 10 / userId | 1 час |
| Отправка заявки | 20 / userId | 1 час |
| Заявки на одно объявление | 5 / userId + listingId | 10 минут |

При превышении → HTTP 429 (`RATE_LIMITED`).

OTP rate limit **не изменялся** (`src/features/auth/lib/phone-otp.ts`).

### Проверка дублей объявлений

Файл: `src/features/listings/lib/listing-duplicate-check.ts`

Для того же продавца:
- normalized title
- та же category
- тот же vertical
- создано за последние 24 часа
- статус не `REJECTED` / `ARCHIVED`

→ ошибка: «Похоже, такое объявление уже было создано недавно.»

### Подсказки модератору

Файлы:
- `src/lib/moderation/content-checks.ts` — `getModerationContentWarnings()`
- `src/components/admin/ModerationListingsTable.tsx`
- `src/app/admin/moderation/listings/page.tsx`

На странице модерации показываются badge-предупреждения (не блокируют approve/reject):
- контакт в заголовке
- много CAPS в заголовке
- много ссылок в описании
- подозрительное описание
- возможный дубль (для `PENDING_MODERATION`)

### Уже было до Phase 15

- Zod validation на create listing / lead
- Auth: `requireAuth`, blocked users не проходят сессию
- Category.vertical check при создании объявления
- Own-listing lead protection
- Image limits: 10 фото, 5 MB, MIME whitelist
- Moderation flow: approve / reject (`PENDING_MODERATION` → `PUBLISHED` / `REJECTED`)
- Admin role management, staff gate
- OTP cooldown (отдельно от listing/lead limits)

## Ограничения текущего MVP

1. **In-memory rate limit** хранится в памяти процесса Node.js:
   - не работает между несколькими инстансами
   - сбрасывается при рестарте
   - не подходит для serverless без sticky sessions
2. Нет Redis / DB-backed rate limit
3. Нет полноценной антифрод-системы и ML-модерации
4. `rejection_reason` в БД есть, но UI/API для причины отклонения не реализованы
5. `User.is_blocked` есть, но нет admin API для block/unblock
6. Duplicate check — exact normalized title, без fuzzy search
7. Контакты в description разрешены (только warning модератору)

## Что нужно позже

- Redis / PostgreSQL rate limit
- User trust score
- Обязательная верификация телефона для продавцов
- Report abuse workflow (`Report` model уже в schema)
- Admin block/unblock user + audit log
- Moderation queue с risk score
- Запись `rejection_reason` при отклонении
- Per-IP rate limits на публичные endpoints
- Fuzzy duplicate detection

## Связанные файлы

```
src/lib/moderation/content-checks.ts
src/lib/security/rate-limit.ts
src/features/listings/validators/listing.validators.ts
src/features/listings/lib/listing-duplicate-check.ts
src/features/leads/validators/lead.validators.ts
src/features/leads/lib/lead-duplicate-check.ts
src/app/api/listings/route.ts
src/app/api/listings/[id]/leads/route.ts
```
