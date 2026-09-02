# Lalafo Browser Render Import — Phase 153

## 1. Цель

Получать реальные данные Lalafo (цена, описание, фото, город) на production, где server fetch и public API возвращают HTTP 403.

## 2. Почему fetch/API даёт HTTP 403

Lalafo блокирует запросы с datacenter IP (Railway, AWS и т.д.). Phase 152 добавил public API fallback, но API также может вернуть 403 с production IP.

## 3. Почему URL fallback недостаточен

Slug fallback даёт только transliterated title и guessed category. Это не решает задачу импорта — админ всё равно ищет цену, фото и описание вручную.

Phase 153: `url-slug-fallback` больше не считается успешным auto-extract (`autoExtracted: false`, `extractionQuality: URL_ONLY`).

## 4. Render fallback architecture

```
POST /api/admin/import/by-url
  → SSRF validate URL
  → Lalafo API fetch (may 403)
  → HTML fetch (may 403)
  → if no meaningful fields AND IMPORT_RENDER_FALLBACK_ENABLED=true
      → Playwright Chromium opens public page
      → extract DOM + embedded JSON + HTML parser
  → else URL slug fallback (partial, URL_ONLY)
```

Модули:

- `src/server/import/render/render-config.ts` — env flag
- `src/server/import/render/lalafo-render-extractor.ts` — browser session + extraction
- `src/server/import/render/embedded-json-scanner.ts` — recursive JSON scan

Bulk queue (`process-import-batch`) использует `allowRender: false` — browser только для single import.

## 5. Env flag

```
IMPORT_RENDER_FALLBACK_ENABLED=true
```

Без флага render не запускается. UI показывает:

> Lalafo заблокировал серверный запрос. Включите render fallback или заполните вручную.

Chromium устанавливается при build только если env установлен (`scripts/install-playwright-chromium.mjs`).

## 6. Fields extraction

Приоритет в render session:

1. Embedded JSON (`__NEXT_DATA__`, JSON-LD, Apollo/Redux blobs)
2. HTML extractor (`extractLalafoListing`)
3. DOM evaluate (h1, price regex, description block, img/src, og:image)
4. URL city hint (`/bishkek/` → Бишкек)

Phone: только если явно виден в DOM без клика. Не публикуется.

## 7. Image handling

- External URLs only (max 10)
- Filter: logo, avatar, icon, data:, tiny sprites
- Не скачиваем на сервер
- Preview на draft detail через external URL

## 8. Price/description handling

- `rawPrice` — исходная строка (например `860 000 KGS`)
- `normalizedPrice` / `normalizedCurrency` через `parsePriceText`
- KGS default для lalafo.kg
- Description без выдуманных характеристик

## 9. Re-extract with browser mode

```
POST /api/admin/import-drafts/[id]/reextract?mode=render
```

- Только render path (без API/fetch)
- Обновляет только пустые поля
- Если env выключен → `RENDER_FALLBACK_UNAVAILABLE`

UI: кнопка «Повторить с браузерным режимом» на Lalafo partial/URL_ONLY drafts.

## 10. Duplicate UX

Повторный import той же ссылки:

- Не создаёт новый draft
- Кнопки: «Открыть существующий», «Повторить извлечение существующего черновика», «Создать новый черновик всё равно»

## 11. Publish validation

После render extract с title + category + city publish работает. External image URLs сохраняются в draft и передаются в Listing без download.

## 12. Security limits

- Admin/moderator only
- SSRF validate before browser goto
- No login, CAPTCHA bypass, phone reveal click
- No bulk browser by default
- Timeout 25s navigation
- No raw HTML in API response

## 13. Railway deployment notes

1. Set `NODE_VERSION=20.19.0` (or use `nixpacks.toml` / `engines.node`)
2. Set `IMPORT_RENDER_FALLBACK_ENABLED=true` only after Node 20 deploy is stable
3. Redeploy — postinstall installs Chromium when env is set on Node 20+
4. Memory: Chromium needs ~300–500MB RAM per import
5. If chromium install fails → graceful `RENDER_FALLBACK_UNAVAILABLE`
6. Build succeeds without env (render disabled)

See also: `docs/RAILWAY_NODE20_PLAYWRIGHT_PHASE_154.md`
See also: `docs/PRODUCTION_RENDER_FALLBACK_DIAGNOSTICS_PHASE_155.md`
See also: `docs/RAILWAY_PLAYWRIGHT_CHROMIUM_DEPS_PHASE_156.md` — Linux system deps for Chromium

## 14. Limitations

- Render медленнее fetch (~5–20 sec)
- Railway memory limits may affect concurrent renders
- Lalafo may change DOM structure
- Bulk import не использует browser

## 15. Future

- Image rehosting CDN
- OCR screenshot import
- Official Lalafo partner API
- Bulk browser worker with rate limits

## Migration

Нет.
