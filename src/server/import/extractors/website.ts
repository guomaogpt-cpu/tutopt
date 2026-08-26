import {
  extractJsonLdObjects,
  extractMetaContent,
  extractTitleTag,
  stripHtmlTags,
  toAbsoluteUrl,
  uniqueUrls,
} from "@/server/import/parse-html-meta";
import type { ExtractedListingData, ExtractedListingResult } from "@/server/import/types";

export function extractWebsiteListing(html: string, finalUrl: string): ExtractedListingResult {
  const ogTitle = extractMetaContent(html, "og:title");
  const ogDescription =
    extractMetaContent(html, "og:description") ?? extractMetaContent(html, "description");
  const ogImage = extractMetaContent(html, "og:image");
  const title = ogTitle ?? extractTitleTag(html);

  let jsonTitle: string | null = null;
  let jsonDescription: string | null = null;
  for (const object of extractJsonLdObjects(html)) {
    if (!object || typeof object !== "object") {
      continue;
    }
    const record = object as Record<string, unknown>;
    if (typeof record.name === "string" && !jsonTitle) {
      jsonTitle = record.name;
    }
    if (typeof record.description === "string" && !jsonDescription) {
      jsonDescription = record.description;
    }
  }

  const resolvedTitle = title ?? jsonTitle;
  if (!resolvedTitle) {
    return { ok: false, error: "На странице не найдено данных объявления." };
  }

  const data: ExtractedListingData = {
    sourcePlatform: "WEBSITE",
    sourceUrl: finalUrl,
    sourceExternalId: null,
    title: stripHtmlTags(resolvedTitle),
    description: ogDescription
      ? stripHtmlTags(ogDescription)
      : jsonDescription
        ? stripHtmlTags(jsonDescription)
        : null,
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
