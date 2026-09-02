# Browser-Side Manual Import — Phase 159

## 1. Почему server-side Lalafo import ограничен

Lalafo блокирует datacenter IP (Railway, AWS). Server fetch, public API и Playwright render часто получают protection page вместо данных объявления.

## 2. Почему Playwright видит protection page

Headless Chromium с серверного IP воспринимается как bot traffic. Lalafo отдаёт CAPTCHA / security check вместо SPA с данными объявления.

Phase 159: это **не** server error (502). Код: `SOURCE_BLOCKED` / `SOURCE_PROTECTION_PAGE`.

## 3. Browser-side manual import flow

Staff открывает объявление в **своём браузере** (реальный user session), собирает данные через bookmarklet, вставляет JSON на `/admin/import`, создаётся `ImportedListingDraft`.

```
Lalafo page (user browser)
  → bookmarklet collects DOM/meta
  → JSON copied to clipboard
  → /admin/import paste form
  → POST /api/admin/import/browser-page
  → draft (READY / PENDING_REVIEW)
  → staff review → publish
```

## 4. Bookmarklet

- Модуль: `src/features/import-drafts/lib/lalafo-bookmarklet.ts`
- UI: `BrowserPageImportForm` — кнопка «Скопировать bookmarklet»
- Собирает: URL, title, price, description, images, city
- **Не** собирает: cookies, localStorage, phone numbers
- Копирует JSON в clipboard, открывает `/admin/import?mode=browser-page`

## 5. Manual JSON paste

Textarea на `/admin/import` → POST `/api/admin/import/browser-page`.

Fallback: HTML paste (Inspect / View Source) — менее надёжен для SPA.

## 6. API `/api/admin/import/browser-page`

- Staff only (`requireStaff`)
- Limits: HTML 2 MB, bodyText 200 KB, images max 20
- Raw HTML **не сохраняется** — только parsed fields
- Rejects: cookies, localStorage, phone fields

## 7. Extracted fields

Service: `src/server/import/browser-page-import.ts`

Priority:
1. `extracted` from bookmarklet
2. Parsed HTML (Lalafo extractor / OG meta)
3. bodyText regex (price, description)
4. pageTitle / meta
5. URL slug fallback

## 8. Image handling

- External URLs only (no server download)
- Filter: logo, icon, avatar, svg, tracking
- Max 10 images in draft

## 9. Price extraction

Regex: `53 000 KGS`, `сом`, `Договорная`. Excludes phone context (`+996`, whatsapp, телефон).

## 10. Security / privacy

- Admin/moderator only
- No cookies/localStorage accepted
- No phone reveal automation
- No raw HTML in DB
- No auto publish
- No crawler

## 11. Limitations

- Requires manual staff action per listing
- Bookmarklet cross-origin cannot POST with session cookies — MVP uses clipboard paste
- SPA HTML paste often useless without bookmarklet
- No bulk browser-side import in Phase 159

## 12. Blocked page handling (server render)

When Playwright sees protection page:
- HTTP **409** (`SOURCE_BLOCKED`) only if no slug fallback possible
- Reextract render mode: HTTP **200** with slug fallback + `extractionQuality: BLOCKED`
- Message: «Используйте ручной импорт из браузера»

## 13. Future

- Chrome extension with authenticated POST
- Official Lalafo partner API
- Image rehosting CDN
- Bulk manual import queue

## Migration

Нет.
