# Lalafo Real Extractor Fallback — Phase 152

## 1. Цель

Довести импорт Lalafo до реального извлечения данных (фото, цена, описание, город, категория), а не только partial draft из URL slug.

## 2. Текущая проблема partial draft only

Phase 151 создавал partial draft из slug, когда HTML fetch блокировался с IP хостинга (Railway/datacenter). Результат:

- `autoExtracted: false` или partial с пустыми images/price
- title только из латинского slug
- админ вынужден искать данные вручную

## 3. Lalafo diagnostics

`POST /api/admin/import/by-url` возвращает `debug` (без raw HTML):

| Field | Описание |
|---|---|
| `requestedUrl` | Исходная ссылка |
| `finalUrl` | URL после редиректов HTML fetch |
| `statusCode` | HTTP статус (HTML или API) |
| `contentType` | Content-Type HTML ответа |
| `responseSize` | Размер ответа в байтах |
| `redirectCount` | Число редиректов |
| `extractorUsed` | `LALAFO` |
| `extractionSource` | `lalafo-api`, `open-graph`, `html`, `url-slug-fallback`, `failed` |
| `extractionSources` | Все использованные источники |
| `fieldsFound` | title, description, price, city, images count, category |
| `failureReason` | Причина fallback (если есть) |
| `renderFallbackAvailable` | `IMPORT_RENDER_FALLBACK_ENABLED=true` |

## 4. Improved fetch extractor

Порядок извлечения из HTML (`extractors/lalafo.ts`):

1. JSON-LD (`application/ld+json`)
2. OpenGraph + Twitter meta
3. Embedded app data (`__NEXT_DATA__`, `__INITIAL_STATE__`, JSON blobs в script)
4. Plain HTML (h1, price, breadcrumbs, images)
5. URL slug hints (последний fallback)

HTML fetch опционален — ошибка не прерывает импорт для Lalafo.

## 5. Lalafo public API (primary fix)

Модуль: `src/server/import/lalafo-api.ts`

```
GET https://lalafo.kg/api/search/v3/feed/details/{adId}
Headers: Device=pc, Country-Id=12, Language=ru_RU, Accept=application/json
```

Извлекает: title, description, price, currency, city, images (`original_url`), mobile (internal only).

Pipeline: `lalafo-extraction-pipeline.ts`

1. Lalafo API по ad id из URL
2. HTML extractor (если fetch успешен)
3. Merge API + HTML
4. URL slug fallback (если оба недоступны)

## 6. Optional render fallback

Не реализован в Phase 152 (Playwright/Puppeteer тяжёлы для Railway).

Env flag `IMPORT_RENDER_FALLBACK_ENABLED=true` зарезервирован; при попытке без браузера — код `RENDER_FALLBACK_UNAVAILABLE`.

Приоритет: Lalafo API решает проблему без headless browser.

## 7. URL slug transliteration fallback

Модуль: `lalafo-url-hints.ts`

- Удаление `-id-{digits}` из slug
- Latin → Russian словарь (`avtomaticeskij` → автоматический, `stanok` → станок, `dla` → для)
- Capitalize first letter
- City из path segment (`bishkek` → Бишкек)

Примеры:

- `avtomaticeskij-stanok-dla` → «Автоматический станок для»
- `masina-dla-fasovki-poroskov-i-granul` → «Машина для фасовки порошков и гранул»

## 8. Category mapping

`category-mapper.ts` keyword rules:

- фасов/упаков → `market-oborudovanie-i-stanki` / `market-eq-upakovochnoe`
- станок/металло → `market-oborudovanie-i-stanki` / `market-eq-metalloobrabotka`
- оборудование/аппарат/машина → `market-oborudovanie-i-stanki` / `market-eq-drugoe`

UI хранит slug, показывает label через `ImportCategorySelect`.

## 9. Duplicate UX

Если `source_url` уже импортировался:

- **Не создаётся** новый draft (по умолчанию)
- Response: `duplicate: true`, `existingDraftId`, `existingListingId`
- UI: «Эта ссылка уже импортировалась» + кнопки «Открыть существующий», «Импортировать заново», «Отмена`
- `forceNew: true` — создать новый черновик явно
- Статус `DUPLICATE` — publish скрыт в detail panel

## 10. Re-extract flow

`POST /api/admin/import-drafts/[id]/reextract`

- Берёт `sourceUrl` черновика
- Запускает тот же pipeline
- Обновляет **только пустые** raw/normalized поля
- Добавляет note «Повторное извлечение выполнено.»

UI: кнопка «Повторить извлечение» на `/admin/import/[id]`.

## 11. Import quality UI

Блок «Качество импорта» на draft detail:

- Полный / Частичный / Только из ссылки / Дубль
- Чеклист полей: название, цена, фото, описание, город, категория
- Сообщения: «Фото не найдены. Источник не отдал изображения.»

## 12. Security

- Admin/moderator only (`requireStaff`)
- SSRF protection на все fetch (HTML + API URL)
- No raw HTML в API response
- No login / CAPTCHA bypass / phone reveal automation
- `rawContact` internal only, не публикуется
- No auto publish
- No image download/rehosting

## 13. Known limitations

- Lalafo API может изменить контракт или заблокировать datacenter IP
- HTML fetch на Railway часто blocked → API fallback критичен
- Instagram без изменений (OG-only)
- Render fallback не включён
- Bulk queue использует тот же pipeline, но без render

## 14. Future

- Official Lalafo partner import API
- Image rehosting (CDN)
- OCR from screenshots
- Browser worker (optional render queue)
- Bulk extraction with dedicated queue worker

## Файлы

| File | Change |
|---|---|
| `src/server/import/lalafo-api.ts` | Public API fetch |
| `src/server/import/lalafo-extraction-pipeline.ts` | API + HTML + slug pipeline |
| `src/server/import/lalafo-url-hints.ts` | Transliteration |
| `src/server/import/import-by-url-service.ts` | Pipeline integration, duplicate, reextract |
| `src/server/import/import-error-codes.ts` | Debug fields |
| `src/app/api/admin/import-drafts/[id]/reextract/route.ts` | Re-extract API |
| `src/features/import-drafts/lib/import-quality.ts` | Quality helper |
| `src/components/admin/ImportByUrlForm.tsx` | Duplicate UX |
| `src/components/admin/ImportDraftDetailPanel.tsx` | Quality, reextract, duplicate guard |

## Migration

Нет.
