# Phase 103 — Category-based listing characteristics

## 1. Цель

Заменить свободное поле «Характеристики» на умные поля по типу публикации и категории: select, chips, короткие input, toggle, «Другое». Эти значения идут в AI-описание и preview.

## 2. Почему textarea была неудобной

Пользователь сам придумывал, что писать. Поле не подсказывало нужные параметры, плохо работало на mobile и слабо помогало AI (свободный текст без структуры).

## 3. Как теперь работают характеристики

1. Пользователь выбирает vertical + category.
2. `resolveListingCharacteristicFields(vertical, slug)` подбирает пресет из `src/config/listing-characteristics.ts`.
3. `ListingCharacteristicsFields` показывает основные поля (3–5) и дополнительные за кнопкой «Показать дополнительные».
4. Значения хранятся в form state как structured values.
5. Перед AI / submit пустые значения отбрасываются; остаётся список `{ label, value }`.

## 4. Пресеты по vertical/category

| Vertical | Категории (slug) | Примеры полей |
|---|---|---|
| MARKET | `market-telefony-i-elektronika`, `market-bytovaya-tehnika` | Бренд, модель, состояние, память, комплект |
| MARKET | `market-odezhda-i-obuv` | Тип, пол, размер, состояние, цвет |
| MARKET | `market-dom-i-sad`, `market-mebel` | Тип товара, состояние, материал, размеры |
| MARKET | `market-avto-i-moto` | Марка, модель, год, состояние, тип |
| MARKET | `market-nedvizhimost` (если появится) | Тип, сделка, площадь, комнаты |
| MARKET | остальные | Состояние, бренд, размер/модель, комплектация |
| SERVICES | base + ремонт/авто | Формат, опыт, цена, тип работ / автоуслуга |
| OPT | base + food / equipment / electronics | MOQ-поля, упаковка, напряжение, гарантия |
| CARGO | все cargo-* | Направления, тип доставки, услуги, срок |

Labels полей пока на RU (основной рынок); структура готова к KG/EN labels позже.

## 5. Как характеристики передаются в AI

`POST /api/listings/generate-description` принимает:

```json
{
  "characteristicItems": [
    { "label": "Бренд", "value": "Apple" },
    { "label": "Память", "value": "256 GB" }
  ],
  "characteristics": "Бренд: Apple\nПамять: 256 GB"
}
```

- Пустые значения не отправляются.
- Prompt и mock используют structured items (legacy string — fallback).
- AI не должен выдумывать гарантию/комплект, если пользователь их не указал.

## 6. Как работает preview

В блоке проверки перед публикацией:

```
Характеристики:
- Бренд: Apple
- Память: 256 GB
```

Пустые поля не показываются. Если характеристик нет — блок скрыт.

## 7. Как сохраняются характеристики

**Без Prisma migration.**

На Listing нет JSON `attributes`/`specs` поля. Есть `ListingAttribute` (key/value rows), но create API его пока не пишет.

В Phase 103:

- form state → serialize → merge в `description` через `mergeListingDescriptionParts` при submit
- AI получает structured items
- detail page не ломается: характеристики остаются частью текста описания

## 8. Ограничения

- нет фильтрации / поиска по характеристикам
- нет автокатегоризации
- нет автозаполнения по фото
- нет отдельного DB JSON attributes на Listing (и create не пишет `ListingAttribute`)
- slug `market-nedvizhimost` может отсутствовать в seed — пресет готов на будущее

## 9. Future

- JSON attributes migration **или** запись в существующий `ListingAttribute`
- category-specific filters (память, состояние, размер, мощность)
- AI автозаполнение характеристик по фото
- AI автокатегоризация
- KG/EN labels для field definitions
- показ structured блока на `/listings/[id]`

## 10. Gap для поиска

Для полноценного поиска/фильтрации по характеристикам нужна отдельная JSON attributes / ListingAttribute фаза.

## Phase 104 listing autosuggestions

Rule-based подсказки категории и характеристик по названию. См. `docs/LISTING_AUTOSUGGEST_PHASE_104.md`.
Пользователь подтверждает Apply — suggested-but-not-applied не пишутся в description / AI.
