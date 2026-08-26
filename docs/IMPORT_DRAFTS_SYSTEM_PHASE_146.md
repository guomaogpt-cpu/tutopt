# Import Drafts System — Phase 146

## 1. Цель

Добавить безопасный внутренний механизм импорта объявлений из внешних источников через черновики с ручной проверкой администратором/модератором перед публикацией.

Поток:

`external source → import draft → normalize → duplicate check → admin review → publish listing`

## 2. Почему не делаем прямой автопарсинг

- Нельзя автоматически публиковать чужие объявления без проверки.
- Нельзя массово копировать номера телефонов и персональные данные.
- Нельзя обходить CAPTCHA и защиты сайтов.
- Instagram login bot и scraping workers — вне scope этой фазы.
- Публикация всегда проходит через review и существующую модерацию объявлений.

## 3. ImportedListingDraft model

Prisma-модель `ImportedListingDraft` (`imported_listing_drafts`):

- **Источник:** `source_platform`, `source_url`, `source_external_id`
- **Raw поля:** title, description, price, currency, city, images (Json), contact
- **Normalized поля:** title, description, price, currency, city, category, subcategory, images (Json)
- **Статус:** `ImportDraftStatus` — `PENDING_REVIEW`, `READY`, `REJECTED`, `DUPLICATE`, `PUBLISHED`, `FAILED`
- **Связи:** `createdBy`, `reviewedBy`, `publishedListing`, `duplicateOfListing`

Migration: `20260826120000_import_listing_drafts`

## 4. Admin import flow

- `/admin/import` — **Import by URL** (главный сценарий) + список черновиков + ручной импорт (только ADMIN/MODERATOR)
- `/admin/import/[id]` — детальная страница черновика с raw/normalized данными, auto-extracted banner и actions
- Пункт «Импорт» в `AdminNav`

## 4.1 Import by URL (Phase 147)

- Блок «Импорт по ссылке» на `/admin/import`
- API: `POST /api/admin/import/by-url`
- Lalafo / Instagram (limited) / Website extractors
- SSRF-safe fetch, category mapping, duplicate by URL
- См. `docs/IMPORT_BY_URL_AGENT_PHASE_147.md`

## 4.2 Bulk Import Queue (Phase 149)

- Блок «Массовый импорт» на `/admin/import`
- API: `POST /api/admin/import/bulk`, `POST /api/admin/import/batches/[id]/process`
- Страница `/admin/import/batches/[id]` — progress, retry, duplicate handling
- См. `docs/BULK_IMPORT_QUEUE_PHASE_149.md`

## 5. Manual import

Форма ручного импорта:

- Источник: MANUAL / LALAFO / INSTAGRAM / WEBSITE / OTHER
- Ссылка, название, описание, цена, валюта, город, категория, подкатегория
- Фото URLs (textarea, по одной ссылке на строку)
- `rawContact` — внутреннее поле, не публикуется
- Заметки модератора

API: `POST /api/admin/import-drafts`

## 6. Normalization MVP

Без обязательного AI:

- trim текста, collapse whitespace
- parse price string → Decimal
- currency uppercase (KGS по умолчанию)
- parse image URLs из textarea (только http/https)
- validate source URL
- title/description max length

Статус `READY` — если заполнены title, category/subcategory, city.

## 7. Duplicate check MVP

При создании/обновлении:

- exact match `source_url` среди drafts
- exact match `source_external_id`
- похожий title + price + city среди listings и drafts

Явный дубль → `status = DUPLICATE`.  
Неуверенный случай → warning «Возможный дубль — проверьте вручную».

## 8. Publish to Listing

API: `POST /api/admin/import-drafts/[id]/publish`

- Только staff
- Draft status: `READY` или `PENDING_REVIEW`
- Title обязателен; category резолвится по **valid slug** (leaf subcategory), city — по name/slug
- Listing создаётся со статусом `PENDING_MODERATION` (существующий moderation flow)
- Owner: seller profile текущего admin/moderator (`ensureSellerProfile`)
- Images: external URLs сохраняются как есть (без server-side download)
- После publish: draft → `PUBLISHED`, `published_listing_id`, `published_at`

**Limitation:** импортированные объявления пока принадлежат администратору; позже можно добавить системного продавца/партнёра.

## 9. Security/privacy

- `/admin/import` и все API — только admin/moderator
- `rawContact` виден только в admin UI, не попадает в Listing
- sourceUrl — plain link, не HTML
- image URLs — только http/https validation, без SSRF download
- no `any`, no raw stack traces in UI

## 10. Limitations

- Нет Lalafo scraper, Instagram bot, cron workers
- Нет automatic publishing
- Нет AI normalization (можно добавить позже)
- Нет image duplicate detection
- Нет system import user (owner = current staff)
- External images не скачиваются на сервер

## 11. Future

- ~~Lalafo importer (respectful, with consent)~~ → Phase 147 MVP (single URL, no bulk)
- Instagram link importer (official/manual) — Phase 147 limited OG only
- Screenshot OCR importer
- AI normalization (optional button)
- Image duplicate detection
- System import user / partner consent workflow
- Bulk import queue with workers

## Файлы

| File | Purpose |
|---|---|
| `prisma/schema.prisma` | `ImportedListingDraft`, `ImportDraftStatus` |
| `src/features/import-drafts/**` | normalize, duplicate, publish, validators |
| `src/app/api/admin/import-drafts/**` | CRUD + status + publish APIs |
| `src/app/api/admin/import/by-url/route.ts` | Import by URL (Phase 147) |
| `src/app/api/admin/import/bulk/route.ts` | Bulk import queue (Phase 149) |
| `src/server/import/**` | Extractors, SSRF-safe fetch (Phase 147) |
| `src/features/import-batches/**` | Batch queue processing (Phase 149) |
| `src/app/admin/import/**` | Admin pages |
| `src/components/admin/ImportDraft*.tsx` | UI components |

## Migration

Да — `20260826120000_import_listing_drafts`
