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
import {
  extractLalafoListingPipeline,
  isAutoExtractedFromDebug,
} from "@/server/import/lalafo-extraction-pipeline";
import { probeRenderBrowser } from "@/server/import/render/render-browser-probe";
import { throwRenderImportError } from "@/server/import/render/render-import-errors";
import { safeFetchImportPage, validateImportUrl } from "@/server/import/safe-fetch-url";
import type { ExtractedListingData } from "@/server/import/types";
import { ExternalImportError, NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

function buildImportNotes(
  debug: ImportExtractionDebug,
  extracted: ExtractedListingData,
): string {
  const source = debug.extractionSource;

  if (source === "network-json") {
    return "Данные получены из network API (browser). extractionSource: network-json";
  }
  if (source === "embedded-json") {
    return "Данные получены из embedded JSON. extractionSource: embedded-json";
  }
  if (source === "dom") {
    return "Данные получены из DOM страницы (browser render). extractionSource: dom";
  }
  if (source === "open-graph") {
    return "Данные получены из OpenGraph/meta. extractionSource: open-graph";
  }
  if (source === "url-slug-fallback" || debug.extractionQuality === "URL_ONLY") {
    return "Данные получены только из URL. Название восстановлено из ссылки. extractionSource: url-slug-fallback";
  }
  if (source === "lalafo-api") {
    return "Данные получены через Lalafo API. extractionSource: lalafo-api";
  }
  if (source === "browser-render") {
    return "Данные получены со страницы (browser render). extractionSource: dom";
  }
  if (extracted.partial) {
    return "Данные извлечены частично. Проверьте вручную.";
  }
  return "Данные получены автоматически по ссылке.";
}

export type ImportDraftFromUrlResult = {
  draft: ReturnType<typeof serializeImportDraft>;
  autoExtracted: boolean;
  extractionQuality?: "FULL" | "PARTIAL" | "URL_ONLY" | "FAILED";
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
  const autoExtracted = isAutoExtractedFromDebug({
    ...params.debug,
    fieldsFound: params.extracted.fieldsFound,
    extractionSource: params.debug?.extractionSource,
    extractionQuality: params.debug?.extractionQuality,
  });

  if (params.debug?.extractionQuality === "URL_ONLY") {
    warnings.push("Данные получены только из ссылки. Цена, описание и фото не извлечены.");
  } else if (params.extracted.partial) {
    warnings.push("Черновик создан частично. Проверьте данные вручную.");
  }
  if (params.debug?.failureReason && params.debug.extractionQuality === "URL_ONLY") {
    warnings.push(params.debug.failureReason);
  }
  if (!hasValidCategory) {
    warnings.push("Укажите категорию перед публикацией.");
  }

  return {
    draft: serializeImportDraft(draft, warnings),
    autoExtracted,
    extractionQuality: params.debug?.extractionQuality,
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
  allowRender?: boolean;
  useRender?: boolean;
}): Promise<{ extracted: ExtractedListingData; debug: ImportExtractionDebug }> {
  if (params.platform === "LALAFO") {
    let html: string | null = null;
    let htmlFinalUrl: string | null = null;
    let fetchDebug: ImportExtractionDebug | undefined;

    if (!params.useRender) {
      try {
        const fetchResult = await safeFetchImportPage(params.canonicalUrl);
        html = fetchResult.html;
        htmlFinalUrl = fetchResult.finalUrl;
        fetchDebug = fetchResult.debug;
      } catch {
        // HTML fetch may fail on datacenter IPs — render/API fallback handles this.
      }
    }

    return extractLalafoListingPipeline({
      canonicalUrl: params.canonicalUrl,
      html,
      htmlFinalUrl,
      fetchDebug,
      allowRender: params.allowRender,
      useRender: params.useRender,
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
  allowRender?: boolean;
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
    allowRender: params.allowRender ?? true,
  });

  const notes = buildImportNotes(debug, extracted);

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
  mode?: "fetch" | "render";
}): Promise<{
  draft: ReturnType<typeof serializeImportDraft>;
  debug?: ImportExtractionDebug;
  autoExtracted?: boolean;
  extractionQuality?: "FULL" | "PARTIAL" | "URL_ONLY" | "FAILED";
}> {
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

  if (params.mode === "render") {
    const probe = await probeRenderBrowser({ testLaunch: true, force: true });
    if (!probe.browserLaunchable) {
      throw new ExternalImportError("Браузерный импорт недоступен на сервере.", {
        importErrorCode: probe.renderFallbackFailureCode ?? "RENDER_BROWSER_LAUNCH_FAILED",
        missingLibrary: probe.missingLibrary,
        failureMessage: probe.failureMessage,
      });
    }
  }

  let extracted: ExtractedListingData;
  let debug: ImportExtractionDebug;

  try {
    const result = await extractListingData({
      canonicalUrl: draft.source_url,
      platform,
      allowRender: params.mode === "render",
      useRender: params.mode === "render",
    });
    extracted = result.extracted;
    debug = result.debug;
  } catch (error) {
    if (params.mode === "render") {
      if (error instanceof ExternalImportError) {
        throw error;
      }
      throwRenderImportError({ error });
    }
    throw error;
  }

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

  const reextractNote =
    params.mode === "render"
      ? `${buildImportNotes(debug, extracted)} Повторное извлечение (browser render).`
      : `${buildImportNotes(debug, extracted)} Повторное извлечение.`;

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
      notes: `${draft.notes ?? ""}\n${reextractNote}`.trim(),
      reviewed_by_id: params.staff.id,
      reviewed_at: new Date(),
    },
  });

  const autoExtracted = isAutoExtractedFromDebug(debug);
  const warnings =
    debug.extractionQuality === "URL_ONLY"
      ? ["Данные получены только из ссылки.", debug.failureReason].filter(
          (value): value is string => Boolean(value),
        )
      : extracted.partial
        ? ["Данные обновлены частично."]
        : ["Данные обновлены."];

  if (params.mode === "render" && debug.renderFallbackAttempted && !autoExtracted) {
    warnings.push(
      debug.failureReason ??
        (debug.renderFallbackAvailable
          ? "Browser render не нашёл данные на странице."
          : "Браузерный режим импорта не включён на сервере."),
    );
  }

  return {
    draft: serializeImportDraft(updated, warnings),
    debug,
    autoExtracted,
    extractionQuality: debug.extractionQuality,
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
