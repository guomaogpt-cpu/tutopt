# Feature: Search & Catalog

**Статус:** MVP ✅ (базовый)  
**Роли:** все (публичный)

---

## Обзор

Поиск и фильтрация оптовых объявлений. Реализован через URL query params на странице `/listings` — без отдельного search engine.

---

## Реализовано

### Точки входа

| Источник | Поведение |
|----------|-----------|
| Header search | `/listings?q=...` |
| Home hero search (`HomeSearchBar`) | `/listings?q=...` |
| Catalog toolbar search | debounce 400ms → URL update |
| Category grid (home, `/categories`) | `/listings?category=uuid` |
| Breadcrumbs на listing detail | `/listings?category=uuid` |

### Query parameters

| Param | Тип | Описание |
|-------|-----|----------|
| `q` | string | Поиск по title (ILIKE) |
| `category` | uuid | Фильтр по категории (+ descendants) |
| `city` | uuid | Город |
| `brand` | uuid | Бренд |
| `priceFrom` | number | Мин. цена |
| `priceTo` | number | Макс. цена |
| `withPhoto` | boolean | Только с фото |
| `sort` | enum | new, price_asc, price_desc, moq_asc |
| `page` | number | Пагинация |

### Фильтры UI

- **Desktop:** popover panel привязан к кнопке «Фильтры»
- **Mobile:** bottom sheet `max-h-[85vh]`, backdrop, scroll lock
- Active filter chips с удалением
- Count результатов в toolbar
- «Сбросить фильтры» в empty state

### Сортировка

- Select в toolbar
- Сохраняется в URL

### Пагинация

- `ListingsPagination` component
- N объявлений на страницу (константа `LISTINGS_PER_PAGE`)

### Category tree

- `getDescendantIds()` — фильтр включает подкатегории
- Root categories на главной и `/categories`

---

## Поведение поиска

- **Текстовый поиск:** `title ILIKE %q%` — простой, без full-text
- **Пустой результат:** `ListingsEmptyState` с учётом active filters
- **Нет отдельного `/search` route** — всё через `/listings`

---

## Не реализовано

- Full-text search (PostgreSQL tsvector / Elasticsearch)
- Поиск по description
- Поиск по продавцу
- Autocomplete / suggestions
- Search history
- Saved searches
- SEO landing pages (`SeoPage` model в schema)
- Search analytics
- Фильтр по атрибутам (ListingAttribute)

---

## Tech notes

- Server-side: Prisma `findMany` + `count` в `listings/page.tsx`
- Client-side: URL sync через `useRouter` + debounce
- Legacy dead code: `SearchBar.tsx` (вёл на `/catalog`, `/search`) — не используется

---

## Roadmap

1. Full-text search по title + description
2. Фильтр по seller
3. Autocomplete в header
4. SEO pages по category + city
