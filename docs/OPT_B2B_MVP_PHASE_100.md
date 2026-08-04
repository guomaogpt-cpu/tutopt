# Opt B2B MVP — Phase 100

## 1. Цель

Довести раздел **Опт** до user-friendly B2B MVP: оптовые предложения отличаются от розницы — отдельный вход `/opt`, поставщик/партия/MOQ, синяя тема. Карго не трогали. Prisma schema не меняли.

## 2. Что проверено

| Зона | Результат |
|---|---|
| `/opt` | Hero, категории, предложения, «Для бизнеса» |
| `/listings?vertical=OPT` | Заголовок, placeholder, blue accents, empty |
| `/listings/new?vertical=OPT` | Labels (цена/MOQ/единица/город), success |
| `/listings/[id]` (OPT) | Поставщик, MOQ, «Связаться с поставщиком» |
| `/account/listings` filter OPT | Empty state для опта |
| unit / moq / stock | Поля уже в schema; card показывает MOQ |
| Contact/lead | Wholesale copy, без email |
| Mobile | Компактный hero, 2-col категории |

## 3. Что улучшено

- Hero: «Опт» + подзаголовок + «Найти оптом» / «Разместить оптовое предложение»
- Категории после hero + короткий блок «Для бизнеса»
- Catalog: «Оптовые предложения», placeholder «Что ищете оптом?», empty
- Card: цена + единица + MOQ
- Lead CTA «Связаться с поставщиком»; success «Поставщик получит…»
- Create: page title, оптовая цена, единица цены, город, success CTAs
- Account empty для фильтра OPT
- Header/catalog search placeholder

## 4. Как работает `/opt`

Компактный blue hero → категории → новые оптовые предложения → «Для бизнеса».

## 5. Категории опта

Существующая структура (`opt-category-visuals`) сохранена; отображение через `OptCategoryHighlights` (2 колонки mobile).

## 6. Как работает каталог опта

`/listings?vertical=OPT`: поиск, фильтры/drawer, сортировка, blue primary, B2B empty states.

## 7. Как работает создание оптового предложения

`/listings/new?vertical=OPT`: название товара, оптовая цена, единица, MOQ, город; success «Оптовое предложение отправлено на модерацию».

## 8. Как работает карточка опта

Фото, название, цена/единица, MOQ, город, поставщик/компания, verified, избранное.

## 9. Как работает связь с поставщиком

Кнопка «Связаться с поставщиком» → lead (количество + телефон + сообщение) → success. Чата нет.

## 10. Что осталось

- Живой create/upload на production
- Наполнение категорий контентом
- Сложные B2B price tiers / складская аналитика — отдельная фаза (не в scope)
- Поля unit/moq/stock уже есть; отдельных tier-цен нет

## 11. Решение

**Готово к тесту опта** как B2B MVP.

---

## Phase 100 opt B2B MVP

Opt landing + catalog + supplier contact + MOQ on cards.

## Phase 102 simplified listing creation with AI description

See `docs/LISTING_CREATION_AI_PHASE_102.md`. Shared create form simplified; opt MOQ/unit remain, AI helps with offer description.

## Phase 103 category-based listing characteristics

See `docs/LISTING_CHARACTERISTICS_PHASE_103.md`. Opt presets: min lot, price unit, stock, food/equipment extras (warranty only if selected); structured values for AI.
