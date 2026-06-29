# Tutopt — Поиск и фильтры

## 1. Обзор

Поиск — ключевая функция маркетплейса. Пользователь должен быстро находить оптовые предложения по названию, категории, региону и ценовому диапазону.

**Цели:**

- Релевантная выдача за < 300 ms
- Удобные фильтры на desktop и mobile
- SEO-friendly URL (часть фильтров в path, остальное в query)

---

## 2. Типы поиска

### 2.1 Полнотекстовый поиск

**Поля индексации:**

- `listings.title` (вес ×3)
- `listings.description` (вес ×1)
- `seller_profiles.company_name` (вес ×2)
- `listing_attributes.value` (вес ×1)

**Технология MVP:**

- PostgreSQL `tsvector` + `tsquery` (конфигурация `russian`)
- Fallback: `ILIKE` + `pg_trgm` для опечаток

**Технология фаза 2:**

- Meilisearch или Elasticsearch при > 100k объявлений

### 2.2 Autocomplete (suggest)

**Endpoint:** `GET /api/v1/search/suggest?q=...`

**Источники подсказок:**

1. Популярные запросы (топ-100 за неделю)
2. Названия категорий (prefix match)
3. Названия объявлений (prefix + trigram)
4. Названия продавцов

**Лимит:** 10 подсказок, debounce 300 ms на клиенте

**UI:** dropdown под поисковой строкой; Enter → `/search?q=...`

---

## 3. Фильтры каталога

### 3.1 Список фильтров

| Фильтр | Query param | Тип | Описание |
|--------|-------------|-----|----------|
| Текст | `q` | string | Поисковый запрос |
| Категория | `category` | slug | Одна категория |
| Подкатегории | `include_children` | bool | default true |
| Регион | `region` | slug | |
| Цена от | `price_min` | number | KGS |
| Цена до | `price_max` | number | KGS |
| MOQ до | `moq_max` | int | Макс. мин. заказ |
| Только в наличии | `in_stock` | bool | stock_quantity > 0 |
| Договорная цена | `negotiable` | bool | |
| Проверенный продавец | `verified` | bool | |
| Единица | `unit` | enum | PIECE, KG, ... |
| Дата | `published_after` | date | За последние N дней |
| Продавец | `seller` | slug | |

### 3.2 Сортировка

| Query `sort` | Описание |
|--------------|----------|
| `relevance` | По умолчанию при наличии `q` |
| `newest` | `published_at DESC` (default без q) |
| `price_asc` | Цена по возрастанию |
| `price_desc` | Цена по убыванию |
| `popular` | `view_count DESC` |

### 3.3 Пагинация

- `page` (default 1)
- `per_page` (default 20, max 100)

---

## 4. URL-стратегия

### 4.1 Страница категории

```
/category/produkty-pitaniya?region=bishkek&price_max=50000&sort=price_asc
```

Категория в path — для SEO. Фильтры в query.

### 4.2 Поиск

```
/search?q=молоко+оптом&region=chuy&verified=true
```

### 4.3 Canonical

При комбинации фильтров canonical → базовая категория без лишних params (см. [08_SEO.md](./08_SEO.md))

---

## 5. UI фильтров

### 5.1 Desktop (≥ md)

- Sidebar слева, sticky
- Секции: Категория (tree), Регион, Цена (range slider), MOQ, Чекбоксы
- Кнопка «Сбросить фильтры»
- Счётчик результатов: «Найдено 234 объявления»

### 5.2 Mobile

- Кнопка «Фильтры» → bottom sheet / full-screen drawer
- Chips активных фильтров под поисковой строкой
- Сортировка — dropdown в toolbar

### 5.3 Состояние

- Фильтры синхронизируются с URL (shareable links)
- При изменении фильтра — scroll to top, skeleton loading

---

## 6. Карточка в выдаче

| Элемент | Источник |
|---------|----------|
| Фото | listing_images[0].thumbnail_url |
| Название | title (highlight match) |
| Цена | price + unit + MOQ |
| Регион | region.name |
| Продавец | company_name + verified badge |
| Дата | относительная (2 дня назад) |
| Избранное | heart icon |

---

## 7. Ранжирование (relevance)

**Формула MVP (упрощённая):**

```
score = ts_rank(search_vector, query) * 100
      + (is_verified_seller ? 20 : 0)
      + (has_stock ? 10 : 0)
      + min(view_count / 100, 10)
      + freshness_boost(published_at)  // до 15 баллов за 7 дней
```

**Freshness boost:**

- < 24ч: +15
- < 7д: +10
- < 30д: +5
- иначе: 0

**Фаза 2:** ML-ранжирование по CTR, конверсии в lead

---

## 8. Пустая выдача

**Сообщение:** «По вашему запросу ничего не найдено»

**Рекомендации:**

- Сбросить фильтры
- Популярные категории
- Похожие запросы (did you mean — trigram)

---

## 9. Индексация и производительность

### 9.1 Индексы БД

- GIN на `to_tsvector('russian', title || ' ' || description)`
- B-tree: `(status, published_at DESC)`, `(category_id, status)`, `(region_id, status, price)`
- Partial index: `WHERE status = 'PUBLISHED'`

### 9.2 Кэш

| Ключ | TTL |
|------|-----|
| `categories:tree` | 1 час |
| `regions:list` | 24 часа |
| `search:popular` | 1 час |
| Результаты `?q=без+фильтров` | 5 мин (фаза 2, Redis) |

### 9.3 EXPLAIN-цели

- Запрос каталога с 3 фильтрами: < 50 ms DB time
- Полнотекстовый поиск: < 100 ms DB time

---

## 10. Аналитика поиска

Логировать (таблица `search_logs`, фаза 2):

- `query`, `filters` (JSON), `results_count`, `user_id?`, `created_at`

**Отчёты для продукта:**

- Топ-50 запросов без результатов (zero-result queries)
- Популярные фильтры

---

## 11. Ограничения и валидация

| Правило | Значение |
|---------|----------|
| Мин. длина `q` | 2 символа |
| Макс. длина `q` | 200 символов |
| price_min ≤ price_max | иначе swap |
| price_max | ≤ 99 999 999 |

---

## 12. Связанные документы

- [03_PAGES.md](./03_PAGES.md) — страницы каталога и поиска
- [04_DATABASE.md](./04_DATABASE.md) — индексы
- [05_API.md](./05_API.md) — API listings, suggest
- [08_SEO.md](./08_SEO.md) — canonical и индексация
