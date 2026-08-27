# Bulk Import Queue — Phase 149

## 1. Цель

Дать админу возможность вставить список ссылок (Lalafo, Instagram limited, website) и обработать их очередью с созданием `ImportedListingDraft` для ручной проверки.

Поток:

`URLs textarea → ImportBatch → ImportQueueItem[] → process chunks → drafts → admin review → publish`

## 2. Почему нужен bulk import

Phase 147 добавил import by URL для одной ссылки. Для наполнения каталога нужен массовый сценарий: десятки объявлений за раз без повторного copy-paste.

## 3. Batch model

Prisma `ImportBatch` (`import_batches`):

- `source_platform` (optional, auto detect if null)
- counters: `total_count`, `pending_count`, `processing_count`, `success_count`, `failed_count`, `duplicate_count`, `skipped_count`
- `created_by_id`, `created_at`, `completed_at`

## 4. Queue item model

Prisma `ImportQueueItem` (`import_queue_items`):

- `batch_id`, `url`, `source_platform`
- `status`: `ImportQueueStatus` — PENDING, PROCESSING, SUCCESS, FAILED, DUPLICATE, SKIPPED
- `error_message`, `draft_id`, `duplicate_draft_id`
- `processed_at`

Migration: `20260826140000_import_bulk_queue`

## 5. UI flow

- `/admin/import` — блок «Массовый импорт» (textarea + source select)
- Submit → `POST /api/admin/import/bulk` → redirect `/admin/import/batches/[id]`
- Batch page: summary, progress bar, items table, «Обработать следующие»
- `/admin/import` — последние batches, фильтры черновиков (готовые, ошибки, дубли)

## 6. Processing flow

- MVP без cron/worker/Redis
- `POST /api/admin/import/batches/[id]/process` обрабатывает до **8** pending items за вызов
- Каждый item использует **тот же** `importListingDraftFromUrl` service, что Phase 147
- Admin нажимает «Обработать следующие» повторно, пока есть pending
- SSRF protection, timeout, max response size — без изменений

## 7. Limits

- Max **100** URLs per batch
- Max **8** URLs per process API call (configurable 1–10)
- Reuses `importListingDraftFromUrl` with improved error codes (Phase 151)
- Timeout per URL ~12 sec (existing safe fetch)
- No image download, no headless browser

## 8. Duplicate handling

При создании batch и перед обработкой item:

- existing draft with same `source_url` → DUPLICATE
- existing queue item SUCCESS/PENDING → DUPLICATE
- published listing link via draft → DUPLICATE

UI: «Уже импортировано» + ссылка на draft

## 9. Retry

- FAILED / SKIPPED items → кнопка «Повторить»
- `POST /api/admin/import/batches/[id]/items/[itemId]/retry`
- SKIPPED manually → `POST .../skip`

## 10. Review flow

- «Открыть готовые черновики» → `/admin/import?batchId=...&status=READY`
- «Следующий черновик» на `/admin/import/[id]?batchId=...`
- No auto-publish

## 11. Security

- Admin/moderator only APIs
- Same SSRF rules as import by URL
- No raw HTML/stack traces in UI
- `rawContact` not published

## 12. Limitations

- Sequential processing in request (not background worker)
- No category crawler
- No Instagram login
- No CAPTCHA bypass
- External images not rehosted

## 13. Future

- Background worker / scheduled import
- Redis/BullMQ queue
- Category crawler (consent-based)
- Image rehosting
- AI normalization
- OCR screenshots
- Partner consent workflow

## Файлы

| File | Purpose |
|---|---|
| `prisma/schema.prisma` | ImportBatch, ImportQueueItem, ImportQueueStatus |
| `src/features/import-batches/**` | create, process, retry, serializers |
| `src/app/api/admin/import/bulk/route.ts` | Create batch |
| `src/app/api/admin/import/batches/**` | Get/process/retry/skip |
| `src/components/admin/BulkImportForm.tsx` | Bulk UI |
| `src/components/admin/ImportBatchPanel.tsx` | Batch page panel |
