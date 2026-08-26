import { ImportQueueStatus } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";

export async function recalculateImportBatchCounts(batchId: string) {
  const grouped = await prisma.importQueueItem.groupBy({
    by: ["status"],
    where: { batch_id: batchId },
    _count: { _all: true },
  });

  const countByStatus = new Map(grouped.map((row) => [row.status, row._count._all]));

  const pendingCount = countByStatus.get(ImportQueueStatus.PENDING) ?? 0;
  const processingCount = countByStatus.get(ImportQueueStatus.PROCESSING) ?? 0;
  const successCount = countByStatus.get(ImportQueueStatus.SUCCESS) ?? 0;
  const failedCount = countByStatus.get(ImportQueueStatus.FAILED) ?? 0;
  const duplicateCount = countByStatus.get(ImportQueueStatus.DUPLICATE) ?? 0;
  const skippedCount = countByStatus.get(ImportQueueStatus.SKIPPED) ?? 0;

  const completedAt =
    pendingCount === 0 && processingCount === 0 ? new Date() : null;

  await prisma.importBatch.update({
    where: { id: batchId },
    data: {
      pending_count: pendingCount,
      processing_count: processingCount,
      success_count: successCount,
      failed_count: failedCount,
      duplicate_count: duplicateCount,
      skipped_count: skippedCount,
      completed_at: completedAt,
    },
  });

  return {
    pending_count: pendingCount,
    processing_count: processingCount,
    success_count: successCount,
    failed_count: failedCount,
    duplicate_count: duplicateCount,
    skipped_count: skippedCount,
    completedAt,
  };
}
