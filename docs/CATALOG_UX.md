# UX каталога `/listings`

## Структура страницы

1. Breadcrumbs
2. Заголовок «Каталог объявлений» + подзаголовок платформы
3. Toolbar:
   - vertical tabs (Все / ТутОпт / ТутМаркет / ТутУслуги / ТутКарго)
   - крупный поиск + кнопка «Найти»
   - results header: «Найдено: N», сортировка, «Фильтры», «Сохранить поиск»
4. Active filter chips + «Сбросить всё»
5. Сетка marketplace-карточек (`ListingCard` catalog)
6. Pagination

URL searchParams — единственный источник истины. Client state только для
черновика поиска и draft фильтров в панели.

## Search params

Парсер: `parseListingsCatalogParams` / `buildListingsCatalogQueryString`
(`src/features/listings/lib/listings-catalog.ts`).

| Param | Назначение |
|-------|------------|
| `q` | поиск по title |
| `vertical` | OPT / MARKET / SERVICES / CARGO |
| `category` | category id |
| `city` | city id |
| `brand` | brand id (для OPT/MARKET) |
| `priceFrom` / `priceTo` | диапазон цены |
| `withPhoto=1` | только с фото |
| `sort` | newest / oldest / price_asc / price_desc |
| `page` | пагинация (20 на страницу) |

При любом изменении фильтра `page` сбрасывается на 1.

## Фильтры

Панель `CatalogFiltersPanel`:

- desktop — dropdown card рядом с кнопкой «Фильтры»;
- mobile — bottom Drawer (существующий UI component).

Поля: категория, город, бренд (если уместно для vertical), цена от/до,
«Только с фото». Query logic не менялась.

## Vertical tabs

Pill tabs в toolbar. Меняют `vertical`, сбрасывают `category` и `brand`
(категории привязаны к vertical), остальные params сохраняются.
Active tab с цветовым tint направления (локально в toolbar, без
`vertical-theme`).

## Active filter chips

`getActiveFilterChips` показывает:

- Поиск: …
- ТутОпт / ТутМаркет / …
- Категория: …
- Город
- Бренд
- Цена от / Цена до
- С фото

Клик по chip удаляет фильтр через URL. «Сбросить всё» → `/listings`.

## Mobile filters

Кнопка «Фильтры» открывает Drawer снизу с Apply / Reset. На 390px не
ломается: tabs горизонтально скроллятся, search + Find в колонку.

## Saved search

`SaveSearchButton` рядом с сортировкой/фильтрами. Сохраняет текущий URL
без `page` (через `buildCatalogHref`). localStorage helper Phase 24 не
менялся.

## Analytics

- `catalog_search_submit`
- `catalog_filter_change`
- `catalog_sort_change`
- `catalog_vertical_tab_click`
- `catalog_reset_filters`

Params: `vertical`, `has_query`, `has_category`, `has_city`, `has_price`,
`sort`. Полный search query и user data не отправляются.

## Later

- гео-поиск;
- диапазоны цен по категориям;
- фильтры по attributes;
- smart suggestions;
- promoted listings;
- infinite scroll;
- saved filters server-side.
