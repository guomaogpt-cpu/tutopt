import type { ImportSourcePlatform } from "@/features/import-drafts/types/import-draft";
import { mapExternalCategory, parsePriceText } from "@/server/import/category-mapper";
import { extractLalafoListing } from "@/server/import/extractors/lalafo";
import { parseLalafoUrlHints } from "@/server/import/lalafo-url-hints";
import {
  extractMetaContent,
  extractTitleTag,
  stripHtmlTags,
  toAbsoluteUrl,
  uniqueUrls,
} from "@/server/import/parse-html-meta";
import { sanitizeListingTitle } from "@/server/import/render/title-validation";
import { validateImportUrl } from "@/server/import/safe-fetch-url";
import type { ExtractedFieldsFound, ExtractedListingData } from "@/server/import/types";
import { ValidationError } from "@/shared/lib/errors";

export const BROWSER_PAGE_HTML_MAX_BYTES = 2_097_152;
export const BROWSER_PAGE_BODY_TEXT_MAX_BYTES = 204_800;
export const BROWSER_PAGE_IMAGES_MAX = 20;
export const BROWSER_PAGE_EXTRACTED_IMAGES_MAX = 10;

export type BrowserPageExtractedFields = {
  title?: string;
  price?: string;
  currency?: string;
  description?: string;
  city?: string;
  images?: string[];
};

export type BrowserPageImportPayload = {
  sourceUrl: string;
  sourcePlatform: ImportSourcePlatform;
  pageTitle?: string;
  bodyText?: string;
  html?: string;
  images?: string[];
  extracted?: BrowserPageExtractedFields;
};

const IMAGE_BLOCKLIST = /logo|avatar|icon|sprite|placeholder|favicon|tracking|pixel|\.svg(\?|$)/i;
const PHONE_CONTEXT = /(?:телефон|phone|whatsapp|telegram|viber|\+996|996\d)/i;

const FORBIDDEN_PAYLOAD_KEYS = new Set([
  "cookies",
  "cookie",
  "localStorage",
  "sessionStorage",
  "headers",
  "authorization",
  "phone",
  "mobile",
  "contact",
  "rawContact",
]);

function byteLength(value: string): number {
  return Buffer.byteLength(value, "utf8");
}

function sanitizeText(value: string | undefined, maxLen: number): string | null {
  if (!value?.trim()) {
    return null;
  }
  const cleaned = value.replace(/\0/g, "").replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return null;
  }
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) : cleaned;
}

function rejectForbiddenKeys(payload: Record<string, unknown>): void {
  for (const key of Object.keys(payload)) {
    if (FORBIDDEN_PAYLOAD_KEYS.has(key.toLowerCase())) {
      throw new ValidationError(`Поле «${key}» не принимается.`, {
        importErrorCode: "INVALID_URL",
      });
    }
  }
}

export function validateBrowserPagePayload(raw: unknown): BrowserPageImportPayload {
  if (!raw || typeof raw !== "object") {
    throw new ValidationError("Некорректный JSON.");
  }

  const record = raw as Record<string, unknown>;
  rejectForbiddenKeys(record);

  const sourceUrl = typeof record.sourceUrl === "string" ? record.sourceUrl.trim() : "";
  if (!sourceUrl) {
    throw new ValidationError("Укажите sourceUrl.");
  }

  const sourcePlatform = record.sourcePlatform;
  if (
    sourcePlatform !== "LALAFO" &&
    sourcePlatform !== "WEBSITE" &&
    sourcePlatform !== "OTHER"
  ) {
    throw new ValidationError("sourcePlatform должен быть LALAFO, WEBSITE или OTHER.");
  }

  const html = typeof record.html === "string" ? record.html : undefined;
  const bodyText = typeof record.bodyText === "string" ? record.bodyText : undefined;

  if (html && byteLength(html) > BROWSER_PAGE_HTML_MAX_BYTES) {
    throw new ValidationError("HTML слишком большой (максимум 2 MB).");
  }
  if (bodyText && byteLength(bodyText) > BROWSER_PAGE_BODY_TEXT_MAX_BYTES) {
    throw new ValidationError("bodyText слишком большой (максимум 200 KB).");
  }

  const images = Array.isArray(record.images)
    ? record.images.filter((item): item is string => typeof item === "string").slice(0, BROWSER_PAGE_IMAGES_MAX)
    : undefined;

  let extracted: BrowserPageExtractedFields | undefined;
  if (record.extracted && typeof record.extracted === "object") {
    rejectForbiddenKeys(record.extracted as Record<string, unknown>);
    const ext = record.extracted as Record<string, unknown>;
    extracted = {
      title: typeof ext.title === "string" ? ext.title : undefined,
      price: typeof ext.price === "string" ? ext.price : undefined,
      currency: typeof ext.currency === "string" ? ext.currency : undefined,
      description: typeof ext.description === "string" ? ext.description : undefined,
      city: typeof ext.city === "string" ? ext.city : undefined,
      images: Array.isArray(ext.images)
        ? ext.images
            .filter((item): item is string => typeof item === "string")
            .slice(0, BROWSER_PAGE_EXTRACTED_IMAGES_MAX)
        : undefined,
    };
  }

  return {
    sourceUrl,
    sourcePlatform,
    pageTitle: typeof record.pageTitle === "string" ? record.pageTitle : undefined,
    bodyText,
    html,
    images,
    extracted,
  };
}

function isProductImageUrl(url: string): boolean {
  if (!/^https?:\/\//i.test(url) || url.startsWith("data:")) {
    return false;
  }
  return !IMAGE_BLOCKLIST.test(url);
}

function filterImages(urls: string[], baseUrl: string): string[] {
  return uniqueUrls(
    urls
      .map((url) => toAbsoluteUrl(url, baseUrl))
      .filter((url): url is string => Boolean(url && isProductImageUrl(url))),
  ).slice(0, BROWSER_PAGE_EXTRACTED_IMAGES_MAX);
}

function extractPriceFromText(text: string | null, defaultCurrency: string): string | null {
  if (!text) {
    return null;
  }

  if (/(?:цена\s+)?договорн/i.test(text)) {
    return "Договорная";
  }

  const lines = text.split(/\n+/);
  for (const line of lines) {
    if (PHONE_CONTEXT.test(line)) {
      continue;
    }
    const match = line.match(/(\d[\d\s\u00A0]{2,8})(?:\s*(?:KGS|сом|USD|\$|€))/i);
    if (match?.[0]) {
      return match[0].trim();
    }
  }

  const fallback = text.match(/(\d[\d\s\u00A0]{2,8})(?:\s*(?:KGS|сом|USD|\$|€))/i);
  if (fallback?.[0] && !PHONE_CONTEXT.test(fallback[0])) {
    return fallback[0].trim();
  }

  const bareNumber = text.match(/\b(\d{3,8})\b/);
  if (bareNumber?.[1] && !/^996/.test(bareNumber[1])) {
    return `${bareNumber[1]} ${defaultCurrency}`;
  }

  return null;
}

function extractDescriptionFromBodyText(bodyText: string | null): string | null {
  if (!bodyText) {
    return null;
  }

  const lines = bodyText.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const descIndex = lines.findIndex((line) => /^описание$/i.test(line));
  if (descIndex >= 0) {
    const chunk = lines.slice(descIndex + 1, descIndex + 8).join("\n");
    if (chunk.length > 20) {
      return chunk;
    }
  }

  const paragraph = lines.find((line) => line.length > 40 && !/^(главная|каталог|объявления)/i.test(line));
  return paragraph ?? null;
}

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

export async function extractListingFromBrowserPage(
  payload: BrowserPageImportPayload,
): Promise<ExtractedListingData> {
  await validateImportUrl(payload.sourceUrl);

  const canonicalUrl = payload.sourceUrl;
  const hints = parseLalafoUrlHints(canonicalUrl);
  const defaultCurrency = /lalafo\.kg/i.test(canonicalUrl) ? "KGS" : "KGS";

  const bodyText = sanitizeText(payload.bodyText, 100_000);
  const pageTitle = sanitizeText(payload.pageTitle, 500);

  let title = sanitizeListingTitle(payload.extracted?.title);
  let description = sanitizeText(payload.extracted?.description, 20_000);
  let rawPrice = payload.extracted?.price?.trim() ?? null;
  let city = payload.extracted?.city?.trim() ?? hints.city;
  let images = filterImages(
    [...(payload.extracted?.images ?? []), ...(payload.images ?? [])],
    canonicalUrl,
  );

  if (payload.html?.trim()) {
    const html = payload.html;
    if (payload.sourcePlatform === "LALAFO") {
      const lalafoResult = extractLalafoListing(html, canonicalUrl);
      if (lalafoResult.ok) {
        title = title ?? sanitizeListingTitle(lalafoResult.data.title);
        description = description ?? lalafoResult.data.description;
        rawPrice = rawPrice ?? lalafoResult.data.rawPrice;
        city = city ?? lalafoResult.data.city;
        images = filterImages([...images, ...lalafoResult.data.images], canonicalUrl);
      }
    } else {
      const ogTitle = extractMetaContent(html, "og:title") ?? extractTitleTag(html);
      const ogDescription =
        extractMetaContent(html, "og:description") ?? extractMetaContent(html, "description");
      const ogImage = extractMetaContent(html, "og:image");
      title = title ?? sanitizeListingTitle(ogTitle);
      description =
        description ??
        (ogDescription ? stripHtmlTags(ogDescription) : null);
      if (ogImage) {
        images = filterImages([...images, ogImage], canonicalUrl);
      }
    }
  }

  if (!rawPrice) {
    rawPrice = extractPriceFromText(bodyText, payload.extracted?.currency ?? defaultCurrency);
  }

  if (!description) {
    description = extractDescriptionFromBodyText(bodyText);
  }

  if (!title) {
    title = sanitizeListingTitle(pageTitle) ?? hints.titleFromSlug;
  }

  const priceParsed = parsePriceText(rawPrice);
  const currency = payload.extracted?.currency ?? priceParsed.normalizedCurrency ?? defaultCurrency;

  const mappedCategory = mapExternalCategory({
    title,
    description,
  });

  const hasMinimumData =
    Boolean(title) ||
    Boolean(description) ||
    Boolean(rawPrice) ||
    images.length > 0;

  if (!hasMinimumData) {
    throw new ValidationError(
      "Не найдены данные объявления. Убедитесь, что страница полностью загружена.",
      { importErrorCode: "EXTRACTION_FAILED" },
    );
  }

  const fieldsFound = buildFieldsFound({
    title,
    description,
    rawPrice: priceParsed.rawPrice,
    city,
    images,
    categoryText: mappedCategory.normalizedCategory,
  });

  const score = [
    fieldsFound.title,
    fieldsFound.price,
    fieldsFound.description,
    fieldsFound.images > 0,
  ].filter(Boolean).length;

  return {
    sourcePlatform: payload.sourcePlatform,
    sourceUrl: canonicalUrl,
    sourceExternalId: hints.sourceExternalId,
    title,
    description,
    rawPrice: priceParsed.rawPrice,
    currency,
    city,
    categoryText: mappedCategory.normalizedCategory,
    subcategoryText: mappedCategory.normalizedSubcategory,
    images,
    rawContact: null,
    partial: score < 3,
    fieldsFound,
  };
}
