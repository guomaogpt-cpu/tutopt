import { z } from "zod";
import { IMPORT_SOURCE_PLATFORMS } from "@/features/import-drafts/types/import-draft";

const optionalTrimmed = z.string().trim().optional().nullable();

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.string().url("Укажите корректную ссылку").optional().nullable(),
);

export const createImportDraftSchema = z.object({
  sourcePlatform: z.enum(IMPORT_SOURCE_PLATFORMS),
  sourceUrl: optionalUrl,
  sourceExternalId: optionalTrimmed,
  title: optionalTrimmed,
  description: optionalTrimmed,
  price: optionalTrimmed,
  currency: optionalTrimmed,
  city: optionalTrimmed,
  category: optionalTrimmed,
  subcategory: optionalTrimmed,
  imageUrlsText: optionalTrimmed,
  rawContact: optionalTrimmed,
  notes: optionalTrimmed,
});

export type CreateImportDraftInput = z.infer<typeof createImportDraftSchema>;

export const updateImportDraftSchema = createImportDraftSchema.partial().extend({
  status: z
    .enum(["PENDING_REVIEW", "READY", "REJECTED", "DUPLICATE", "PUBLISHED", "FAILED"])
    .optional(),
  duplicateOfListingId: z.string().uuid().optional().nullable(),
});

export type UpdateImportDraftInput = z.infer<typeof updateImportDraftSchema>;

export const markDuplicateImportDraftSchema = z.object({
  duplicateOfListingId: z.string().uuid().optional().nullable(),
});

export type MarkDuplicateImportDraftInput = z.infer<typeof markDuplicateImportDraftSchema>;
