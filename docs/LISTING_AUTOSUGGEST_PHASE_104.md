# Phase 104 — Listing autosuggestions

## 1. Цель

Упростить `/listings/new`: по названию товара предлагать категорию и очевидные характеристики. Пользователь подтверждает или игнорирует — без принудительной подстановки.

## 2. Как работают подсказки

Rule-based helper `getListingSuggestions` (`src/lib/listings/listing-autosuggest.ts`):

- вход: `vertical`, `title`, список категорий, текущая категория
- выход: `suggestedCategories`, `suggestedCharacteristics`, `confidence`, `hints`
- UI: компактная карточка `ListingAutosuggestCard` сразу после поля «Название»
- кнопки: «Выбрать категорию» / «Применить» / «Не сейчас»

Подсказки **не** меняют форму без подтверждения и **не** перезаписывают уже заполненные характеристики.

## 3. Какие vertical поддерживаются

| Vertical | Категории | Характеристики из title |
|---|---|---|
| MARKET | электроника, одежда, дом/мебель, авто, недвижимость (если есть), техника | бренд, модель, память, размер, … |
| SERVICES | ремонт, электрики, сантехники, грузчики, клининг, автоуслуги, дизайн, IT | по пресету Phase 103, если есть явные токены |
| OPT | продукты, одежда, оборудование, упаковка, стройматериалы, сырьё, электроника | напряжение, мощность, бренд, … |
| CARGO | нет keyword-правил в этой фазе | — |

## 4. Как определяется категория

Ключевые слова в названии → целевые slug → поиск категории в загруженном списке (exact / soft match).

Примеры MARKET:

- iPhone / Samsung / ноутбук → `market-telefony-i-elektronika`
- кроссовки / платье → `market-odezhda-i-obuv`
- диван / шкаф → `market-dom-i-sad` / `market-mebel`
- Toyota / шины → `market-avto-i-moto`

Если категория уже выбрана пользователем — та же категория не предлагается снова.

## 5. Как извлекаются характеристики

После определения slug (текущий или предложенный) берутся поля Phase 103.

Из title извлекаются очевидные значения:

- `iPhone 13 Pro Max 256GB` → Apple, iPhone 13 Pro Max, 256 GB
- `Samsung S23 128GB` → Samsung, модель, 128 GB
- `Кроссовки Nike 42` → Nike, 42
- `Станок 380V 5кВт` → 380V, 5 кВт

Пустые / неуверенные значения не предлагаются. Apply заполняет только пустые поля.

## 6. Как это связано с AI описанием

После Apply значения попадают в form state Phase 103 → `characteristicItems` / merged description → AI generator и mock используют уже применённые данные.

Suggested but not applied **не** уходят в AI и **не** показываются в preview.

## 7. Ограничения

- только rule-based (без ML)
- нет AI по фото
- нет точной классификации
- cargo keyword-подсказки не делались
- `market-nedvizhimost` может отсутствовать в seed — подсказка появится, только если категория есть в БД

## 8. Future

- AI автокатегоризация
- анализ фото
- фильтры по характеристикам
- категорийные шаблоны описаний
- улучшение confidence / обучение на модерации

## Phase 105 listing attributes persistence

См. `docs/LISTING_ATTRIBUTES_PERSISTENCE_PHASE_105.md`. Applied characteristics теперь сохраняются в `Listing.characteristics` JSON.

## Phase 106 listing taxonomy equipment

См. `docs/LISTING_TAXONOMY_EQUIPMENT_PHASE_106.md`. Autosuggest указывает на equipment subcategories.
