# Listings Search & Filters — Phase 120

> **Цель:** улучшить поиск, фильтры и выдачу объявлений в Android/PWA без внешних search-сервисов.

---

## 1. Цель

Пользователь быстро находит товары, услуги и опт — особенно промышленное оборудование. Mobile-first фильтры, понятные chips, улучшенные карточки.

---

## 2. Что было неудобно

- `q` искал только по `title`
- `category` — UUID без slug, без подкатегории, без subtree
- Нет equipment keyword aliases в выдаче
- Mobile filters уже были drawer, но без subcategory
- Карточки без характеристик
- `/market` вёл на SEO-лендинги, не в `/listings` filter
- Empty state без shortcut на оборудование

---

## 3. Search params

Единая схема (backward compatible):

| Param | Описание |
|---|---|
| `q` | текстовый поиск |
| `vertical` | MARKET / OPT / SERVICES / CARGO (или slug) |
| `category` | UUID или SEO slug |
| `subcategory` | UUID или SEO slug |
| `city` | UUID города |
| `priceFrom` / `priceTo` | цена (legacy: `priceMin` / `priceMax`) |
| `sort` | newest / oldest / price_asc / price_desc |

Примеры:

- `/listings?q=фасовщик`
- `/listings?vertical=MARKET&category=oborudovanie-i-stanki`
- `/listings?vertical=MARKET&category=oborudovanie-i-stanki&subcategory=eq-upakovochnoe`

Helpers: `parseListingsCatalogParams`, `resolveCatalogCategoryFilter`, `buildListingsCatalogQueryString`.

---

## 4. Категории и подкатегории

- Slug или UUID в URL
- Parent category → фильтр по **subtree** (все дочерние)
- Subcategory → exact match
- Mobile/desktop filters: category + subcategory dropdowns

---

## 5. Equipment search aliases

`catalog-search.ts` + расширенные `CATEGORY_SEARCH_SYNONYMS`:

- фасовщик, упаковочное, вакууматор, станок, ЧПУ, насос, компрессор, …
- Поиск расширяет OR по title, description, category, brand
- Synonym categories добавляются в OR (`category_id IN …`)
- Suggest API использует `searchCategoriesWithSynonyms`

---

## 6. Mobile filters

`CatalogFiltersPanel`:

- Mobile: bottom drawer (Фильтры → Показать / Сбросить)
- Desktop: popover card (без redesign)
- Поля: раздел, категория, подкатегория, город, цена, сортировка, фото
- Active chips над выдачей с удалением по одному

---

## 7. Listing cards

`ListingCard` (catalog variant):

- фото, цена, город, дата, категория
- 1–2 highlight chips из `characteristics` (состояние, напряжение, MOQ context)
- favorite button
- lazy images (Next/Image)

---

## 8. Empty states

`ListingsEmptyState`:

- «Ничего не найдено»
- «Сбросить фильтры» + «Подать объявление»
- Equipment shortcut при equipment-like `q`

---

## 9. Android/WebView considerations

- Filter drawer закрывается Back (`Drawer` + overlay stack)
- Grid `pb-24` на mobile — не перекрывается bottom nav
- Search input `type="search"`, tel filters с `inputMode`
- Keyboard inset на drawer footer (safe-area)

---

## 10. Security

Публичная выдача:

- только `PUBLISHED`
- not expired (`buildNotExpiredListingFilter`)
- pending / rejected / draft / archived не видны публично

Account `/account/listings` — все статусы продавца без изменений.

---

## 11. Known limitations

- **Full JSON characteristics search** — не в Prisma where (future: denormalized search_text или Meilisearch)
- Category slug в toolbar всё ещё пишет UUID (shortcuts на `/market` используют slug)
- Saved searches — без изменений
- AI semantic search — не в scope

---

## 12. Future

- Elasticsearch / Meilisearch
- AI semantic search
- Поиск по фото (реальный, не prototype)
- Фильтры по характеристикам (faceted)
- Saved searches sync
- Denormalized `search_document` column

---

## Связанные документы

- `docs/MOBILE_APP_UX_UPGRADE_PHASE_115.md`
- `docs/LISTING_TAXONOMY_EQUIPMENT_PHASE_106.md`
- `docs/LISTING_ATTRIBUTES_PERSISTENCE_PHASE_105.md`
- `docs/MOBILE_APP_ROADMAP_PHASE_107.md`
