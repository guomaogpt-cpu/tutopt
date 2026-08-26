import {
  extractMetaContent,
  extractTitleTag,
  stripHtmlTags,
  toAbsoluteUrl,
  uniqueUrls,
} from "@/server/import/parse-html-meta";
import type { ExtractedListingData, ExtractedListingResult } from "@/server/import/types";

export function extractInstagramListing(html: string, finalUrl: string): ExtractedListingResult {
  const ogTitle = extractMetaContent(html, "og:title");
  const ogDescription = extractMetaContent(html, "og:description");
  const ogImage = extractMetaContent(html, "og:image");
  const title = ogTitle ?? extractTitleTag(html);

  if (!title && !ogDescription && !ogImage) {
    return {
      ok: false,
      error:
        "Не удалось получить данные Instagram. Загрузите скриншот или вставьте текст вручную.",
    };
  }

  const data: ExtractedListingData = {
    sourcePlatform: "INSTAGRAM",
    sourceUrl: finalUrl,
    sourceExternalId: finalUrl.match(/\/(p|reel|tv)\/([^/?#]+)/i)?.[2] ?? null,
    title: title ? stripHtmlTags(title) : "Instagram import",
    description: ogDescription ? stripHtmlTags(ogDescription) : null,
    rawPrice: null,
    currency: "KGS",
    city: null,
    categoryText: null,
    subcategoryText: null,
    images: uniqueUrls(
      ogImage ? [toAbsoluteUrl(ogImage, finalUrl)].filter((value): value is string => Boolean(value)) : [],
    ),
    rawContact: null,
  };

  return { ok: true, data };
}
