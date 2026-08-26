import type { ImportedListingDraft, Prisma } from "@prisma/client";
import type { ImportDraftImageList, ImportDraftRow } from "@/features/import-drafts/types/import-draft";

function parseImageJson(value: Prisma.JsonValue | null): ImportDraftImageList {
  if (!value || !Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

export function serializeImportDraft(
  draft: ImportedListingDraft,
  warnings?: string[],
): ImportDraftRow {
  return {
    id: draft.id,
    sourcePlatform: draft.source_platform,
    sourceUrl: draft.source_url,
    rawTitle: draft.raw_title,
    rawDescription: draft.raw_description,
    rawPrice: draft.raw_price,
    rawCurrency: draft.raw_currency,
    rawCity: draft.raw_city,
    rawImages: parseImageJson(draft.raw_images),
    rawContact: draft.raw_contact,
    normalizedTitle: draft.normalized_title,
    normalizedDescription: draft.normalized_description,
    normalizedPrice: draft.normalized_price?.toString() ?? null,
    normalizedCurrency: draft.normalized_currency,
    normalizedCity: draft.normalized_city,
    normalizedCategory: draft.normalized_category,
    normalizedSubcategory: draft.normalized_subcategory,
    normalizedImages: parseImageJson(draft.normalized_images),
    notes: draft.notes,
    status: draft.status,
    duplicateOfListingId: draft.duplicate_of_listing_id,
    publishedListingId: draft.published_listing_id,
    createdAt: draft.created_at.toISOString(),
    updatedAt: draft.updated_at.toISOString(),
    reviewedAt: draft.reviewed_at?.toISOString() ?? null,
    publishedAt: draft.published_at?.toISOString() ?? null,
    ...(warnings && warnings.length > 0 ? { warnings } : {}),
  };
}

export function buildImportDraftCreateData(params: {
  input: {
    sourcePlatform: string;
    sourceUrl?: string | null;
    sourceExternalId?: string | null;
    title?: string | null;
    description?: string | null;
    price?: string | null;
    currency?: string | null;
    city?: string | null;
    category?: string | null;
    subcategory?: string | null;
    rawContact?: string | null;
    notes?: string | null;
  };
  normalized: {
    sourceUrl: string | null;
    normalizedTitle: string | null;
    normalizedDescription: string | null;
    normalizedPrice: Prisma.Decimal | null;
    normalizedCurrency: string | null;
    normalizedCity: string | null;
    normalizedCategory: string | null;
    normalizedSubcategory: string | null;
    normalizedImages: ImportDraftImageList;
    rawImages: ImportDraftImageList;
  };
  status: ImportedListingDraft["status"];
  createdById: string;
  duplicateOfListingId?: string | null;
}): Prisma.ImportedListingDraftUncheckedCreateInput {
  return {
    source_platform: params.input.sourcePlatform,
    source_url: params.normalized.sourceUrl,
    source_external_id: params.input.sourceExternalId ?? null,
    raw_title: params.input.title ?? null,
    raw_description: params.input.description ?? null,
    raw_price: params.input.price ?? null,
    raw_currency: params.input.currency ?? null,
    raw_city: params.input.city ?? null,
    raw_images: params.normalized.rawImages,
    raw_contact: params.input.rawContact ?? null,
    normalized_title: params.normalized.normalizedTitle,
    normalized_description: params.normalized.normalizedDescription,
    normalized_price: params.normalized.normalizedPrice,
    normalized_currency: params.normalized.normalizedCurrency,
    normalized_city: params.normalized.normalizedCity,
    normalized_category: params.normalized.normalizedCategory,
    normalized_subcategory: params.normalized.normalizedSubcategory,
    normalized_images: params.normalized.normalizedImages,
    notes: params.input.notes ?? null,
    status: params.status,
    duplicate_of_listing_id: params.duplicateOfListingId ?? null,
    created_by_id: params.createdById,
  };
}
