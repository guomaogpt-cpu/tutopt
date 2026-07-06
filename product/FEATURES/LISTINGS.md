# Feature: Listings

**Статус:** MVP ✅  
**Роли:** все (create: SELLER/ADMIN)

---

## Обзор

Ядро платформы — оптовые объявления с фото, характеристиками, модерацией и детальной карточкой.

---

## Реализовано

### Создание

- Route: `/listings/new`
- API: `POST /api/listings`
- Upload: `POST /api/uploads/listing-images` → `/uploads/listings/*`
- Валидация Zod (русские сообщения)
- Начальный статус: `PENDING_MODERATION`
- Требуется: title (≥3), description (≥10), price, MOQ, unit, category, city, ≥1 image

### Каталог `/listings`

- Только `PUBLISHED` объявления
- **Фильтры:** q (search), category, city, brand, priceFrom, priceTo, withPhoto
- **Сортировка:** новые, цена ↑↓, MOQ
- **Пагинация:** URL params (`page`, `sort`, etc.)
- Toolbar: search, filter panel (mobile bottom sheet / desktop popover), active chips
- Empty state с CTA (role-aware)

### Карточка в каталоге `ListingCard`

- Фото / placeholder «Нет фото»
- Title, price, MOQ, unit, city, category
- Status badge (для non-published — staff/owner)
- FavoriteButton
- Link → `/listings/[id]`

### Детальная страница `/listings/[id]`

**Layout (desktop):** gallery left | sticky sidebar right  
**Layout (mobile):** gallery → title → sidebar inline → characteristics → description → lead form

**Секции:**
- Breadcrumbs: Главная / Каталог / Категория / Title
- `ListingGallery` — main image + thumbs (scroll if >5)
- `ListingContactCard` — price, MOQ, unit, stock, status, CTA «Отправить заявку»
- `ListingSellerCard` — avatar, company, verified, stats, link to profile
- `ListingCharacteristics` — category, brand, MOQ, city, stock, date
- `ListingDescription` — full text
- `ListingLeadForm` — заявка
- `SimilarListings` — same category, PUBLISHED, exclude current

**Access control (`canViewListing`):**
- PUBLISHED → все
- Owner → свои любые статусы
- ADMIN/MODERATOR → все статусы
- Остальные → `notFound()`

### Главная `/`

- 8 последних PUBLISHED объявлений
- Category grid → `/listings?category=id`
- Home search → `/listings?q=...`

### Категории `/categories`

- Root categories из БД с count опубликованных
- Link → `/listings?category=uuid`

### Legacy

- `/catalog` → redirect `/listings`

---

## Listing model (ключевые поля)

- `title`, `description`, `price`, `currency` (default KGS)
- `moq`, `unit` (PCS, KG, L, etc.)
- `category_id`, `city_id`, `brand_id?`
- `stock_quantity?`
- `status`, `published_at`
- `seller_profile_id`
- Images: `ListingImage` (url, sort_order)

---

## Статусы

```
Create → PENDING_MODERATION
  → Approve → PUBLISHED
  → Reject → REJECTED
```

---

## Не реализовано

- Редактирование объявления
- Черновики (DRAFT) через UI
- ListingAttribute в UI
- Slug-based URLs (сейчас UUID)
- Bulk upload / import
- Дублирование объявления
- Сравнение объявлений

---

## Связанные фичи

- Search (каталог filters)
- Admin (модерация)
- Buyers (leads, favorites)
- Sellers (create, dashboard)
