import { ImportQueueStatus } from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";
import { findExistingImportForUrl } from "@/features/import-batches/lib/check-url-duplicate";
import { serializeImportBatchDetail } from "@/features/import-batches/lib/import-batch-serializer";
import { recalculateImportBatchCounts } from "@/features/import-batches/lib/recalculate-batch-counts";
import { PROCESS_BATCH_SIZE } from "@/features/import-batches/types/import-batch";
import type { ImportSourcePlatform } from "@/features/import-drafts/types/import-draft";
import { importListingDraftFromUrl, getImportErrorDetails } from "@/server/import/import-by-url-service";
import { ValidationError } from "@/shared/lib/errors";
import { NotFoundError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

function mapImportError(error: unknown): string {
  if (error instanceof ValidationError) {
    return getImportErrorDetails(error).message;
  }
  return "Не удалось обработать ссылку";
}

async function processQueueItem(params: {
  itemId: string;
  url: string;
  sourcePlatform: ImportSourcePlatform;
  staff: PublicUser;
}) {
  const existing = await findExistingImportForUrl(params.url);
  if (existing.isDuplicate) {
    await prisma.importQueueItem.update({
      where: { id: params.itemId },
      data: {
        status: ImportQueueStatus.DUPLICATE,
        error_message: existing.reason,
        duplicate_draft_id: existing.draftId,
        processed_at: new Date(),
      },
    });
    return;
  }

  try {
    const result = await importListingDraftFromUrl({
      url: params.url,
      sourcePlatform: params.sourcePlatform,
      staff: params.staff,
      allowRender: false,
    });

    if (result.duplicate) {
      await prisma.importQueueItem.update({
        where: { id: params.itemId },
        data: {
          status: ImportQueueStatus.DUPLICATE,
          error_message: "Уже импортировано",
          duplicate_draft_id: result.draft.id,
          processed_at: new Date(),
        },
      });
      return;
    }

    await prisma.importQueueItem.update({
      where: { id: params.itemId },
      data: {
        status: ImportQueueStatus.SUCCESS,
        draft_id: result.draft.id,
        error_message: null,
        processed_at: new Date(),
      },
    });
  } catch (error) {
    await prisma.importQueueItem.update({
      where: { id: params.itemId },
      data: {
        status: ImportQueueStatus.FAILED,
        error_message: mapImportError(error),
        processed_at: new Date(),
      },
    });
  }
}

export async function processImportBatch(params: {
  batchId: string;
  staff: PublicUser;
  limit?: number;
}) {
  const batch = await prisma.importBatch.findUnique({
    where: { id: params.batchId },
  });

  if (!batch) {
    throw new NotFoundError("Import batch not found");
  }

  const limit = params.limit ?? PROCESS_BATCH_SIZE;

  const pendingItems = await prisma.importQueueItem.findMany({
    where: {
      batch_id: params.batchId,
      status: ImportQueueStatus.PENDING,
    },
    orderBy: { created_at: "asc" },
    take: limit,
  });

  for (const item of pendingItems) {
    await prisma.importQueueItem.update({
      where: { id: item.id },
      data: { status: ImportQueueStatus.PROCESSING },
    });

    await processQueueItem({
      itemId: item.id,
      url: item.url,
      sourcePlatform: item.source_platform as ImportSourcePlatform,
      staff: params.staff,
    });
  }

  await recalculateImportBatchCounts(params.batchId);

  const refreshed = await prisma.importBatch.findUniqueOrThrow({
    where: { id: params.batchId },
    include: {
      items: {
        orderBy: { created_at: "asc" },
      },
    },
  });

  return serializeImportBatchDetail(refreshed, refreshed.items);
}

export async function retryImportQueueItem(params: {
  batchId: string;
  itemId: string;
  staff: PublicUser;
}) {
  const item = await prisma.importQueueItem.findFirst({
    where: {
      id: params.itemId,
      batch_id: params.batchId,
    },
  });

  if (!item) {
    throw new NotFoundError("Queue item not found");
  }

  if (item.status !== ImportQueueStatus.FAILED && item.status !== ImportQueueStatus.SKIPPED) {
    throw new ValidationError("Повтор доступен только для ошибочных или пропущенных ссылок.");
  }

  await prisma.importQueueItem.update({
    where: { id: item.id },
    data: {
      status: ImportQueueStatus.PROCESSING,
      error_message: null,
      draft_id: null,
      duplicate_draft_id: null,
      processed_at: null,
    },
  });

  await processQueueItem({
    itemId: item.id,
    url: item.url,
    sourcePlatform: item.source_platform as ImportSourcePlatform,
    staff: params.staff,
  });

  await recalculateImportBatchCounts(params.batchId);

  const refreshed = await prisma.importQueueItem.findUniqueOrThrow({
    where: { id: item.id },
  });

  return refreshed;
}

export async function skipImportQueueItem(params: {
  batchId: string;
  itemId: string;
}) {
  const item = await prisma.importQueueItem.findFirst({
    where: {
      id: params.itemId,
      batch_id: params.batchId,
    },
  });

  if (!item) {
    throw new NotFoundError("Queue item not found");
  }

  if (item.status === ImportQueueStatus.SUCCESS || item.status === ImportQueueStatus.DUPLICATE) {
    throw new ValidationError("Нельзя пропустить уже обработанную ссылку.");
  }

  await prisma.importQueueItem.update({
    where: { id: item.id },
    data: {
      status: ImportQueueStatus.SKIPPED,
      error_message: "Пропущено вручную",
      processed_at: new Date(),
    },
  });

  await recalculateImportBatchCounts(params.batchId);

  return prisma.importQueueItem.findUniqueOrThrow({
    where: { id: item.id },
  });
}

export async function getImportBatchDetail(batchId: string) {
  const batch = await prisma.importBatch.findUnique({
    where: { id: batchId },
    include: {
      items: {
        orderBy: { created_at: "asc" },
      },
    },
  });

  if (!batch) {
    throw new NotFoundError("Import batch not found");
  }

  return serializeImportBatchDetail(batch, batch.items);
}
