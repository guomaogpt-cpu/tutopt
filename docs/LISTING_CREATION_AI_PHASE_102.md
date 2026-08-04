# Phase 102 — Simplified listing creation with AI description

## 1. Цель

Сделать `/listings/new` проще для обычного человека: понятные шаги, минимум обязательных полей, характеристики без сложной БД, AI-помощь для описания.

## 2. Что изменилось в создании объявления

- Визуальный progress (Тип → Категория → Данные → Описание → Проверка)
- Блок характеристик (textarea)
- Цена «Договорная»
- Бренд / остаток спрятаны в «Дополнительно»
- Preview расширен (фото, post-as, описание)
- Кнопка «Отправить на модерацию»
- AI: «Сгенерировать описание»

## 3. Новая структура формы

1. Выбор типа (`CreateListingVerticalChooser` — без изменений по смыслу)
2. Категория + название + вертикаль
3. Фото, цена/единица/MOQ, город
4. Характеристики + AI + описание
5. Preview + submit на модерацию

## 4. Категории

Существующие категории из БД сохранены. UI labels остаются человекочитаемыми через `CategoryPicker`. Большая миграция категорий **не** делалась.

## 5. Характеристики

UI-only textarea. При submit мержатся в `description` через `mergeListingDescriptionParts` (без Prisma refactor / ListingAttribute).

## 6. AI-генератор описания

Кнопка рядом с описанием. Использует title, category, price, city, characteristics, current draft, unit/MOQ.

Правила prompt: не выдумывать факты, без markdown/эмодзи, 1–2 абзаца, без контактов/ложной гарантии.

## 7. Backend route

`POST /api/listings/generate-description`

- `requireAuth`
- rate limit `assertListingDescriptionAiRateLimit` (20/час)
- Zod validation + max lengths
- OpenAI Chat Completions server-side (`gpt-4o-mini` by default)

## 8. Env

```
OPENAI_API_KEY=
OPENAI_LISTING_MODEL=gpt-4o-mini
```

Если ключ не задан: кнопка показывает «AI-генератор пока не подключён.» (`aiEnabled` с сервера).

## 9. Ограничения

- AI не публикует автоматически
- AI не должен выдумывать данные (prompt)
- Описание всё равно проходит текущую moderation (`PENDING_MODERATION` + content checks)
- API key только на сервере

## 10. Что осталось

- генерация по фото
- автокатегоризация
- мультиязычные описания
- AI moderation
- шаблоны по категориям
- key-value characteristics в БД

## 11. Решение: готово к тесту

**Готово** к тесту упрощённой формы и AI-описания (при наличии `OPENAI_API_KEY`).
