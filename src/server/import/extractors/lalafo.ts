import {
  extractDescriptionMeta,
  extractEmbeddedJsonState,
  extractFirstMatch,
  extractJsonLdObjects,
  extractMetaContent,
  extractNextDataObject,
  extractTitleTag,
  extractTwitterMeta,
  stripHtmlTags,
  toAbsoluteUrl,
  uniqueUrls,
} from "@/server/import/parse-html-meta";
import {
  extractLalafoBreadcrumbLabels,
  extractLalafoBreadcrumbSlugs,
  extractLalafoExternalId,
  extractPhoneContacts,
  parseLalafoTitleParts,
  parsePriceText,
} from "@/server/import/category-mapper";
import { parseLalafoUrlHints, titleFromLalafoSlug } from "@/server/import/lalafo-url-hints";
import type { ExtractedListingData, ExtractedListingResult } from "@/server/import/types";

function extractJsonLdProduct(html: string): {
  title?: string;
  description?: string;
  price?: string;
  currency?: string;
  images?: string[];
} | null {
  for (const object of extractJsonLdObjects(html)) {
    if (!object || typeof object !== "object") {
      continue;
    }

    const record = object as Record<string, unknown>;
    const typeValue = record["@type"];
    const types = Array.isArray(typeValue) ? typeValue : [typeValue];
    if (!types.some((type) => typeof type === "string" && /Product|Offer/i.test(type))) {
      continue;
    }

    const offers = record.offers;
    const offer = Array.isArray(offers) ? offers[0] : offers;
    const offerRecord =
      offer && typeof offer === "object" ? (offer as Record<string, unknown>) : null;

    const imagesRaw = record.image;
    const images = Array.isArray(imagesRaw)
      ? imagesRaw.filter((item): item is string => typeof item === "string")
      : typeof imagesRaw === "string"
        ? [imagesRaw]
        : [];

    return {
      title: typeof record.name === "string" ? record.name : undefined,
      description: typeof record.description === "string" ? record.description : undefined,
      price:
        typeof offerRecord?.price === "string" || typeof offerRecord?.price === "number"
          ? String(offerRecord.price)
          : undefined,
      currency: typeof offerRecord?.priceCurrency === "string" ? offerRecord.priceCurrency : undefined,
      images,
    };
  }

  return null;
}

function findStringDeep(value: unknown, keys: string[], depth = 0): string | null {
  if (depth > 8 || value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findStringDeep(item, keys, depth + 1);
      if (found) {
        return found;
      }
    }
    return null;
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of keys) {
      const candidate = record[key];
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
    for (const nested of Object.values(record)) {
      const found = findStringDeep(nested, keys, depth + 1);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

function extractFromEmbeddedState(html: string): {
  title?: string;
  description?: string;
  price?: string;
  images?: string[];
} {
  const nextData = extractNextDataObject(html);
  const embedded = extractEmbeddedJsonState(html);
  const source = nextData ?? embedded;
  if (!source) {
    return {};
  }

  const title = findStringDeep(source, ["title", "name", "heading"]);
  const description = findStringDeep(source, ["description", "about", "text"]);
  const priceValue = findStringDeep(source, ["price", "amount", "cost"]);
  const image = findStringDeep(source, ["image", "poster", "photo", "thumbnail"]);

  return {
    title: title ?? undefined,
    description: description ?? undefined,
    price: priceValue ?? undefined,
    images: image ? [image] : undefined,
  };
}

function buildFieldsFound(data: Pick<ExtractedListingData, "title" | "description" | "rawPrice" | "images">) {
  return {
    title: Boolean(data.title?.trim()),
    description: Boolean(data.description?.trim()),
    images: data.images.length,
    price: Boolean(data.rawPrice?.trim()),
  };
}

export function extractLalafoListing(html: string, finalUrl: string): ExtractedListingResult {
  const urlHints = parseLalafoUrlHints(finalUrl);

  const ogTitle = extractMetaContent(html, "og:title") ?? extractTwitterMeta(html, "title") ?? extractTitleTag(html);
  const ogDescription =
    extractMetaContent(html, "og:description") ??
    extractTwitterMeta(html, "description") ??
    extractDescriptionMeta(html);
  const ogImage = extractMetaContent(html, "og:image") ?? extractTwitterMeta(html, "image");
  const jsonLd = extractJsonLdProduct(html);
  const embedded = extractFromEmbeddedState(html);

  const titleParts = parseLalafoTitleParts(ogTitle);
  const h1 =
    extractFirstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)
      ?.replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim() ?? null;

  const descriptionBlock =
    extractFirstMatch(html, /AdDetailDescription_adDetailDescription__[^"]*"[^>]*>([\s\S]*?)<\/p>/i) ??
    extractFirstMatch(html, /<div class="descriptionWrap[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);

  const description = descriptionBlock
    ? stripHtmlTags(descriptionBlock)
    : ogDescription
      ? stripHtmlTags(ogDescription)
      : jsonLd?.description ?? embedded.description ?? null;

  const priceFromHtml =
    extractFirstMatch(html, /AdDetailPrice_adDetailPriceContainer__[^"]*"[\s\S]*?<p[^>]*>([^<]+)<\/p>/i) ??
    extractFirstMatch(html, /(\d[\d\s.,]*\s*(?:KGS|USD|EUR|сом|\$|€))/i);

  const rawPrice =
    titleParts.rawPrice ??
    priceFromHtml ??
    embedded.price ??
    (jsonLd?.price ? `${jsonLd.price} ${jsonLd.currency ?? "KGS"}` : null);

  const priceParsed = parsePriceText(rawPrice);

  const city =
    titleParts.city ??
    urlHints.city ??
    extractFirstMatch(html, /AdDetailMap_adDetailCityWrap__[\s\S]*?<p[^>]*>([^<]+)<\/p>/i) ??
    null;

  const breadcrumbLabels = extractLalafoBreadcrumbLabels(html);
  const breadcrumbSlugs = extractLalafoBreadcrumbSlugs(html);
  const categoryText = breadcrumbLabels.at(-3) ?? breadcrumbLabels.at(-2) ?? null;
  const subcategoryText = titleParts.subcategoryText ?? breadcrumbLabels.at(-1) ?? null;

  const images = uniqueUrls([
    ...(ogImage ? [toAbsoluteUrl(ogImage, finalUrl)].filter((value): value is string => Boolean(value)) : []),
    ...(jsonLd?.images ?? [])
      .map((image) => toAbsoluteUrl(image, finalUrl))
      .filter((value): value is string => Boolean(value)),
    ...(embedded.images ?? [])
      .map((image) => toAbsoluteUrl(image, finalUrl))
      .filter((value): value is string => Boolean(value)),
    ...[...html.matchAll(/https:\/\/img\d+\.lalafo\.com\/i\/posters\/[^"'\\s]+/gi)].map(
      (match) => match[0] ?? "",
    ),
  ]);

  const slugTitle =
    urlHints.titleFromSlug ??
    (urlHints.slug ? titleFromLalafoSlug(urlHints.slug) : null);

  const title =
    h1 ??
    titleParts.title ??
    jsonLd?.title ??
    embedded.title ??
    slugTitle ??
    null;

  const hasMinimumData = Boolean(title?.trim() || description?.trim() || images.length > 0);
  if (!hasMinimumData) {
    return {
      ok: false,
      error: "Ссылку открыли, но данные объявления не найдены.",
      code: "EXTRACTION_FAILED",
    };
  }

  const partial = !h1 && !jsonLd?.title && !embedded.title && Boolean(slugTitle);

  const data: ExtractedListingData = {
    sourcePlatform: "LALAFO",
    sourceUrl: finalUrl,
    sourceExternalId:
      extractLalafoExternalId(finalUrl, html) ?? titleParts.sourceExternalId ?? urlHints.sourceExternalId,
    title,
    description,
    rawPrice: priceParsed.rawPrice,
    currency: priceParsed.normalizedCurrency,
    city,
    categoryText,
    subcategoryText,
    breadcrumbSlugs,
    images,
    rawContact: extractPhoneContacts(html),
    partial,
    fieldsFound: buildFieldsFound({ title, description, rawPrice: priceParsed.rawPrice, images }),
  };

  return { ok: true, data };
}

export function buildLalafoPartialDataFromUrl(finalUrl: string): ExtractedListingData | null {
  const hints = parseLalafoUrlHints(finalUrl);
  if (!hints.titleFromSlug && !hints.sourceExternalId) {
    return null;
  }

  const title = hints.titleFromSlug;
  const data: ExtractedListingData = {
    sourcePlatform: "LALAFO",
    sourceUrl: finalUrl,
    sourceExternalId: hints.sourceExternalId,
    title,
    description: null,
    rawPrice: null,
    currency: "KGS",
    city: hints.city,
    categoryText: null,
    subcategoryText: null,
    images: [],
    rawContact: null,
    partial: true,
    fieldsFound: {
      title: Boolean(title?.trim()),
      description: false,
      images: 0,
      price: false,
    },
  };

  return data;
}
