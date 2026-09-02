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

export const importByUrlSchema = z.object({
  url: z.string().trim().url("Укажите корректную ссылку"),
  sourcePlatform: z.enum(IMPORT_SOURCE_PLATFORMS).optional().nullable(),
  forceNew: z.boolean().optional(),
});

export type ImportByUrlInput = z.infer<typeof importByUrlSchema>;

const browserPageExtractedSchema = z
  .object({
    title: z.string().trim().optional(),
    price: z.string().trim().optional(),
    currency: z.string().trim().optional(),
    description: z.string().trim().optional(),
    city: z.string().trim().optional(),
    images: z.array(z.string().url()).max(20).optional(),
  })
  .strict();

export const browserPageImportSchema = z
  .object({
    sourceUrl: z.string().trim().url("Укажите корректную ссылку"),
    sourcePlatform: z.enum(["LALAFO", "WEBSITE", "OTHER"]),
    pageTitle: z.string().trim().max(500).optional(),
    bodyText: z.string().max(204_800).optional(),
    html: z.string().max(2_097_152).optional(),
    images: z.array(z.string().url()).max(20).optional(),
    extracted: browserPageExtractedSchema.optional(),
  })
  .strict();

export type BrowserPageImportInput = z.infer<typeof browserPageImportSchema>;
