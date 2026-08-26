import { ImportDraftStatus } from "@prisma/client";
import { checkImportDraftDuplicates } from "@/features/import-drafts/lib/duplicate-check";
import {
  buildImportDraftCreateData,
  serializeImportDraft,
} from "@/features/import-drafts/lib/import-draft-serializer";
import {
  isImportDraftReadyForReview,
  normalizeImportDraftFields,
} from "@/features/import-drafts/lib/normalize-import-draft";
import type {
  CreateImportDraftInput,
  UpdateImportDraftInput,
} from "@/features/import-drafts/validators/import-draft.validators";
import type { PublicUser } from "@/features/auth/lib/session";
import { NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

function resolveInitialStatus(params: {
  isDefiniteDuplicate: boolean;
  isReady: boolean;
}): ImportDraftStatus {
  if (params.isDefiniteDuplicate) {
    return ImportDraftStatus.DUPLICATE;
  }
  if (params.isReady) {
    return ImportDraftStatus.READY;
  }
  return ImportDraftStatus.PENDING_REVIEW;
}

export async function createImportDraftRecord(params: {
  input: CreateImportDraftInput;
  staff: PublicUser;
}) {
  const normalized = normalizeImportDraftFields({
    sourceUrl: params.input.sourceUrl,
    title: params.input.title,
    description: params.input.description,
    price: params.input.price,
    currency: params.input.currency,
    city: params.input.city,
    category: params.input.category,
    subcategory: params.input.subcategory,
    imageUrlsText: params.input.imageUrlsText,
  });

  const duplicateCheck = await checkImportDraftDuplicates({
    sourceUrl: normalized.sourceUrl,
    sourceExternalId: params.input.sourceExternalId,
    title: normalized.normalizedTitle ?? params.input.title,
    price: params.input.price,
    city: normalized.normalizedCity ?? params.input.city,
  });

  const isReady = isImportDraftReadyForReview({
    normalizedTitle: normalized.normalizedTitle,
    normalizedCategory: normalized.normalizedCategory,
    normalizedSubcategory: normalized.normalizedSubcategory,
    normalizedCity: normalized.normalizedCity,
    rawCity: params.input.city ?? null,
  });

  const status = resolveInitialStatus({
    isDefiniteDuplicate: duplicateCheck.isDefiniteDuplicate,
    isReady,
  });

  const draft = await prisma.importedListingDraft.create({
    data: buildImportDraftCreateData({
      input: params.input,
      normalized,
      status,
      createdById: params.staff.id,
      duplicateOfListingId: duplicateCheck.duplicateListingId,
    }),
  });

  return serializeImportDraft(draft, duplicateCheck.warnings);
}

export async function updateImportDraftRecord(params: {
  draftId: string;
  input: UpdateImportDraftInput;
  staff: PublicUser;
}) {
  const existing = await prisma.importedListingDraft.findUnique({
    where: { id: params.draftId },
  });

  if (!existing) {
    throw new NotFoundError("Import draft not found");
  }

  if (existing.status === ImportDraftStatus.PUBLISHED) {
    throw new ValidationError("Опубликованный черновик нельзя редактировать.");
  }

  const merged = {
    sourceUrl: params.input.sourceUrl ?? existing.source_url,
    title: params.input.title ?? existing.raw_title,
    description: params.input.description ?? existing.raw_description,
    price: params.input.price ?? existing.raw_price,
    currency: params.input.currency ?? existing.raw_currency,
    city: params.input.city ?? existing.raw_city,
    category: params.input.category ?? existing.normalized_category,
    subcategory: params.input.subcategory ?? existing.normalized_subcategory,
    imageUrlsText:
      params.input.imageUrlsText ??
      [...(Array.isArray(existing.raw_images) ? (existing.raw_images as string[]) : [])].join("\n"),
  };

  const normalized = normalizeImportDraftFields(merged);

  const duplicateCheck = await checkImportDraftDuplicates({
    sourceUrl: normalized.sourceUrl,
    sourceExternalId: params.input.sourceExternalId ?? existing.source_external_id,
    title: normalized.normalizedTitle ?? merged.title,
    price: merged.price,
    city: normalized.normalizedCity ?? merged.city,
    excludeDraftId: existing.id,
  });

  let nextStatus = params.input.status ?? existing.status;

  if (!params.input.status && existing.status !== ImportDraftStatus.REJECTED) {
    if (duplicateCheck.isDefiniteDuplicate) {
      nextStatus = ImportDraftStatus.DUPLICATE;
    } else if (
      isImportDraftReadyForReview({
        normalizedTitle: normalized.normalizedTitle,
        normalizedCategory: normalized.normalizedCategory,
        normalizedSubcategory: normalized.normalizedSubcategory,
        normalizedCity: normalized.normalizedCity,
        rawCity: merged.city,
      })
    ) {
      nextStatus = ImportDraftStatus.READY;
    } else {
      nextStatus = ImportDraftStatus.PENDING_REVIEW;
    }
  }

  const draft = await prisma.importedListingDraft.update({
    where: { id: existing.id },
    data: {
      source_platform: params.input.sourcePlatform ?? existing.source_platform,
      source_url: normalized.sourceUrl,
      source_external_id: params.input.sourceExternalId ?? existing.source_external_id,
      raw_title: merged.title,
      raw_description: merged.description,
      raw_price: merged.price,
      raw_currency: merged.currency,
      raw_city: merged.city,
      raw_images: normalized.rawImages,
      raw_contact: params.input.rawContact ?? existing.raw_contact,
      normalized_title: normalized.normalizedTitle,
      normalized_description: normalized.normalizedDescription,
      normalized_price: normalized.normalizedPrice,
      normalized_currency: normalized.normalizedCurrency,
      normalized_city: normalized.normalizedCity,
      normalized_category: normalized.normalizedCategory,
      normalized_subcategory: normalized.normalizedSubcategory,
      normalized_images: normalized.normalizedImages,
      notes: params.input.notes ?? existing.notes,
      status: nextStatus,
      duplicate_of_listing_id:
        params.input.duplicateOfListingId ??
        (duplicateCheck.isDefiniteDuplicate ? duplicateCheck.duplicateListingId : null),
      reviewed_by_id: params.staff.id,
      reviewed_at: new Date(),
    },
  });

  return serializeImportDraft(draft, duplicateCheck.warnings);
}

export async function setImportDraftStatus(params: {
  draftId: string;
  status: ImportDraftStatus;
  staff: PublicUser;
  duplicateOfListingId?: string | null;
}) {
  const existing = await prisma.importedListingDraft.findUnique({
    where: { id: params.draftId },
  });

  if (!existing) {
    throw new NotFoundError("Import draft not found");
  }

  if (existing.status === ImportDraftStatus.PUBLISHED) {
    throw new ValidationError("Опубликованный черновик нельзя изменить.");
  }

  const draft = await prisma.importedListingDraft.update({
    where: { id: params.draftId },
    data: {
      status: params.status,
      duplicate_of_listing_id:
        params.status === ImportDraftStatus.DUPLICATE
          ? (params.duplicateOfListingId ?? existing.duplicate_of_listing_id)
          : existing.duplicate_of_listing_id,
      reviewed_by_id: params.staff.id,
      reviewed_at: new Date(),
    },
  });

  return serializeImportDraft(draft);
}
