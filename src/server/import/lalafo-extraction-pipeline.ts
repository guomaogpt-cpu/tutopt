import { extractLalafoListing, buildLalafoPartialDataFromUrl } from "@/server/import/extractors/lalafo";
import {
  fetchLalafoAdFromPageUrl,
  lalafoApiImagesToUrls,
  lalafoApiPriceText,
  type LalafoApiAd,
} from "@/server/import/lalafo-api";
import { parseLalafoUrlHints } from "@/server/import/lalafo-url-hints";
import { mapExternalCategory, parsePriceText } from "@/server/import/category-mapper";
import type { ImportExtractionDebug } from "@/server/import/import-error-codes";
import { uniqueUrls } from "@/server/import/parse-html-meta";
import { hasMeaningfulLalafoFields } from "@/server/import/render/render-field-utils";
import { throwRenderImportError } from "@/server/import/render/render-import-errors";
import { getRenderFallbackUnavailableMessage, isRenderFallbackEnabled } from "@/server/import/render/render-config";
import type {
  ExtractedFieldsFound,
  ExtractedListingData,
  ExtractedListingResult,
  ExtractionQuality,
} from "@/server/import/types";

export type LalafoExtractionPipelineResult = {
  extracted: ExtractedListingData;
  debug: ImportExtractionDebug;
};

function buildFieldsFound(data: {
  title: string | null;
  description: string | null;
  rawPrice: string | null;
  city: string | null;
  images: string[];
  categoryText: string | null;
}): ExtractedFieldsFound {
  return {
    title: Boolean(data.title?.trim()),
    description: Boolean(data.description?.trim()),
    price: Boolean(data.rawPrice?.trim()),
    city: Boolean(data.city?.trim()),
    images: data.images.length,
    category: Boolean(data.categoryText?.trim()),
  };
}

function computeExtractionQuality(params: {
  extractionSource: string;
  fieldsFound?: ExtractedFieldsFound;
}): ExtractionQuality {
  if (params.extractionSource === "url-slug-fallback") {
    return "URL_ONLY";
  }

  const fields = params.fieldsFound;
  if (!fields) {
    return "FAILED";
  }

  const score = [
    fields.title,
    fields.price,
    fields.description,
    fields.images > 0,
    fields.city,
    fields.category,
  ].filter(Boolean).length;

  if (score >= 5) {
    return "FULL";
  }
  if (score >= 2) {
    return "PARTIAL";
  }
  return "URL_ONLY";
}

function dataFromLalafoApi(ad: LalafoApiAd, canonicalUrl: string): ExtractedListingData {
  const rawPrice = lalafoApiPriceText(ad);
  const priceParsed = parsePriceText(rawPrice);
  const images = uniqueUrls(lalafoApiImagesToUrls(ad));

  return {
    sourcePlatform: "LALAFO",
    sourceUrl: ad.url ?? canonicalUrl,
    sourceExternalId: String(ad.id),
    title: ad.title,
    description: ad.description,
    rawPrice: priceParsed.rawPrice,
    currency: priceParsed.normalizedCurrency ?? ad.currency ?? "KGS",
    city: ad.city,
    categoryText: null,
    subcategoryText: null,
    images,
    rawContact: ad.mobile,
    partial: false,
    fieldsFound: buildFieldsFound({
      title: ad.title,
      description: ad.description,
      rawPrice: priceParsed.rawPrice,
      city: ad.city,
      images,
      categoryText: null,
    }),
  };
}

function mergeExtractedData(
  primary: ExtractedListingData,
  secondary: ExtractedListingData,
): ExtractedListingData {
  const images = uniqueUrls([...primary.images, ...secondary.images]);
  const title = primary.title ?? secondary.title;
  const description = primary.description ?? secondary.description;
  const rawPrice = primary.rawPrice ?? secondary.rawPrice;
  const city = primary.city ?? secondary.city;
  const categoryText = primary.categoryText ?? secondary.categoryText;
  const subcategoryText = primary.subcategoryText ?? secondary.subcategoryText;

  return {
    ...primary,
    title,
    description,
    rawPrice,
    currency: primary.currency ?? secondary.currency,
    city,
    categoryText,
    subcategoryText,
    breadcrumbSlugs: primary.breadcrumbSlugs ?? secondary.breadcrumbSlugs,
    images,
    rawContact: primary.rawContact ?? secondary.rawContact,
    partial: primary.partial && secondary.partial,
    fieldsFound: buildFieldsFound({
      title,
      description,
      rawPrice,
      city,
      images,
      categoryText: categoryText ?? subcategoryText,
    }),
  };
}

function shouldTryRender(params: {
  useRender: boolean;
  allowRender: boolean;
  extracted: ExtractedListingData | null;
  isSlugOnly: boolean;
  apiBlocked: boolean;
}): boolean {
  if (params.useRender) {
    return isRenderFallbackEnabled();
  }
  if (!params.allowRender || !isRenderFallbackEnabled()) {
    return false;
  }
  if (params.isSlugOnly || params.apiBlocked) {
    return true;
  }
  if (!params.extracted) {
    return true;
  }
  return !hasMeaningfulLalafoFields(params.extracted);
}

export async function extractLalafoListingPipeline(params: {
  canonicalUrl: string;
  html?: string | null;
  htmlFinalUrl?: string | null;
  fetchDebug?: ImportExtractionDebug;
  allowRender?: boolean;
  useRender?: boolean;
}): Promise<LalafoExtractionPipelineResult> {
  const sources: string[] = [];
  let failureReason: string | undefined;
  let renderFailureReason: string | undefined;
  let apiResult: ExtractedListingData | null = null;
  let htmlResult: ExtractedListingData | null = null;
  let renderAttempted = false;
  let lastRenderDebug: ImportExtractionDebug | undefined;

  if (params.useRender) {
    renderAttempted = true;
    const { extractLalafoViaRender } = await import(
      "@/server/import/render/lalafo-render-extractor"
    );
    const renderResult = await extractLalafoViaRender(params.canonicalUrl);
    if (!renderResult.ok) {
      throwRenderImportError({
        code: renderResult.code,
        reason: renderResult.reason,
        debug: renderResult.debug,
      });
    }

    sources.push("browser-render");
    let extractedRender = renderResult.extracted;
    const mappedCategory = mapExternalCategory({
      categoryText: extractedRender.categoryText,
      subcategoryText: extractedRender.subcategoryText,
      title: extractedRender.title,
      description: extractedRender.description,
      breadcrumbSlugs: extractedRender.breadcrumbSlugs,
    });

    if (mappedCategory.normalizedCategory) {
      extractedRender = {
        ...extractedRender,
        categoryText: mappedCategory.normalizedCategory,
        subcategoryText: mappedCategory.normalizedSubcategory,
        fieldsFound: buildFieldsFound({
          title: extractedRender.title,
          description: extractedRender.description,
          rawPrice: extractedRender.rawPrice,
          city: extractedRender.city,
          images: extractedRender.images,
          categoryText: mappedCategory.normalizedCategory,
        }),
      };
    }

    const extractionSource = "browser-render";
    const extractionQuality = computeExtractionQuality({
      extractionSource,
      fieldsFound: extractedRender.fieldsFound,
    });

    return {
      extracted: {
        ...extractedRender,
        partial: !hasMeaningfulLalafoFields(extractedRender),
      },
      debug: {
        ...params.fetchDebug,
        ...renderResult.debug,
        requestedUrl: params.canonicalUrl,
        extractionSource,
        extractionSources: sources,
        extractionQuality,
        partial: !hasMeaningfulLalafoFields(extractedRender),
      },
    };
  }

  if (!params.useRender) {
    const apiFetch = await fetchLalafoAdFromPageUrl(params.canonicalUrl);
    if (apiFetch.ok) {
      sources.push("lalafo-api");
      apiResult = dataFromLalafoApi(apiFetch.data, params.canonicalUrl);
    } else {
      failureReason = `Lalafo API: ${apiFetch.reason}`;
    }

    if (params.html) {
      const htmlExtracted: ExtractedListingResult = extractLalafoListing(
        params.html,
        params.htmlFinalUrl ?? params.canonicalUrl,
      );
      if (htmlExtracted.ok) {
        sources.push(htmlExtracted.data.partial ? "html-partial" : "html");
        htmlResult = htmlExtracted.data;
      } else if (!failureReason) {
        failureReason = htmlExtracted.error;
      }
    }
  }

  let extracted: ExtractedListingData | null = null;

  if (apiResult && htmlResult) {
    extracted = mergeExtractedData(apiResult, htmlResult);
    sources.push("merged");
  } else if (apiResult) {
    extracted = apiResult;
  } else if (htmlResult) {
    extracted = htmlResult;
  }

  const apiBlocked = Boolean(failureReason?.includes("403"));
  const isSlugOnlyBeforeRender = !extracted;

  if (
    shouldTryRender({
      useRender: params.useRender ?? false,
      allowRender: params.allowRender ?? false,
      extracted,
      isSlugOnly: isSlugOnlyBeforeRender,
      apiBlocked,
    })
  ) {
    renderAttempted = true;
    const { extractLalafoViaRender } = await import(
      "@/server/import/render/lalafo-render-extractor"
    );
    const renderResult = await extractLalafoViaRender(params.canonicalUrl);
    if (renderResult.ok) {
      sources.push("browser-render");
      extracted = extracted
        ? mergeExtractedData(extracted, renderResult.extracted)
        : renderResult.extracted;
      failureReason = undefined;
      lastRenderDebug = renderResult.debug;
    } else {
      renderFailureReason =
        renderResult.debug?.failureReason ?? renderResult.reason;
      lastRenderDebug = renderResult.debug;
      if (!failureReason) {
        failureReason = renderFailureReason;
      }
    }
  }

  const renderSucceeded = sources.includes("browser-render");
  const renderDebug: ImportExtractionDebug = renderAttempted
    ? {
        ...lastRenderDebug,
        renderFallbackEnabled: isRenderFallbackEnabled(),
        renderFallbackAttempted: true,
        renderFallbackSucceeded: renderSucceeded,
        renderFallbackAvailable: renderSucceeded,
        browserLaunchable: renderSucceeded,
      }
    : {
        renderFallbackEnabled: isRenderFallbackEnabled(),
        renderFallbackAttempted: false,
        renderFallbackSucceeded: false,
        renderFallbackAvailable: false,
        browserLaunchable: false,
      };

  const isSlugOnly =
    !extracted ||
    (!hasMeaningfulLalafoFields(extracted) &&
      sources.every((source) => source !== "browser-render" && source !== "lalafo-api"));

  if (!extracted || isSlugOnly) {
    const slugFallback = buildLalafoPartialDataFromUrl(params.canonicalUrl);
    if (slugFallback) {
      sources.push("url-slug-fallback");
      const hints = parseLalafoUrlHints(params.canonicalUrl);
      const mappedCategory = mapExternalCategory({
        title: slugFallback.title,
        description: slugFallback.description,
      });
      extracted = {
        ...slugFallback,
        categoryText: mappedCategory.normalizedCategory,
        subcategoryText: mappedCategory.normalizedSubcategory,
        city: slugFallback.city ?? hints.city,
        fieldsFound: buildFieldsFound({
          title: slugFallback.title,
          description: slugFallback.description,
          rawPrice: slugFallback.rawPrice,
          city: slugFallback.city ?? hints.city,
          images: slugFallback.images,
          categoryText: mappedCategory.normalizedCategory,
        }),
      };
      if (!failureReason) {
        failureReason = "Использован fallback из URL slug";
      }
    }
  }

  if (!extracted) {
    throw new Error(failureReason ?? "EXTRACTION_FAILED");
  }

  const mappedCategory = mapExternalCategory({
    categoryText: extracted.categoryText,
    subcategoryText: extracted.subcategoryText,
    title: extracted.title,
    description: extracted.description,
    breadcrumbSlugs: extracted.breadcrumbSlugs,
  });

  if (mappedCategory.normalizedCategory) {
    extracted = {
      ...extracted,
      categoryText: mappedCategory.normalizedCategory,
      subcategoryText: mappedCategory.normalizedSubcategory,
      fieldsFound: buildFieldsFound({
        title: extracted.title,
        description: extracted.description,
        rawPrice: extracted.rawPrice,
        city: extracted.city,
        images: extracted.images,
        categoryText: mappedCategory.normalizedCategory,
      }),
    };
  }

  const slugOnly = sources.includes("url-slug-fallback") && !sources.includes("browser-render") && !sources.includes("lalafo-api");
  const isPartial =
    slugOnly ||
    Boolean(
      extracted.partial ||
        !extracted.fieldsFound?.price ||
        (extracted.fieldsFound?.images ?? 0) === 0 ||
        !extracted.fieldsFound?.description,
    );

  extracted = {
    ...extracted,
    partial: isPartial,
  };

  const extractionSource = sources.includes("browser-render")
    ? "browser-render"
    : sources.includes("lalafo-api")
      ? "lalafo-api"
      : sources.includes("url-slug-fallback")
        ? "url-slug-fallback"
        : sources.includes("html-partial")
          ? "html"
          : sources.length > 0
            ? "open-graph"
            : "failed";

  const extractionQuality = computeExtractionQuality({
    extractionSource,
    fieldsFound: extracted.fieldsFound,
  });

  let combinedFailureReason: string | undefined;
  if (slugOnly) {
    if (renderFailureReason) {
      combinedFailureReason = renderFailureReason;
    } else if (apiBlocked && !isRenderFallbackEnabled()) {
      combinedFailureReason = getRenderFallbackUnavailableMessage();
    } else if (failureReason) {
      combinedFailureReason = failureReason;
    }
  }

  return {
    extracted,
    debug: {
      ...params.fetchDebug,
      requestedUrl: params.canonicalUrl,
      finalUrl: params.htmlFinalUrl ?? params.canonicalUrl,
      extractorUsed: "LALAFO",
      extractionSource,
      extractionSources: sources,
      fieldsFound: extracted.fieldsFound,
      partial: extracted.partial,
      extractionQuality,
      failureReason: combinedFailureReason,
      ...renderDebug,
    },
  };
}

export function isAutoExtractedFromDebug(debug: ImportExtractionDebug): boolean {
  if (debug.extractionSource === "url-slug-fallback") {
    return false;
  }
  if (debug.extractionQuality === "URL_ONLY") {
    return false;
  }
  const fields = debug.fieldsFound;
  return Boolean(fields?.price || (fields?.images ?? 0) > 0 || fields?.description);
}
