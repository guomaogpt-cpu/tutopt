# Seller profile UX by vertical

Phase 9: публичный профиль продавца и связанные UI адаптируются под направления **без изменения Prisma schema**.

## Текущая модель SellerProfile

Поля уже общие для всех vertical:

- `company_name`, `slug`, `description`, `logo_url`
- `contact_phone`, `contact_email`, `whatsapp`, `telegram`, `website`
- `city` / `region`, `is_verified`, `created_at`

Роль (поставщик / продавец / исполнитель / перевозчик) **выводится из объявлений**, не хранится в БД.

## Helper

`src/features/sellers/lib/seller-vertical-profile.ts`

- `getSellerVerticals(listings)` — направления с объявлениями
- `getSellerPrimaryVertical(listings)` — основной badge
- `getSellerProfileLabel` / `Description` / `CtaLabel`
- empty states и SEO title/description

### Primary vertical

1. Если OPT есть и у него максимальный count (включая ничью) → OPT  
2. Иначе если есть SERVICES → SERVICES  
3. Иначе если есть CARGO → CARGO  
4. Иначе MARKET  
5. Fallback — vertical первого объявления

## Публичный профиль `/seller/[id]`

- Badge роли по primary vertical
- Chips направлений (ТутОпт / ТутМаркет / …) только где есть объявления
- Фильтр: `/seller/[id]?vertical=OPT|MARKET|SERVICES|CARGO`
- Статистика: всего + по направлениям + дата регистрации
- SEO: title/description/OG по primary (или выбранному) vertical

## Listing detail — seller card

Подписи и CTA зависят от `listing.vertical`. Основная кнопка ведёт на `#listing-seller-message` (lead form). Вторая — на публичный профиль с `?vertical=`.

## Dashboard

Компактные счётчики по направлениям + быстрые ссылки `/listings/new?vertical=…`.

## Будущие Prisma-поля (Phase 10+, не сейчас)

| Vertical | Поля |
|----------|------|
| OPT | `company_type`, `wholesale_terms`, `minimum_order_info`, `warehouse_city`, `delivery_available` |
| MARKET | `shop_type`, `retail_delivery_available`, `pickup_address` |
| SERVICES | `experience_years`, `service_area`, `works_remotely`, `callout_available`, `portfolio_images` |
| CARGO | `routes`, `transport_types`, `warehouse_available`, `customs_services`, `vehicle_capacity` |
