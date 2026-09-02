# Lalafo Network Extraction — Phase 158

## 1. Цель

Довести Lalafo browser render import до извлечения реальных данных через network/XHR/API responses, с улучшенной диагностикой и корректной валидацией title.

## 2. Текущий симптом (до Phase 158)

- `browserLaunchable: true`, `renderFallbackSucceeded: true`
- `extractionSource: "browser-render"`, `extractionQuality: "PARTIAL"`
- `rawTitle: "lalafo.kg"` — доменное имя вместо названия товара
- price, description, images — не найдены

## 3. Почему browser render недостаточен

Lalafo отдаёт SPA app shell. Данные объявления загружаются через XHR/fetch после `domcontentloaded`. DOM extractor читал страницу слишком рано и принимал `document.title = "lalafo.kg"` как валидный title.

## 4. Network response interception

В `lalafo-render-extractor.ts` во время `page.goto`:

- `page.on("response")` собирает JSON-ответы
- Фильтр: `content-type: application/json` или URL с `api`, `ads`, `feed/details`, `graphql`, `lalafo`
- Лимиты: max 30 responses, 1 MB на response, 5 MB total, timeout 25–30 sec

Модуль: `src/server/import/render/lalafo-network-extractor.ts` (`NetworkResponseCollector`).

## 5. Recursive JSON scan

Универсальный scanner без `any`:

- `src/server/import/render/listing-json-scanner.ts`
- Типы: `unknown`, type guards, `Record<string, unknown>`
- Ключи: title, description, price, currency, images, city, category, id
- Images: фильтр logo/avatar/icon/svg, max 10

## 6. Lalafo target ID matching

`extractLalafoFromNetworkResponses()`:

1. Приоритет: объект с `id === sourceExternalId` из URL (`-id-52305764`)
2. DFS по JSON через `findAdObjectById()`
3. Fallback: наиболее полный snapshot (не рекомендации)

## 7. DOM extraction fallback

Если network JSON не дал данных:

- h1, og:title (с валидацией title)
- price regex: `53 000 KGS`, `сом`, `Договорная`
- description после «Описание»
- img[src], picture source[srcset]
- city из URL `/bishkek/` → Бишкек

## 8. Blocked/captcha diagnostics

`src/server/import/render/page-diagnostics.ts`:

- `documentTitle`, `pageUrl`, `bodyTextSample` (300–500 символов)
- `h1Texts`, `imageCountTotal`, `candidateImageCount`
- `jsonResponseCount`, `jsonResponsesWithTargetId`
- `blockedPageDetected`, `captchaDetected`

Паттерны: captcha, verify, access denied, cloudflare, robot, проверка.

## 9. Source priority

1. `network-json` (matching sourceExternalId)
2. `embedded-json` (matching sourceExternalId)
3. `dom`
4. `open-graph`
5. `url-slug-fallback`

`extractionQuality`:

- `URL_ONLY` — только slug fallback → `autoExtracted: false`
- `PARTIAL` / `FULL` — есть price/images/description

## 10. Invalid title filter

`src/server/import/render/title-validation.ts`:

- Отклоняет: `lalafo.kg`, `Lalafo`, domain names, пустой title
- Fallback: transliterated slug → «Станок для холодной ковки и проката»

## 11. Known limitations

- Нет CAPTCHA bypass, login, phone reveal
- Нет bulk browser parsing
- Нет скачивания фото на сервер
- Raw JSON не сохраняется в БД и не отдаётся в UI
- Lalafo может блокировать datacenter IP даже в browser mode

## 12. Safety limits

| Limit | Value |
|---|---|
| Max JSON responses | 30 |
| Max body per response | 1 MB |
| Max total collected | 5 MB |
| Navigation timeout | 25 s |
| Max images | 10 |

## 13. UI

`/admin/import/[id]` — блок качества:

- Источник: network-json / dom / open-graph / url only
- Найдено: фото, цена, описание, город, категория
- «Название восстановлено из ссылки» при slug fallback

## 14. Modules

- `listing-json-scanner.ts` — recursive JSON scan
- `lalafo-network-extractor.ts` — network collector + Lalafo parser
- `page-diagnostics.ts` — blocked/captcha detection
- `title-validation.ts` — invalid title filter

## 15. Phase 159 — Browser-side manual import

Server render может видеть protection page. Решение: ручной импорт из браузера staff-а.

См. `docs/BROWSER_SIDE_IMPORT_PHASE_159.md`.
