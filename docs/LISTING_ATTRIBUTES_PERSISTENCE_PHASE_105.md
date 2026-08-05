# Phase 105 — Listing attributes persistence

## 1. Цель

Сохранять выбранные характеристики объявления в БД и показывать их на странице объявления, в preview и передавать в AI.

## 2. Как характеристики сохранялись раньше

Phase 102–104: form state → merge в `description` (текст) / AI prompt. Отдельного structured storage на Listing не было. Таблица `ListingAttribute` существовала, но create API её не писал.

## 3. Как сохраняются теперь

При create/update:

1. Форма сериализует только заполненные поля → `ListingCharacteristic[]`
2. API валидирует (Zod) и сохраняет в `Listing.characteristics` (JSON)
3. Пустые / dismissed suggestions не сохраняются
4. Описание остаётся отдельным текстом (без обязательного merge характеристик)

## 4. Prisma field

Добавлено:

```prisma
characteristics Json? @db.JsonB
```

Migration: `20260805090000_add_listing_characteristics`

Старые объявления: `null` → парсер возвращает `[]`, блок на detail не показывается.

## 5. Формат JSON

```json
[
  {
    "id": "brand",
    "label": "Бренд",
    "value": "Apple",
    "group": "main"
  },
  {
    "id": "storage",
    "label": "Память",
    "value": "256 GB",
    "group": "main"
  },
  {
    "id": "kit",
    "label": "Комплект",
    "value": ["Коробка", "Зарядка"],
    "group": "additional"
  }
]
```

Тип: `src/features/listings/types/listing-characteristic.ts`

Limits: max 30 items, label ≤ 80, string value ≤ 300, array ≤ 20.

## 6. Где характеристики показываются

| Место | Поведение |
|---|---|
| Preview `/listings/new` | только applied |
| Detail `/listings/[id]` | structured block + vertical title |
| Account / ListingCard | не показываем в этой фазе (future) |
| AI generate-description | `characteristicItems` из form state |

Vertical titles:

- market: Характеристики
- services: Условия услуги
- opt: Условия опта
- cargo: Направления и услуги

## 7. Как они используются AI

Без изменений контракта Phase 103/104: form → `characteristicItems` → prompt + mock. После Apply значения уже в form state, значит попадают в AI до submit.

## 8. Backward compatibility

- `null` / bad JSON → `[]`
- старые объявления открываются
- metadata-блок (категория/город/цена) сохранён отдельно

## 9. Ограничения

- фильтров по характеристикам нет
- labels характеристик пока RU
- ListingCard / account chips не показывают specs
- `ListingAttribute` table по-прежнему не используется create API

## 10. Future

- фильтры по характеристикам
- 1–2 specs на ListingCard
- AI по фото / автозаполнение
- i18n labels для field definitions
- опциональная синхронизация с `ListingAttribute`
