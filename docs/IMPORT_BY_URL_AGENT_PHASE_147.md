# Import by URL Agent — Phase 147

## 1. Цель

Дать админу/модератору возможность вставить ссылку на объявление (Lalafo, Instagram, обычный сайт) и автоматически получить заполненный `ImportedListingDraft` для ручной проверки и публикации.

Поток:

`URL → safe fetch → extract → normalize → category map → duplicate check → import draft → admin review → publish listing`

## 2. Почему Phase 146 было недостаточно

Phase 146 добавила ручной импорт и publish flow, но админ всё равно вводил title, price, city, description, photos и category вручную. Это не снимало основную боль — перенос объявления с внешней площадки.

Phase 147 добавляет **Import by URL Agent MVP**: один URL → автозаполнение draft без auto-publish.

Phase 149 добавляет **Bulk Import Queue**: список URL → batch → очередь → drafts (см. `docs/BULK_IMPORT_QUEUE_PHASE_149.md`).

## 3. Import by URL flow

1. Admin открывает `/admin/import`
2. В блоке «Импорт по ссылке» вставляет URL
3. `POST /api/admin/import/by-url`
4. Сервер: validate URL → detect platform → safe fetch → extract → normalize → duplicate check → create draft
5. Redirect на `/admin/import/[id]` с preview raw/normalized данных
6. Admin проверяет, при необходимости выбирает категорию из select (реальные slug)
7. Publish → Listing `PENDING_MODERATION`

## 4. Lalafo extractor MVP

Модуль: `src/server/import/extractors/lalafo.ts`

Источники данных (по приоритету):

1. JSON-LD (`Product` / `Offer`)
2. OpenGraph (`og:title`, `og:description`, `og:image`)
3. HTML: h1, price block, city, breadcrumbs, poster images
4. Fallback regex (title parts, price text)

Извлекается: title, description, price, currency, city, category/subcategory text, breadcrumb slugs, images, phone (если явно в HTML), `sourceExternalId` из URL.

Ограничения: без login, без browser automation, без обхода скрытия телефона.

## 5. Instagram limited MVP

Модуль: `src/server/import/extractors/instagram.ts`

Только публичные OG/meta tags без авторизации. Если данных нет — понятная ошибка или FAILED draft с рекомендацией ручного ввода.

## 6. Website fallback

Модуль: `src/server/import/extractors/website.ts`

OpenGraph + JSON-LD + title/meta description. Price и category необязательны. Draft создаётся со статусом `PENDING_REVIEW`.

## 7. Category mapping

Модуль: `src/server/import/category-mapper.ts`

- Keyword rules (фасовщик, упаковка → `market-eq-upakovochnoe`, авто → `market-avto-i-moto`, и т.д.)
- Lalafo breadcrumb slug map (`zapayshchiki-paketov` → upakovochnoe)
- Если mapping не уверен → `normalizedCategory = null`, warning «Укажите категорию перед публикацией»

UI: `ImportCategorySelect` — select с реальными slug из справочника категорий проекта.

Publish: `resolveImportCategorySlug` резолвит slug → `categoryId` + `vertical`.

## 8. Draft creation

После extract создаётся `ImportedListingDraft`:

- `sourcePlatform`, `sourceUrl`, `sourceExternalId`
- raw + normalized поля
- `rawContact` — internal only
- `rawImages` / `normalizedImages` — external URLs (без download)
- status: `READY` | `PENDING_REVIEW` | `DUPLICATE`

## 9. Publish flow

Без изменений Phase 146, но исправлен category resolution:

- Publish требует valid category slug (leaf subcategory)
- Display text («для бизнеса») больше не считается valid category
- Admin выбирает категорию через select перед publish

## 10. Duplicate check

Перед созданием draft:

- exact match `source_url` среди drafts → возврат существующего draft + «Такой источник уже импортировался»
- duplicate check по title + price + city + external id

## 11. Security / SSRF protection

Модуль: `src/server/import/safe-fetch-url.ts`

- Только `http`/`https`
- Block: localhost, private IPs, link-local, metadata endpoints
- DNS resolve + IP check перед fetch
- Redirect limit (3), redirect target re-validated
- Timeout 12s, max body 2MB
- No headless browser, no script execution, no image download
- Admin/moderator only API

## 12. Limitations

- Один URL за раз, не bulk import
- Нет crawler по категориям
- Нет CAPTCHA bypass
- Instagram — только OG, часто недостаточно
- Телефон может быть недоступен без JS/auth
- External images не rehost
- Owner listing = текущий staff (как Phase 146)

## 13. Future

- Browser automation worker (consent-based)
- Screenshot OCR importer
- AI normalization button
- Bulk import queue
- Partner/consent workflow
- Image download/rehosting
- Phone verification before public display

## Файлы

| File | Purpose |
|---|---|
| `src/server/import/**` | safe fetch, extractors, category mapper |
| `src/app/api/admin/import/by-url/route.ts` | Import by URL API |
| `src/features/import-drafts/lib/resolve-import-category.ts` | Slug resolution for publish |
| `src/features/import-drafts/lib/get-import-category-options.ts` | Category options for UI |
| `src/components/admin/ImportByUrlForm.tsx` | URL import form |
| `src/components/admin/ImportCategorySelect.tsx` | Category select with real slugs |

## Migration

Нет — `ImportedListingDraft` из Phase 146 достаточен.
