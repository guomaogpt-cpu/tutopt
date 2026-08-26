import { ImportQueueStatus } from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";
import { findExistingImportForUrl } from "@/features/import-batches/lib/check-url-duplicate";
import { serializeImportBatchDetail } from "@/features/import-batches/lib/import-batch-serializer";
import { recalculateImportBatchCounts } from "@/features/import-batches/lib/recalculate-batch-counts";
import type { ImportSourcePlatform } from "@/features/import-drafts/types/import-draft";
import { detectImportPlatform } from "@/server/import/detect-platform";
import { validateImportUrl } from "@/server/import/safe-fetch-url";
import { ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

function resolveBatchSourcePlatform(
  value: ImportSourcePlatform | "AUTO" | null | undefined,
): ImportSourcePlatform | null {
  if (!value || value === "AUTO") {
    return null;
  }
  return value;
}

function resolveItemPlatform(
  url: URL,
  batchPlatform: ImportSourcePlatform | null,
): ImportSourcePlatform {
  return detectImportPlatform(url, batchPlatform);
}

export async function createImportBatch(params: {
  urls: string[];
  sourcePlatform?: ImportSourcePlatform | "AUTO" | null;
  staff: PublicUser;
}) {
  if (params.urls.length === 0) {
    throw new ValidationError("Вставьте хотя бы одну ссылку.");
  }

  const batchPlatform = resolveBatchSourcePlatform(params.sourcePlatform ?? null);
  const itemInputs: Array<{
    url: string;
    sourcePlatform: ImportSourcePlatform;
    status: ImportQueueStatus;
    errorMessage: string | null;
    duplicateDraftId: string | null;
    processedAt: Date | null;
  }> = [];

  for (const rawUrl of params.urls) {
    try {
      const parsedUrl = await validateImportUrl(rawUrl);
      const canonicalUrl = parsedUrl.toString();
      const platform = resolveItemPlatform(parsedUrl, batchPlatform);
      const existing = await findExistingImportForUrl(canonicalUrl);

      if (existing.isDuplicate) {
        itemInputs.push({
          url: canonicalUrl,
          sourcePlatform: platform,
          status: ImportQueueStatus.DUPLICATE,
          errorMessage: existing.reason,
          duplicateDraftId: existing.draftId,
          processedAt: new Date(),
        });
        continue;
      }

      itemInputs.push({
        url: canonicalUrl,
        sourcePlatform: platform,
        status: ImportQueueStatus.PENDING,
        errorMessage: null,
        duplicateDraftId: null,
        processedAt: null,
      });
    } catch (error) {
      itemInputs.push({
        url: rawUrl,
        sourcePlatform: batchPlatform ?? "WEBSITE",
        status: ImportQueueStatus.SKIPPED,
        errorMessage:
          error instanceof ValidationError
            ? error.message
            : "Некорректная ссылка",
        duplicateDraftId: null,
        processedAt: new Date(),
      });
    }
  }

  const batch = await prisma.importBatch.create({
    data: {
      source_platform: batchPlatform,
      total_count: itemInputs.length,
      pending_count: itemInputs.filter((item) => item.status === ImportQueueStatus.PENDING).length,
      duplicate_count: itemInputs.filter((item) => item.status === ImportQueueStatus.DUPLICATE).length,
      skipped_count: itemInputs.filter((item) => item.status === ImportQueueStatus.SKIPPED).length,
      created_by_id: params.staff.id,
      items: {
        create: itemInputs.map((item) => ({
          url: item.url,
          source_platform: item.sourcePlatform,
          status: item.status,
          error_message: item.errorMessage,
          duplicate_draft_id: item.duplicateDraftId,
          processed_at: item.processedAt,
        })),
      },
    },
    include: {
      items: {
        orderBy: { created_at: "asc" },
      },
    },
  });

  await recalculateImportBatchCounts(batch.id);

  const refreshed = await prisma.importBatch.findUniqueOrThrow({
    where: { id: batch.id },
    include: {
      items: {
        orderBy: { created_at: "asc" },
      },
    },
  });

  return serializeImportBatchDetail(refreshed, refreshed.items);
}
