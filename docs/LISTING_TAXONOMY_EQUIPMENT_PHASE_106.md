# Phase 106 — Expanded listing taxonomy (equipment)

## 1. Цель

Сделать визуально заметную taxonomy для `/listings/new`: широкие market-категории, полноценная ветка «Оборудование и станки» с подкатегориями, поиск и правильные характеристики.

## 2. Почему визуально «ничего не менялось»

Phase 105 сохраняла `Listing.characteristics` JSON, но:
- seed MARKET оставался плоским (10 корней без оборудования)
- CategoryPicker для flat roots сразу выбирал корень без шага подкатегорий
- пресет электроники ошибочно матчил `market-bytovaya-tehnika` (телефонные поля)

## 3. Что исправлено в UI

- Расширен seed `MARKET_CATEGORIES` (Электроника с детьми, Оборудование и станки + 17 подкатегорий, Недвижимость, Строительство, Бизнес и склад, Другое…)
- `CategoryPicker`: поиск сверху + чипы подкатегорий (не только search)
- «Оборудование и станки» выделено в сетке
- Fallback характеристик — универсальный (не память телефона)
- Пресеты оборудования по подкатегориям (упаковка, пищевое, HoReCa, металлообработка, склад, насосы)

## 4. Как сохраняется subcategory

1. **DB category**: пользователь выбирает leaf-категорию (`category_id` = подкатегория, например `market-eq-upakovochnoe`). Parent — `market-oborudovanie-i-stanki`.
2. **JSON characteristics**: при submit добавляется  
   `{ id: "subcategory", label: "Подкатегория", value: "<имя>", group: "main" }`  
   если путь категории ≥ 2 уровней.

## 5. Где подключено

| Место | Файл |
|---|---|
| Seed | `prisma/seed-data/categories.ts` |
| Picker UI | `CategoryPicker.tsx` + `category-search.ts` |
| Characteristics | `listing-characteristics.ts` + `listing-characteristics-equipment.ts` |
| Market landing | `market/page.tsx` fallbacks + `market-category-visuals.ts` |
| Autosuggest | `listing-autosuggest.ts` |
| Form preview/AI | `NewListingForm.tsx` (path + subcategory item) |

## 6. Проверенные сценарии (логика)

1. Оборудование → Упаковочное → поля упаковки/плёнки/питания  
2. Оборудование → Металлообработка → тип станка / ЧПУ / зона  
3. Электроника → Телефоны → бренд / память  
4. Другое → универсальные поля без GB/памяти  

## 7. Future

- ~~filters by equipment specs~~ → Phase 120 catalog search aliases + card chips (faceted filters — future)
- deactivate orphan flat categories if any remain unused

## Phase 120 — Search integration ✅

Equipment taxonomy synonyms используются в `/listings` search, suggest API и `/market` catalog shortcuts.

См. `docs/LISTINGS_SEARCH_FILTERS_PHASE_120.md`
