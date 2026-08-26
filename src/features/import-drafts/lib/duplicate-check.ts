import { ImportDraftStatus } from "@prisma/client";
import { normalizeListingTitleForDuplicate } from "@/lib/moderation/content-checks";
import { prisma } from "@/shared/lib/prisma";
import type { ImportDraftDuplicateResult } from "@/features/import-drafts/types/import-draft";

function normalizeComparablePrice(price: string | null | undefined): string | null {
  if (!price) {
    return null;
  }

  const parsed = Number.parseFloat(price.replace(",", "."));
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed.toFixed(2);
}

export async function checkImportDraftDuplicates(params: {
  sourceUrl?: string | null;
  sourceExternalId?: string | null;
  title?: string | null;
  price?: string | null;
  city?: string | null;
  excludeDraftId?: string;
}): Promise<ImportDraftDuplicateResult> {
  const warnings: string[] = [];
  let duplicateListingId: string | null = null;
  let duplicateDraftId: string | null = null;

  if (params.sourceUrl) {
    const existingDraft = await prisma.importedListingDraft.findFirst({
      where: {
        source_url: params.sourceUrl,
        ...(params.excludeDraftId ? { id: { not: params.excludeDraftId } } : {}),
      },
      select: { id: true, duplicate_of_listing_id: true, published_listing_id: true },
    });

    if (existingDraft) {
      duplicateDraftId = existingDraft.id;
      duplicateListingId =
        existingDraft.published_listing_id ?? existingDraft.duplicate_of_listing_id ?? null;
      return {
        isDefiniteDuplicate: true,
        duplicateListingId,
        duplicateDraftId,
        warnings: ["Черновик с такой же ссылкой на источник уже существует."],
      };
    }
  }

  if (params.sourceExternalId) {
    const existingDraft = await prisma.importedListingDraft.findFirst({
      where: {
        source_external_id: params.sourceExternalId,
        ...(params.excludeDraftId ? { id: { not: params.excludeDraftId } } : {}),
      },
      select: { id: true, duplicate_of_listing_id: true, published_listing_id: true },
    });

    if (existingDraft) {
      duplicateDraftId = existingDraft.id;
      duplicateListingId =
        existingDraft.published_listing_id ?? existingDraft.duplicate_of_listing_id ?? null;
      return {
        isDefiniteDuplicate: true,
        duplicateListingId,
        duplicateDraftId,
        warnings: ["Черновик с таким внешним ID уже существует."],
      };
    }
  }

  const normalizedTitle = params.title
    ? normalizeListingTitleForDuplicate(params.title)
    : null;
  const normalizedCity = params.city?.trim().toLowerCase() ?? null;
  const normalizedPrice = normalizeComparablePrice(params.price);

  if (!normalizedTitle || !normalizedCity) {
    return {
      isDefiniteDuplicate: false,
      duplicateListingId: null,
      duplicateDraftId: null,
      warnings,
    };
  }

  const [listings, drafts] = await Promise.all([
    prisma.listing.findMany({
      where: {
        status: { notIn: ["REJECTED", "ARCHIVED"] },
      },
      select: {
        id: true,
        title: true,
        price: true,
        city: { select: { name: true } },
      },
      take: 500,
      orderBy: { created_at: "desc" },
    }),
    prisma.importedListingDraft.findMany({
      where: {
        status: { notIn: [ImportDraftStatus.REJECTED, ImportDraftStatus.DUPLICATE] },
        ...(params.excludeDraftId ? { id: { not: params.excludeDraftId } } : {}),
      },
      select: {
        id: true,
        normalized_title: true,
        raw_title: true,
        normalized_price: true,
        raw_price: true,
        normalized_city: true,
        raw_city: true,
      },
      take: 200,
      orderBy: { created_at: "desc" },
    }),
  ]);

  for (const listing of listings) {
    const listingTitle = normalizeListingTitleForDuplicate(listing.title);
    const listingCity = listing.city?.name.trim().toLowerCase() ?? null;
    const listingPrice = normalizeComparablePrice(listing.price.toString());

    if (
      listingTitle === normalizedTitle &&
      listingCity === normalizedCity &&
      (normalizedPrice === null || listingPrice === normalizedPrice)
    ) {
      duplicateListingId = listing.id;
      warnings.push("Найдено похожее опубликованное объявление с тем же названием, городом и ценой.");
      return {
        isDefiniteDuplicate: true,
        duplicateListingId,
        duplicateDraftId: null,
        warnings,
      };
    }
  }

  for (const draft of drafts) {
    const draftTitle = normalizeListingTitleForDuplicate(
      draft.normalized_title ?? draft.raw_title ?? "",
    );
    const draftCity = (draft.normalized_city ?? draft.raw_city)?.trim().toLowerCase() ?? null;
    const draftPrice = normalizeComparablePrice(
      draft.normalized_price?.toString() ?? draft.raw_price,
    );

    if (
      draftTitle === normalizedTitle &&
      draftCity === normalizedCity &&
      (normalizedPrice === null || draftPrice === normalizedPrice)
    ) {
      duplicateDraftId = draft.id;
      warnings.push("Найден похожий черновик с тем же названием, городом и ценой.");
      break;
    }
  }

  if (duplicateDraftId) {
    return {
      isDefiniteDuplicate: true,
      duplicateListingId: null,
      duplicateDraftId,
      warnings,
    };
  }

  if (warnings.length === 0 && normalizedTitle.length > 0) {
    const looseListingMatch = listings.find(
      (listing) =>
        normalizeListingTitleForDuplicate(listing.title) === normalizedTitle &&
        (listing.city?.name.trim().toLowerCase() ?? null) === normalizedCity,
    );

    if (looseListingMatch) {
      warnings.push("Возможный дубль — проверьте вручную.");
    }
  }

  return {
    isDefiniteDuplicate: false,
    duplicateListingId,
    duplicateDraftId,
    warnings,
  };
}
