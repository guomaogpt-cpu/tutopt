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
import type {
  ExtractedFieldsFound,
  ExtractedListingData,
  ExtractedListingResult,
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

export async function extractLalafoListingPipeline(params: {
  canonicalUrl: string;
  html?: string | null;
  htmlFinalUrl?: string | null;
  fetchDebug?: ImportExtractionDebug;
}): Promise<LalafoExtractionPipelineResult> {
  const sources: string[] = [];
  let failureReason: string | undefined;
  let apiResult: ExtractedListingData | null = null;
  let htmlResult: ExtractedListingData | null = null;

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

  let extracted: ExtractedListingData | null = null;

  if (apiResult && htmlResult) {
    extracted = mergeExtractedData(apiResult, htmlResult);
    sources.push("merged");
  } else if (apiResult) {
    extracted = apiResult;
  } else if (htmlResult) {
    extracted = htmlResult;
  } else {
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
      failureReason = failureReason ?? "Использован fallback из URL slug";
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

  const isSlugOnly = sources.length === 1 && sources[0] === "url-slug-fallback";
  const isPartial =
    isSlugOnly ||
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

  const extractionSource = sources.includes("lalafo-api")
    ? "lalafo-api"
    : sources.includes("url-slug-fallback")
      ? "url-slug-fallback"
      : sources.includes("html-partial")
        ? "html"
        : sources.length > 0
          ? "open-graph"
          : "failed";

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
      failureReason: isSlugOnly ? failureReason : undefined,
      responseSize:
        params.fetchDebug?.responseSize ?? (apiFetch.ok ? apiFetch.responseSize : undefined),
      statusCode:
        params.fetchDebug?.statusCode ?? (apiFetch.ok ? apiFetch.statusCode : apiFetch.statusCode),
      contentType: params.fetchDebug?.contentType,
      redirectCount: params.fetchDebug?.redirectCount,
      renderFallbackAvailable: process.env.IMPORT_RENDER_FALLBACK_ENABLED === "true",
    },
  };
}
