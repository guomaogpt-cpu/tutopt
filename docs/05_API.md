# Tutopt — API Specification

## 1. Обзор

- **Стиль:** REST over HTTP
- **Базовый путь:** `/api/v1`
- **Формат:** JSON (`Content-Type: application/json`)
- **Аутентификация:** Bearer JWT в `Authorization` header или session cookie
- **Версионирование:** префикс `/v1`; breaking changes → `/v2`

Реализация: Next.js Route Handlers (`app/api/v1/...`) + Server Actions для форм.

---

## 2. Общие соглашения

### 2.1 Ответы

**Успех:**

```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150
  }
}
```

**Ошибка:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Некорректные данные",
    "details": [{ "field": "price", "message": "Цена должна быть больше 0" }]
  }
}
```

### 2.2 HTTP-коды

| Код | Использование            |
| --- | ------------------------ |
| 200 | Успешный GET, PATCH      |
| 201 | Создание ресурса         |
| 204 | Удаление без тела        |
| 400 | Ошибка валидации         |
| 401 | Не авторизован           |
| 403 | Нет прав                 |
| 404 | Не найдено               |
| 409 | Конфликт (дубликат slug) |
| 429 | Rate limit               |
| 500 | Внутренняя ошибка        |

### 2.3 Пагинация

Query: `?page=1&per_page=20` (max `per_page=100`)

### 2.4 Rate limiting

| Группа                 | Лимит            |
| ---------------------- | ---------------- |
| Публичные GET          | 100 req/min/IP   |
| Auth (login, register) | 10 req/min/IP    |
| Создание объявлений    | 20 req/hour/user |
| Upload                 | 30 req/hour/user |

---

## 3. Аутентификация

### POST `/api/v1/auth/register`

Регистрация пользователя.

**Body:**

| Поле         | Тип                 | Обязательно     |
| ------------ | ------------------- | --------------- |
| email        | string              | email или phone |
| phone        | string              | email или phone |
| password     | string              | да              |
| name         | string              | да              |
| role         | `BUYER` \| `SELLER` | да              |
| company_name | string              | если SELLER     |

**Response 201:** `{ data: { user, token } }`

---

### POST `/api/v1/auth/login`

**Body:** `email` или `phone`, `password`, `remember_me?`

**Response 200:** `{ data: { user, token, expires_at } }`

---

### POST `/api/v1/auth/logout`

**Auth:** required

**Response 204**

---

### POST `/api/v1/auth/forgot-password`

**Body:** `email`

**Response 200:** всегда (не раскрывать существование email)

---

### POST `/api/v1/auth/reset-password`

**Body:** `token`, `password`

---

### GET `/api/v1/auth/me`

**Auth:** required

**Response:** текущий пользователь + seller_profile (если есть)

---

## 4. Каталог и поиск

### GET `/api/v1/listings`

Список объявлений с фильтрами.

**Query:** см. [07_SEARCH_FILTERS.md](./07_SEARCH_FILTERS.md)

**Response:** массив listing (краткая карточка) + meta

**Публичный:** только `status=PUBLISHED`

---

### GET `/api/v1/listings/[id]`

Детали объявления.

**Side effect:** increment `view_count` (1 раз за сессию)

---

### GET `/api/v1/listings/slug/[slug]`

Поиск по slug + short_id.

---

### GET `/api/v1/categories`

Дерево категорий (кэш 1 час).

**Query:** `?flat=true` — плоский список

---

### GET `/api/v1/categories/[slug]`

Категория + breadcrumbs + children

---

### GET `/api/v1/regions`

Список регионов.

---

### GET `/api/v1/search/suggest`

Autocomplete.

**Query:** `?q=цемент&limit=10`

**Response:** `{ data: { listings: [], categories: [], sellers: [] } }`

---

## 5. Объявления (продавец)

### POST `/api/v1/seller/listings`

**Auth:** SELLER

**Body:**

| Поле             | Тип                          |
| ---------------- | ---------------------------- |
| category_id      | uuid                         |
| region_id        | uuid                         |
| title            | string                       |
| description      | string                       |
| price            | number                       |
| unit             | enum                         |
| moq              | int                          |
| stock_quantity   | int?                         |
| price_negotiable | bool                         |
| attributes       | `{ key, value }[]`           |
| images           | string[] (urls после upload) |
| submit           | bool — true → статус PENDING |

---

### PATCH `/api/v1/seller/listings/[id]`

**Auth:** владелец или ADMIN

Частичное обновление. Смена ключевых полей → повторная модерация.

---

### DELETE `/api/v1/seller/listings/[id]`

**Auth:** владелец или ADMIN

Soft delete → ARCHIVED

---

### POST `/api/v1/seller/listings/[id]/publish`

Черновик → PENDING (на модерацию)

---

### POST `/api/v1/seller/listings/[id]/archive`

PUBLISHED → ARCHIVED

---

## 6. Загрузка файлов

### POST `/api/v1/upload/image`

**Auth:** required

**Body:** `multipart/form-data`, поле `file`

**Валидация:** jpg, png, webp; max 5 MB; max 10 файлов на объявление

**Response:** `{ data: { url, thumbnail_url } }`

---

## 7. Профиль продавца

### GET `/api/v1/sellers/[slug]`

Публичный профиль.

---

### PATCH `/api/v1/seller/company`

**Auth:** SELLER — свой профиль

---

### POST `/api/v1/seller/verification`

**Auth:** SELLER

**Body:** `documents: [{ doc_type, file_url }]`

---

## 8. Покупатель

### GET `/api/v1/account/favorites`

**Auth:** BUYER+

---

### POST `/api/v1/account/favorites`

**Body:** `{ listing_id }`

---

### DELETE `/api/v1/account/favorites/[listing_id]`

---

### GET `/api/v1/account/leads`

**Auth:** BUYER — исходящие заявки

---

### POST `/api/v1/leads`

**Auth:** BUYER+

**Body:**

| Поле       | Тип     |
| ---------- | ------- |
| listing_id | uuid    |
| quantity   | int     |
| message    | string? |

**Response 201**

---

### GET `/api/v1/seller/leads`

**Auth:** SELLER — входящие

**Query:** `?status=NEW`

---

### PATCH `/api/v1/seller/leads/[id]`

**Body:** `{ status: "VIEWED" | "CLOSED" }`

---

## 9. Жалобы

### POST `/api/v1/reports`

**Auth:** BUYER+

**Body:** `listing_id`, `reason`, `comment?`

---

## 10. Админ API

Префикс: `/api/v1/admin`

**Auth:** MODERATOR или ADMIN (отдельные permissions)

### Модерация

| Метод | Путь                                  | Описание        |
| ----- | ------------------------------------- | --------------- |
| GET   | `/moderation/listings?status=PENDING` | Очередь         |
| POST  | `/moderation/listings/[id]/approve`   | Одобрить        |
| POST  | `/moderation/listings/[id]/reject`    | `{ reason }`    |
| GET   | `/moderation/sellers?status=PENDING`  | Верификация     |
| POST  | `/moderation/sellers/[id]/approve`    |                 |
| POST  | `/moderation/sellers/[id]/reject`     |                 |
| GET   | `/moderation/reports`                 | Жалобы          |
| PATCH | `/moderation/reports/[id]`            | Resolve/dismiss |

### Управление

| Метод | Путь                  | Роль  |
| ----- | --------------------- | ----- |
| CRUD  | `/categories`         | ADMIN |
| CRUD  | `/users`              | ADMIN |
| CRUD  | `/banners`            | ADMIN |
| CRUD  | `/seo-pages`          | ADMIN |
| GET   | `/analytics/overview` | ADMIN |

---

## 11. Служебные

### GET `/api/health`

```json
{ "status": "ok", "db": "connected", "version": "1.0.0" }
```

---

## 12. Webhooks (фаза 3)

| Событие             | Описание                |
| ------------------- | ----------------------- |
| `lead.created`      | Новая заявка продавцу   |
| `listing.published` | Объявление опубликовано |

---

## 13. Безопасность API

- CORS: только домены tutopt.kg
- CSRF token для cookie-based сессий
- Input sanitization (XSS) для description
- IDOR: проверка ownership на seller endpoints
- Логирование 4xx/5xx в structured logs

---

## 14. Связанные документы

- [02_USER_ROLES.md](./02_USER_ROLES.md) — права на endpoints
- [04_DATABASE.md](./04_DATABASE.md) — модели данных
- [06_ADMIN_PANEL.md](./06_ADMIN_PANEL.md) — UI админки
