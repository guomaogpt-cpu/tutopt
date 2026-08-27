# Import URL Fetch Fix — Phase 151

## 1. Цель

Починить Import by URL для Lalafo и других источников: надёжный fetch, понятные ошибки, partial draft вместо общего «Не удалось открыть ссылку».

## 2. Симптом

`POST /api/admin/import/by-url` возвращал:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Не удалось открыть ссылку." } }
```

Без указания причины (timeout, DNS, 403, SSRF, extraction).

## 3. Root cause

- Все ошибки fetch/SSRF/DNS/HTTP сводились к одному сообщению в `safe-fetch-url.ts`
- При блокировке Lalafo с IP хостинга импорт полностью падал, хотя из URL можно извлечь slug/id
- Extractor Lalafo требовал title из HTML и не использовал fallback из URL/meta/__NEXT_DATA__

## 4. Fetch wrapper

`src/server/import/safe-fetch-url.ts`:

- Timeout 15s
- Max body 3MB
- Max redirects 5 (каждый проверяется SSRF)
- Browser-like User-Agent + Accept-Language
- Structured logging на сервере
- Возвращает `debug: { finalUrl, statusCode, contentType }`

## 5. SSRF protection

Сохранена и уточнена:

- http/https only
- Block localhost, private IPs, .local, .internal
- DNS lookup → reject private resolved IPs
- Redirect to unsafe host → `REDIRECT_BLOCKED`
- Public hosts (lalafo.kg, www.lalafo.kg) не блокируются

## 6. Lalafo fallback extraction

`src/server/import/extractors/lalafo.ts`:

1. JSON-LD Product
2. OpenGraph + Twitter meta
3. HTML h1, price, breadcrumbs
4. `__NEXT_DATA__` / embedded JSON state
5. URL slug title fallback (`parseLalafoUrlHints`)
6. Partial draft если есть title OR description OR image

## 7. Partial draft behavior

Если fetch не удался (blocked/timeout) для Lalafo — создаётся draft из URL hints (title из slug, external id, city).

Если fetch успешен, но данных мало — partial draft `PENDING_REVIEW` с notes «Данные извлечены частично».

UI: «Черновик создан частично».

## 8. Error codes

`src/server/import/import-error-codes.ts`:

| Code | UI message |
|---|---|
| INVALID_URL | Некорректная ссылка |
| FETCH_TIMEOUT | Источник слишком долго не отвечает |
| HTTP_STATUS_BLOCKED | Источник заблокировал запрос |
| HTTP_STATUS_NOT_FOUND | Страница не найдена |
| EXTRACTION_FAILED | Данные объявления не найдены |
| PRIVATE_NETWORK_BLOCKED | Заблокировано защитой безопасности |
| DNS_LOOKUP_FAILED | Не удалось найти адрес сайта |
| REDIRECT_BLOCKED | Переадресация заблокирована |

API `details`: `{ importErrorCode, nextAction, debug }`

## 9. UI errors

`ImportByUrlForm` показывает message + nextAction из API details.

## 10. Security

- Admin/moderator only
- SSRF остаётся активной
- No raw HTML to client
- Debug object без HTML (только metadata)

## 11. Known limitations

- Lalafo HTML может блокироваться datacenter IP → Phase 152: Lalafo public API fallback
- Instagram limited OG без изменений
- No browser automation / CAPTCHA bypass (render fallback reserved, not enabled)

## Файлы

| File | Change |
|---|---|
| `src/server/import/safe-fetch-url.ts` | Fetch + SSRF + error codes |
| `src/server/import/import-error-codes.ts` | Codes + messages |
| `src/server/import/lalafo-url-hints.ts` | URL slug parsing |
| `src/server/import/extractors/lalafo.ts` | Fallbacks + partial |
| `src/server/import/import-by-url-service.ts` | Partial on fetch fail |
| `src/components/admin/ImportByUrlForm.tsx` | Error UI |

## Migration

Нет.

## Phase 152 follow-up

См. `docs/LALAFO_REAL_EXTRACTOR_FALLBACK_PHASE_152.md` — Lalafo public API, transliteration, duplicate UX, re-extract.
