import {
  extractFirstMatch,
  extractJsonLdObjects,
  extractMetaContent,
  extractTitleTag,
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

export function extractLalafoListing(html: string, finalUrl: string): ExtractedListingResult {
  const ogTitle = extractMetaContent(html, "og:title") ?? extractTitleTag(html);
  const ogDescription = extractMetaContent(html, "og:description");
  const ogImage = extractMetaContent(html, "og:image");
  const jsonLd = extractJsonLdProduct(html);

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
      : jsonLd?.description ?? null;

  const priceFromHtml =
    extractFirstMatch(html, /AdDetailPrice_adDetailPriceContainer__[^"]*"[\s\S]*?<p[^>]*>([^<]+)<\/p>/i) ??
    extractFirstMatch(html, /(\d[\d\s.,]*\s*(?:KGS|USD|EUR|сом|\$|€))/i);

  const rawPrice =
    titleParts.rawPrice ??
    priceFromHtml ??
    (jsonLd?.price ? `${jsonLd.price} ${jsonLd.currency ?? "KGS"}` : null);

  const priceParsed = parsePriceText(rawPrice);

  const city =
    titleParts.city ??
    extractFirstMatch(html, /AdDetailMap_adDetailCityWrap__[\s\S]*?<p[^>]*>([^<]+)<\/p>/i) ??
    "Бишкек";

  const breadcrumbLabels = extractLalafoBreadcrumbLabels(html);
  const breadcrumbSlugs = extractLalafoBreadcrumbSlugs(html);
  const categoryText = breadcrumbLabels.at(-3) ?? breadcrumbLabels.at(-2) ?? null;
  const subcategoryText = titleParts.subcategoryText ?? breadcrumbLabels.at(-1) ?? null;

  const images = uniqueUrls([
    ...(ogImage ? [toAbsoluteUrl(ogImage, finalUrl)].filter((value): value is string => Boolean(value)) : []),
    ...(jsonLd?.images ?? [])
      .map((image) => toAbsoluteUrl(image, finalUrl))
      .filter((value): value is string => Boolean(value)),
    ...[...html.matchAll(/https:\/\/img\d+\.lalafo\.com\/i\/posters\/[^"'\\s]+/gi)].map(
      (match) => match[0] ?? "",
    ),
  ]);

  const title = h1 ?? titleParts.title ?? jsonLd?.title ?? null;
  if (!title) {
    return { ok: false, error: "На странице не найдено данных объявления." };
  }

  const data: ExtractedListingData = {
    sourcePlatform: "LALAFO",
    sourceUrl: finalUrl,
    sourceExternalId: extractLalafoExternalId(finalUrl, html) ?? titleParts.sourceExternalId,
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
  };

  return { ok: true, data };
}
