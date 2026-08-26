import { z } from "zod";
import { IMPORT_SOURCE_PLATFORMS } from "@/features/import-drafts/types/import-draft";
import { MAX_URLS_PER_BATCH } from "@/features/import-batches/types/import-batch";
import { ValidationError } from "@/shared/lib/errors";

const bulkSourcePlatformSchema = z
  .union([z.literal("AUTO"), z.enum(IMPORT_SOURCE_PLATFORMS)])
  .optional()
  .nullable();

export const createBulkImportSchema = z.object({
  urlsText: z.string().trim().min(1, "Вставьте хотя бы одну ссылку"),
  sourcePlatform: bulkSourcePlatformSchema,
});

export type CreateBulkImportInput = z.infer<typeof createBulkImportSchema>;

export const processImportBatchSchema = z.object({
  limit: z.number().int().min(1).max(10).optional(),
});

export type ProcessImportBatchInput = z.infer<typeof processImportBatchSchema>;

export function parseBulkImportUrls(urlsText: string): string[] {
  const lines = urlsText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const unique = [...new Set(lines)];

  if (unique.length > MAX_URLS_PER_BATCH) {
    throw new ValidationError(`Максимум ${MAX_URLS_PER_BATCH} ссылок за один импорт.`);
  }

  return unique;
}
