import type { ImportBatch, ImportQueueItem } from "@prisma/client";
import type { ImportBatchDetail, ImportBatchRow, ImportQueueItemRow } from "@/features/import-batches/types/import-batch";

export function serializeImportQueueItem(item: ImportQueueItem): ImportQueueItemRow {
  return {
    id: item.id,
    batchId: item.batch_id,
    url: item.url,
    sourcePlatform: item.source_platform,
    status: item.status,
    errorMessage: item.error_message,
    draftId: item.draft_id,
    duplicateDraftId: item.duplicate_draft_id,
    createdAt: item.created_at.toISOString(),
    updatedAt: item.updated_at.toISOString(),
    processedAt: item.processed_at?.toISOString() ?? null,
  };
}

export function serializeImportBatch(batch: ImportBatch): ImportBatchRow {
  return {
    id: batch.id,
    sourcePlatform: batch.source_platform,
    totalCount: batch.total_count,
    pendingCount: batch.pending_count,
    processingCount: batch.processing_count,
    successCount: batch.success_count,
    failedCount: batch.failed_count,
    duplicateCount: batch.duplicate_count,
    skippedCount: batch.skipped_count,
    createdAt: batch.created_at.toISOString(),
    updatedAt: batch.updated_at.toISOString(),
    completedAt: batch.completed_at?.toISOString() ?? null,
  };
}

export function serializeImportBatchDetail(
  batch: ImportBatch,
  items: ImportQueueItem[],
): ImportBatchDetail {
  return {
    ...serializeImportBatch(batch),
    items: items.map(serializeImportQueueItem),
  };
}
