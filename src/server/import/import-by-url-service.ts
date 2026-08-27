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
import { buildLalafoPartialDataFromUrl } from "@/server/import/extractors/lalafo";
import {
  getImportErrorMessage,
  throwImportError,
  type ImportFetchDebugInfo,
} from "@/server/import/import-error-codes";
import { safeFetchImportPage, validateImportUrl } from "@/server/import/safe-fetch-url";
import type { ExtractedListingData } from "@/server/import/types";
import { ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

type ImportDraftFromUrlResult = {
  draft: ReturnType<typeof serializeImportDraft>;
  autoExtracted: boolean;
  duplicate?: boolean;
  partial?: boolean;
  debug?: ImportFetchDebugInfo;
};

async function createDraftFromExtractedData(params: {
  extracted: ExtractedListingData;
  staff: PublicUser;
  notes: string;
  fetchDebug?: ImportFetchDebugInfo;
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
      ...params.fetchDebug,
      extractor: params.extracted.sourcePlatform,
      fieldsFound: params.extracted.fieldsFound,
      partial: params.extracted.partial,
    },
  };
}

function isFetchRecoverableForLalafo(error: unknown): boolean {
  if (!(error instanceof ValidationError)) {
    return false;
  }

  const details = error.details as { importErrorCode?: string } | undefined;
  const code = details?.importErrorCode;
  return (
    code === "HTTP_STATUS_BLOCKED" ||
    code === "FETCH_FAILED" ||
    code === "FETCH_TIMEOUT" ||
    code === "DNS_LOOKUP_FAILED"
  );
}

export async function importListingDraftFromUrl(params: {
  url: string;
  sourcePlatform?: ImportSourcePlatform | null;
  staff: PublicUser;
}): Promise<ImportDraftFromUrlResult> {
  const parsedUrl = await validateImportUrl(params.url);
  const platform = detectImportPlatform(parsedUrl, params.sourcePlatform ?? null);
  const canonicalUrl = parsedUrl.toString();

  const existingDraft = await prisma.importedListingDraft.findFirst({
    where: { source_url: canonicalUrl },
    orderBy: { created_at: "desc" },
  });

  if (existingDraft) {
    return {
      draft: serializeImportDraft(existingDraft, ["Такой источник уже импортировался."]),
      autoExtracted: false,
      duplicate: true,
    };
  }

  let fetchResult: Awaited<ReturnType<typeof safeFetchImportPage>> | null = null;

  try {
    fetchResult = await safeFetchImportPage(canonicalUrl);
  } catch (error) {
    if (platform === "LALAFO" && isFetchRecoverableForLalafo(error)) {
      const partialData = buildLalafoPartialDataFromUrl(canonicalUrl);
      if (partialData) {
        return createDraftFromExtractedData({
          extracted: partialData,
          staff: params.staff,
          notes:
            "Данные извлечены частично из URL. Страница не открылась — проверьте и дополните вручную.",
        });
      }
    }
    throw error;
  }

  const extracted = extractListingFromHtml({
    platform,
    html: fetchResult.html,
    finalUrl: fetchResult.finalUrl,
  });

  if (!extracted.ok) {
    if (platform === "LALAFO") {
      const partialData = buildLalafoPartialDataFromUrl(fetchResult.finalUrl);
      if (partialData) {
        return createDraftFromExtractedData({
          extracted: partialData,
          staff: params.staff,
          notes: "Данные извлечены частично. Проверьте вручную.",
          fetchDebug: fetchResult.debug,
        });
      }
    }

    throwImportError("EXTRACTION_FAILED", {
      message: extracted.error,
      debug: {
        ...fetchResult.debug,
        extractor: platform,
      },
    });
  }

  return createDraftFromExtractedData({
    extracted: extracted.data,
    staff: params.staff,
    notes: extracted.data.partial
      ? "Данные извлечены частично. Проверьте вручную."
      : "Данные получены автоматически по ссылке.",
    fetchDebug: fetchResult.debug,
  });
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
