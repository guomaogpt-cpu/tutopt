# Tutopt — Схема базы данных

## 1. Обзор

- **СУБД:** PostgreSQL 16
- **ORM:** Prisma
- **Кодировка:** UTF-8
- **Часовой пояс:** UTC в БД, отображение — `Asia/Bishkek` (UTC+6)

Расширения PostgreSQL:

- `pg_trgm` — нечёткий поиск по названиям
- `unaccent` — нормализация текста (опционально)
- `uuid-ossp` или встроенный `gen_random_uuid()` — первичные ключи

---

## 2. ER-диаграмма (логическая)

```
users ──────────────┬──────────── seller_profiles
  │                 │
  │                 ├──────────── listings ──── listing_images
  │                 │                │
  │                 │                ├── listing_attributes
  │                 │                └── category (FK)
  │                 │
  ├── favorites ─────┘
  ├── leads
  ├── reports
  └── sessions

categories (self-ref parent_id)
regions
audit_logs
banners
seo_pages
```

---

## 3. Таблицы

### 3.1 `users`

Пользователи платформы.

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| email | VARCHAR(255) UNIQUE NULL | |
| phone | VARCHAR(20) UNIQUE NULL | Формат E.164 |
| password_hash | VARCHAR(255) | |
| role | ENUM | GUEST не хранится; BUYER, SELLER, MODERATOR, ADMIN |
| name | VARCHAR(100) | |
| avatar_url | TEXT NULL | |
| city | VARCHAR(100) NULL | |
| region_id | UUID FK → regions NULL | |
| email_verified_at | TIMESTAMPTZ NULL | |
| phone_verified_at | TIMESTAMPTZ NULL | |
| is_blocked | BOOLEAN DEFAULT false | |
| last_login_at | TIMESTAMPTZ NULL | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**Индексы:** `email`, `phone`, `role`, `created_at`

**Ограничение:** хотя бы одно из `email`, `phone` NOT NULL

---

### 3.2 `seller_profiles`

Профиль компании продавца (1:1 с user где role=SELLER).

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| user_id | UUID FK → users UNIQUE | |
| company_name | VARCHAR(200) | |
| slug | VARCHAR(220) UNIQUE | URL-friendly |
| description | TEXT NULL | |
| logo_url | TEXT NULL | |
| inn | VARCHAR(20) NULL | ИНН |
| legal_address | TEXT NULL | |
| contact_phone | VARCHAR(20) | Публичный телефон |
| contact_email | VARCHAR(255) NULL | |
| region_id | UUID FK → regions | |
| is_verified | BOOLEAN DEFAULT false | |
| is_pro | BOOLEAN DEFAULT false | Фаза 2 |
| verified_at | TIMESTAMPTZ NULL | |
| rating_avg | DECIMAL(3,2) DEFAULT 0 | Фаза 2 |
| rating_count | INT DEFAULT 0 | Фаза 2 |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**Индексы:** `slug`, `region_id`, `is_verified`

---

### 3.3 `seller_documents`

Документы для верификации (видны модератору).

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| seller_profile_id | UUID FK | |
| file_url | TEXT | S3 / local storage |
| doc_type | ENUM | REGISTRATION, LICENSE, OTHER |
| status | ENUM | PENDING, APPROVED, REJECTED |
| reviewed_by | UUID FK → users NULL | |
| review_note | TEXT NULL | |
| created_at | TIMESTAMPTZ | |

---

### 3.4 `categories`

Иерархия категорий (до 3 уровней).

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| parent_id | UUID FK → categories NULL | NULL = корень |
| name | VARCHAR(150) | |
| slug | VARCHAR(170) UNIQUE | |
| description | TEXT NULL | SEO |
| icon | VARCHAR(50) NULL | Имя иконки |
| sort_order | INT DEFAULT 0 | |
| is_active | BOOLEAN DEFAULT true | |
| listings_count | INT DEFAULT 0 | Денормализация |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**Индексы:** `parent_id`, `slug`, `sort_order`

---

### 3.5 `regions`

Регионы Кыргызстана.

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| name | VARCHAR(100) | Бишкек, Ош, ... |
| slug | VARCHAR(120) UNIQUE | |
| sort_order | INT DEFAULT 0 | |

**Seed:** 7 областей + города республиканского значения

---

### 3.6 `listings`

Объявления (ядро каталога).

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| seller_profile_id | UUID FK | |
| category_id | UUID FK | |
| region_id | UUID FK | |
| title | VARCHAR(200) | |
| slug | VARCHAR(250) | Уникален в паре с short_id |
| short_id | VARCHAR(8) | Для коротких URL |
| description | TEXT | |
| price | DECIMAL(12,2) | Цена за единицу |
| currency | VARCHAR(3) DEFAULT 'KGS' | |
| price_negotiable | BOOLEAN DEFAULT false | |
| unit | ENUM | PIECE, PACK, BOX, KG, LITER, PALLET |
| moq | INT DEFAULT 1 | Мин. количество заказа |
| stock_quantity | INT NULL | NULL = не указано |
| status | ENUM | DRAFT, PENDING, PUBLISHED, REJECTED, ARCHIVED |
| rejection_reason | TEXT NULL | |
| view_count | INT DEFAULT 0 | |
| contact_count | INT DEFAULT 0 | Клики «позвонить/написать» |
| published_at | TIMESTAMPTZ NULL | |
| expires_at | TIMESTAMPTZ NULL | Автоархивация 90 дней |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**Индексы:**

- `status, published_at DESC` — лента каталога
- `category_id, status`
- `seller_profile_id`
- `region_id, status`
- GIN `to_tsvector('russian', title || ' ' || description)` — полнотекст
- `price` — фильтр по цене

---

### 3.7 `listing_images`

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| listing_id | UUID FK | |
| url | TEXT | |
| thumbnail_url | TEXT NULL | |
| sort_order | INT DEFAULT 0 | |
| created_at | TIMESTAMPTZ | |

**Ограничение:** max 10 изображений на listing (application level)

---

### 3.8 `listing_attributes`

Произвольные характеристики (EAV-lite).

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| listing_id | UUID FK | |
| key | VARCHAR(100) | Бренд, Срок годности, ... |
| value | VARCHAR(500) | |

**Индекс:** `listing_id`

---

### 3.9 `favorites`

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| user_id | UUID FK | |
| listing_id | UUID FK | |
| created_at | TIMESTAMPTZ | |

**UNIQUE:** `(user_id, listing_id)`

---

### 3.10 `leads`

Заявки покупателей продавцам.

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| listing_id | UUID FK | |
| buyer_id | UUID FK → users | |
| seller_profile_id | UUID FK | |
| quantity | INT | |
| message | TEXT NULL | |
| status | ENUM | NEW, VIEWED, CLOSED |
| created_at | TIMESTAMPTZ | |
| viewed_at | TIMESTAMPTZ NULL | |

**Индексы:** `seller_profile_id, status`, `buyer_id`

---

### 3.11 `reports`

Жалобы на объявления.

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| listing_id | UUID FK | |
| reporter_id | UUID FK → users NULL | NULL = аноним запрещён |
| reason | ENUM | SPAM, FRAUD, WRONG_CATEGORY, OTHER |
| comment | TEXT NULL | |
| status | ENUM | OPEN, RESOLVED, DISMISSED |
| resolved_by | UUID FK NULL | |
| created_at | TIMESTAMPTZ | |

---

### 3.12 `listing_views`

Агрегированная аналитика просмотров (опционально; альтернатива — increment `view_count`).

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| listing_id | UUID FK | |
| viewed_at | DATE | |
| count | INT DEFAULT 1 | |

**UNIQUE:** `(listing_id, viewed_at)`

---

### 3.13 `sessions`

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| user_id | UUID FK | |
| token_hash | VARCHAR(255) | |
| expires_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

---

### 3.14 `password_reset_tokens`

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| user_id | UUID FK | |
| token_hash | VARCHAR(255) | |
| expires_at | TIMESTAMPTZ | |
| used_at | TIMESTAMPTZ NULL | |

---

### 3.15 `audit_logs`

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| actor_id | UUID FK → users | |
| action | VARCHAR(100) | listing.approve, user.block, ... |
| entity_type | VARCHAR(50) | listing, user, category |
| entity_id | UUID | |
| metadata | JSONB NULL | |
| created_at | TIMESTAMPTZ | |

**Индекс:** `created_at DESC`, `entity_type, entity_id`

---

### 3.16 `banners`

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| title | VARCHAR(200) | |
| image_url | TEXT | |
| link_url | TEXT | |
| placement | ENUM | HOME_HERO, HOME_MIDDLE, CATEGORY_TOP |
| sort_order | INT | |
| is_active | BOOLEAN | |
| starts_at | TIMESTAMPTZ NULL | |
| ends_at | TIMESTAMPTZ NULL | |

---

### 3.17 `seo_pages`

Кастомные SEO-лендинги.

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID PK | |
| slug | VARCHAR(200) UNIQUE | |
| title | VARCHAR(200) | H1 |
| meta_title | VARCHAR(70) | |
| meta_description | VARCHAR(160) | |
| content | TEXT | HTML/Markdown |
| is_published | BOOLEAN | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

## 4. ENUM-типы

| Enum | Значения |
|------|----------|
| UserRole | BUYER, SELLER, MODERATOR, ADMIN |
| ListingStatus | DRAFT, PENDING, PENDING_MODERATION, PUBLISHED, REJECTED, ARCHIVED |
| ListingUnit | PIECE, PACK, BOX, KG, LITER, PALLET |
| LeadStatus | NEW, VIEWED, CLOSED |
| ReportReason | SPAM, FRAUD, WRONG_CATEGORY, OTHER |
| ReportStatus | OPEN, RESOLVED, DISMISSED |
| DocumentType | REGISTRATION, LICENSE, OTHER |
| DocumentStatus | PENDING, APPROVED, REJECTED |
| BannerPlacement | HOME_HERO, HOME_MIDDLE, CATEGORY_TOP |

---

## 5. Миграции и seed

### 5.1 Порядок миграций

1. regions (seed)
2. categories (seed ~50 категорий)
3. users + admin
4. остальные таблицы

### 5.2 Seed-данные

- 1 admin: `admin@tutopt.kg`
- 7 регионов КР
- Дерево категорий (продукты, одежда, стройматериалы, электроника, авто, бытовая химия, ...)
- 3 тестовых продавца, 20 тестовых объявлений (dev/staging only)

---

## 6. Денормализация и кэш

| Поле | Обновление |
|------|------------|
| `categories.listings_count` | Триггер / job при publish/archive |
| `listings.view_count` | Increment при просмотре (debounce 1/сессия) |
| Поисковый индекс | Materialized view `listing_search` (фаза 2) при >50k записей |

---

## 7. Бэкапы

- Ежедневный pg_dump в object storage
- Retention: 30 дней
- Point-in-time recovery (PITR) на production

---

## 8. Связанные документы

- [05_API.md](./05_API.md) — API поверх моделей
- [07_SEARCH_FILTERS.md](./07_SEARCH_FILTERS.md) — индексы поиска
- [09_DEPLOYMENT.md](./09_DEPLOYMENT.md) — PostgreSQL в Docker
