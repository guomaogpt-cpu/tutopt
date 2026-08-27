import { ImportDraftStatus, Prisma } from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";
import { checkImportDraftDuplicates } from "@/features/import-drafts/lib/duplicate-check";
import {
  buildImportDraftCreateData,
  serializeImportDraft,
} from "@/features/import-drafts/lib/import-draft-serializer";
import {
  isImportDraftReadyForReview,
  normalizeImportDraftFields,
} from "@/features/import-drafts/lib/normalize-import-draft";
import { validateImportCategorySlugs } from "@/features/import-drafts/lib/resolve-import-category";
import type { ImportSourcePlatform } from "@/features/import-drafts/types/import-draft";
import { mapExternalCategory, parsePriceText } from "@/server/import/category-mapper";
import { detectImportPlatform } from "@/server/import/detect-platform";
import { extractListingFromHtml } from "@/server/import/extractors";
import {
  getImportErrorMessage,
  throwImportError,
  type ImportExtractionDebug,
} from "@/server/import/import-error-codes";
import { extractLalafoListingPipeline } from "@/server/import/lalafo-extraction-pipeline";
import { safeFetchImportPage, validateImportUrl } from "@/server/import/safe-fetch-url";
import type { ExtractedListingData } from "@/server/import/types";
import { ValidationError } from "@/shared/lib/errors";
import { NotFoundError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

export type ImportDraftFromUrlResult = {
  draft: ReturnType<typeof serializeImportDraft>;
  autoExtracted: boolean;
  duplicate?: boolean;
  partial?: boolean;
  existingDraftId?: string;
  existingListingId?: string | null;
  debug?: ImportExtractionDebug;
};

async function createDraftFromExtractedData(params: {
  extracted: ExtractedListingData;
  staff: PublicUser;
  notes: string;
  debug?: ImportExtractionDebug;
}): Promise<ImportDraftFromUrlResult> {
  const mappedCategory = mapExternalCategory({
    categoryText: params.extracted.categoryText,
    subcategoryText: params.extracted.subcategoryText,
    title: params.extracted.title,
    description: params.extracted.description,
    breadcrumbSlugs: params.extracted.breadcrumbSlugs,
  });

  const priceParsed = parsePriceText(params.extracted.rawPrice);

  const normalized = normalizeImportDraftFields({
    sourceUrl: params.extracted.sourceUrl,
    title: params.extracted.title,
    description: params.extracted.description,
    price: priceParsed.normalizedPrice ?? params.extracted.rawPrice,
    currency: params.extracted.currency ?? priceParsed.normalizedCurrency,
    city: params.extracted.city,
    category: mappedCategory.normalizedCategory,
    subcategory: mappedCategory.normalizedSubcategory,
    imageUrlsText: params.extracted.images.join("\n"),
  });

  const hasValidCategory = await validateImportCategorySlugs({
    normalizedCategory: normalized.normalizedCategory,
    normalizedSubcategory: normalized.normalizedSubcategory,
  });

  const duplicateCheck = await checkImportDraftDuplicates({
    sourceUrl: params.extracted.sourceUrl,
    sourceExternalId: params.extracted.sourceExternalId,
    title: normalized.normalizedTitle ?? params.extracted.title,
    price: priceParsed.rawPrice,
    city: normalized.normalizedCity ?? params.extracted.city,
  });

  let status: ImportDraftStatus = ImportDraftStatus.PENDING_REVIEW;
  if (duplicateCheck.isDefiniteDuplicate) {
    status = ImportDraftStatus.DUPLICATE;
  } else if (
    hasValidCategory &&
    isImportDraftReadyForReview({
      normalizedTitle: normalized.normalizedTitle,
      normalizedCategory: normalized.normalizedCategory,
      normalizedSubcategory: normalized.normalizedSubcategory,
      normalizedCity: normalized.normalizedCity,
      rawCity: params.extracted.city,
    })
  ) {
    status = ImportDraftStatus.READY;
  }

  const draft = await prisma.importedListingDraft.create({
    data: buildImportDraftCreateData({
      input: {
        sourcePlatform: params.extracted.sourcePlatform,
        sourceUrl: params.extracted.sourceUrl,
        sourceExternalId: params.extracted.sourceExternalId,
        title: params.extracted.title,
        description: params.extracted.description,
        price: params.extracted.rawPrice,
        currency: params.extracted.currency,
        city: params.extracted.city,
        category: mappedCategory.normalizedCategory,
        subcategory: mappedCategory.normalizedSubcategory,
        rawContact: params.extracted.rawContact,
        notes: params.notes,
      },
      normalized: {
        ...normalized,
        normalizedPrice: priceParsed.normalizedPrice
          ? new Prisma.Decimal(priceParsed.normalizedPrice)
          : normalized.normalizedPrice,
        normalizedCurrency: priceParsed.normalizedCurrency ?? normalized.normalizedCurrency,
      },
      status,
      createdById: params.staff.id,
      duplicateOfListingId: duplicateCheck.duplicateListingId,
    }),
  });

  const warnings = [...duplicateCheck.warnings];
  if (params.extracted.partial) {
    warnings.push("Черновик создан частично. Проверьте данные вручную.");
  }
  if (!hasValidCategory) {
    warnings.push("Укажите категорию перед публикацией.");
  }

  return {
    draft: serializeImportDraft(draft, warnings),
    autoExtracted: true,
    partial: params.extracted.partial ?? false,
    debug: {
      ...params.debug,
      fieldsFound: params.extracted.fieldsFound,
      partial: params.extracted.partial,
    },
  };
}

async function extractListingData(params: {
  canonicalUrl: string;
  platform: ImportSourcePlatform;
}): Promise<{ extracted: ExtractedListingData; debug: ImportExtractionDebug }> {
  if (params.platform === "LALAFO") {
    let html: string | null = null;
    let htmlFinalUrl: string | null = null;
    let fetchDebug: ImportExtractionDebug | undefined;

    try {
      const fetchResult = await safeFetchImportPage(params.canonicalUrl);
      html = fetchResult.html;
      htmlFinalUrl = fetchResult.finalUrl;
      fetchDebug = fetchResult.debug;
    } catch {
      // HTML fetch may fail on datacenter IPs — Lalafo API fallback handles this.
    }

    return extractLalafoListingPipeline({
      canonicalUrl: params.canonicalUrl,
      html,
      htmlFinalUrl,
      fetchDebug,
    });
  }

  const fetchResult = await safeFetchImportPage(params.canonicalUrl);
  const extracted = extractListingFromHtml({
    platform: params.platform,
    html: fetchResult.html,
    finalUrl: fetchResult.finalUrl,
  });

  if (!extracted.ok) {
    throwImportError("EXTRACTION_FAILED", {
      message: extracted.error,
      debug: {
        ...fetchResult.debug,
        extractorUsed: params.platform,
        extractionSource: "failed",
      },
    });
  }

  return {
    extracted: extracted.data,
    debug: {
      ...fetchResult.debug,
      extractorUsed: params.platform,
      extractionSource: extracted.data.partial ? "html" : "open-graph",
      fieldsFound: extracted.data.fieldsFound,
      partial: extracted.data.partial,
    },
  };
}

export async function importListingDraftFromUrl(params: {
  url: string;
  sourcePlatform?: ImportSourcePlatform | null;
  staff: PublicUser;
  forceNew?: boolean;
}): Promise<ImportDraftFromUrlResult> {
  const parsedUrl = await validateImportUrl(params.url);
  const platform = detectImportPlatform(parsedUrl, params.sourcePlatform ?? null);
  const canonicalUrl = parsedUrl.toString();

  if (!params.forceNew) {
    const existingDraft = await prisma.importedListingDraft.findFirst({
      where: { source_url: canonicalUrl },
      orderBy: { created_at: "desc" },
    });

    if (existingDraft) {
      return {
        draft: serializeImportDraft(existingDraft, ["Эта ссылка уже импортировалась."]),
        autoExtracted: false,
        duplicate: true,
        existingDraftId: existingDraft.id,
        existingListingId:
          existingDraft.published_listing_id ?? existingDraft.duplicate_of_listing_id,
      };
    }
  }

  const { extracted, debug } = await extractListingData({
    canonicalUrl,
    platform,
  });

  const notes = extracted.partial
    ? debug.extractionSource === "url-slug-fallback"
      ? "Данные извлечены частично из URL. Проверьте и дополните вручную."
      : "Данные извлечены частично. Проверьте вручную."
    : debug.extractionSource === "lalafo-api"
      ? "Данные получены через Lalafo API."
      : "Данные получены автоматически по ссылке.";

  return createDraftFromExtractedData({
    extracted,
    staff: params.staff,
    notes,
    debug,
  });
}

export async function reextractImportDraft(params: {
  draftId: string;
  staff: PublicUser;
}): Promise<{ draft: ReturnType<typeof serializeImportDraft>; debug?: ImportExtractionDebug }> {
  const draft = await prisma.importedListingDraft.findUnique({
    where: { id: params.draftId },
  });

  if (!draft) {
    throw new NotFoundError("Import draft not found");
  }

  if (!draft.source_url) {
    throw new ValidationError("У черновика нет sourceUrl для повторного извлечения.");
  }

  const platform = detectImportPlatform(
    new URL(draft.source_url),
    draft.source_platform as ImportSourcePlatform,
  );
  const { extracted, debug } = await extractListingData({
    canonicalUrl: draft.source_url,
    platform,
  });

  const mappedCategory = mapExternalCategory({
    categoryText: extracted.categoryText,
    subcategoryText: extracted.subcategoryText,
    title: extracted.title,
    description: extracted.description,
    breadcrumbSlugs: extracted.breadcrumbSlugs,
  });

  const priceParsed = parsePriceText(extracted.rawPrice);
  const normalized = normalizeImportDraftFields({
    sourceUrl: extracted.sourceUrl,
    title: extracted.title,
    description: extracted.description,
    price: priceParsed.normalizedPrice ?? extracted.rawPrice,
    currency: extracted.currency ?? priceParsed.normalizedCurrency,
    city: extracted.city,
    category: mappedCategory.normalizedCategory,
    subcategory: mappedCategory.normalizedSubcategory,
    imageUrlsText: extracted.images.join("\n"),
  });

  const pickText = (current: string | null, next: string | null) =>
    current?.trim() ? current : next;

  const pickImages = (current: Prisma.JsonValue | null, next: string[]) => {
    const existing = Array.isArray(current)
      ? current.filter((item): item is string => typeof item === "string")
      : [];
    return existing.length > 0 ? existing : next;
  };

  const updated = await prisma.importedListingDraft.update({
    where: { id: draft.id },
    data: {
      source_external_id: pickText(draft.source_external_id, extracted.sourceExternalId),
      raw_title: pickText(draft.raw_title, extracted.title),
      raw_description: pickText(draft.raw_description, extracted.description),
      raw_price: pickText(draft.raw_price, extracted.rawPrice),
      raw_currency: pickText(draft.raw_currency, extracted.currency),
      raw_city: pickText(draft.raw_city, extracted.city),
      raw_contact: pickText(draft.raw_contact, extracted.rawContact),
      raw_images: pickImages(draft.raw_images, extracted.images),
      normalized_title: pickText(draft.normalized_title, normalized.normalizedTitle),
      normalized_description: pickText(
        draft.normalized_description,
        normalized.normalizedDescription,
      ),
      normalized_price:
        draft.normalized_price ??
        (priceParsed.normalizedPrice ? new Prisma.Decimal(priceParsed.normalizedPrice) : null),
      normalized_currency: pickText(draft.normalized_currency, normalized.normalizedCurrency),
      normalized_city: pickText(draft.normalized_city, normalized.normalizedCity),
      normalized_category: pickText(draft.normalized_category, normalized.normalizedCategory),
      normalized_subcategory: pickText(
        draft.normalized_subcategory,
        normalized.normalizedSubcategory,
      ),
      normalized_images: pickImages(draft.normalized_images, normalized.normalizedImages),
      notes: `${draft.notes ?? ""}\nПовторное извлечение выполнено.`.trim(),
      reviewed_by_id: params.staff.id,
      reviewed_at: new Date(),
    },
  });

  return {
    draft: serializeImportDraft(
      updated,
      extracted.partial ? ["Данные обновлены частично."] : ["Данные обновлены."],
    ),
    debug,
  };
}

export function getImportErrorDetails(error: unknown): {
  message: string;
  importErrorCode?: string;
  nextAction?: string;
} {
  if (error instanceof ValidationError) {
    const details = error.details as
      | { importErrorCode?: string; nextAction?: string }
      | undefined;
    return {
      message: error.message,
      importErrorCode: details?.importErrorCode,
      nextAction: details?.nextAction,
    };
  }

  return {
    message: getImportErrorMessage("FETCH_FAILED"),
  };
}
