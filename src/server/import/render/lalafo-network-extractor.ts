import { parsePriceText } from "@/server/import/category-mapper";
import { lalafoApiImagesToUrls, lalafoApiPriceText } from "@/server/import/lalafo-api";
import type { LalafoApiAd } from "@/server/import/lalafo-api";
import {
  findAdObjectById,
  payloadContainsTargetId,
  scanListingJson,
  type ListingJsonSnapshot,
} from "@/server/import/render/listing-json-scanner";
import { sanitizeListingTitle } from "@/server/import/render/title-validation";
import { uniqueUrls } from "@/server/import/parse-html-meta";
import type { ExtractedListingData } from "@/server/import/types";

export type CapturedNetworkJson = {
  url: string;
  payload: unknown;
  containsTargetId: boolean;
};

const MAX_RESPONSES = 30;
const MAX_RESPONSE_BYTES = 1_048_576;
const MAX_TOTAL_BYTES = 5_242_880;

const CAPTURE_URL_PATTERN =
  /api|ads|advert|item|listing|graphql|classifieds|lalafo|feed\/details/i;

export class NetworkResponseCollector {
  private readonly responses: CapturedNetworkJson[] = [];
  private totalBytes = 0;
  private readonly targetAdId: string | null;

  constructor(targetAdId: string | null) {
    this.targetAdId = targetAdId;
  }

  get count(): number {
    return this.responses.length;
  }

  get withTargetIdCount(): number {
    return this.responses.filter((item) => item.containsTargetId).length;
  }

  get payloads(): CapturedNetworkJson[] {
    return this.responses;
  }

  isFull(): boolean {
    return this.responses.length >= MAX_RESPONSES || this.totalBytes >= MAX_TOTAL_BYTES;
  }

  async captureResponse(response: {
    url: () => string;
    headers: () => Record<string, string>;
    text: () => Promise<string>;
  }): Promise<void> {
    if (this.isFull()) {
      return;
    }

    const url = response.url();
    const contentType = response.headers()["content-type"] ?? "";
    const isJson =
      contentType.includes("application/json") ||
      contentType.includes("text/json") ||
      contentType.includes("+json");

    if (!isJson && !CAPTURE_URL_PATTERN.test(url)) {
      return;
    }

    if (!CAPTURE_URL_PATTERN.test(url) && !isJson) {
      return;
    }

    let bodyText: string;
    try {
      bodyText = await response.text();
    } catch {
      return;
    }

    if (bodyText.length > MAX_RESPONSE_BYTES) {
      return;
    }

    if (this.totalBytes + bodyText.length > MAX_TOTAL_BYTES) {
      return;
    }

    let payload: unknown;
    try {
      payload = JSON.parse(bodyText) as unknown;
    } catch {
      return;
    }

    const containsTargetId = this.targetAdId
      ? payloadContainsTargetId(payload, this.targetAdId)
      : false;

    this.responses.push({ url, payload, containsTargetId });
    this.totalBytes += bodyText.length;
  }
}

function snapshotToPartial(
  snapshot: ListingJsonSnapshot,
  sourceUrl: string,
  sourceExternalId: string | null,
): Partial<ExtractedListingData> {
  const priceParsed = parsePriceText(snapshot.rawPrice);
  const title = sanitizeListingTitle(snapshot.title);

  return {
    sourcePlatform: "LALAFO",
    sourceUrl,
    sourceExternalId,
    title,
    description: snapshot.description,
    rawPrice: priceParsed.rawPrice,
    currency: priceParsed.normalizedCurrency ?? snapshot.currency,
    city: snapshot.city,
    categoryText: snapshot.categoryText,
    images: uniqueUrls(snapshot.images),
    partial: false,
  };
}

function adRecordToPartial(
  record: Record<string, unknown>,
  sourceUrl: string,
  targetId: string,
): Partial<ExtractedListingData> | null {
  const id = typeof record.id === "number" ? record.id : Number(targetId);
  if (!Number.isFinite(id)) {
    return null;
  }

  const ad: LalafoApiAd = {
    id,
    title: typeof record.title === "string" ? record.title : "",
    description: typeof record.description === "string" ? record.description : null,
    price: typeof record.price === "number" ? record.price : null,
    currency: typeof record.currency === "string" ? record.currency : null,
    city: typeof record.city === "string" ? record.city : null,
    images: Array.isArray(record.images)
      ? record.images
          .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
          .map((item) => ({
            original_url: typeof item.original_url === "string" ? item.original_url : undefined,
            thumbnail_url: typeof item.thumbnail_url === "string" ? item.thumbnail_url : undefined,
          }))
      : [],
    mobile: typeof record.mobile === "string" ? record.mobile : null,
    url: typeof record.url === "string" ? record.url : sourceUrl,
    category_id: typeof record.category_id === "number" ? record.category_id : null,
    is_negotiable: record.is_negotiable === true,
  };

  if (!sanitizeListingTitle(ad.title)) {
    return null;
  }

  const rawPrice = lalafoApiPriceText(ad);
  const priceParsed = parsePriceText(rawPrice);

  return {
    sourcePlatform: "LALAFO",
    sourceUrl: ad.url ?? sourceUrl,
    sourceExternalId: String(ad.id),
    title: ad.title,
    description: ad.description,
    rawPrice: priceParsed.rawPrice,
    currency: priceParsed.normalizedCurrency ?? ad.currency ?? "KGS",
    city: ad.city,
    images: lalafoApiImagesToUrls(ad),
    rawContact: ad.mobile,
    partial: false,
  };
}

export function extractLalafoFromNetworkResponses(params: {
  responses: CapturedNetworkJson[];
  targetAdId: string | null;
  sourceUrl: string;
}): { data: Partial<ExtractedListingData>; matchedTargetId: boolean } | null {
  if (params.responses.length === 0) {
    return null;
  }

  if (params.targetAdId) {
    for (const response of params.responses) {
      const adObject = findAdObjectById(response.payload, params.targetAdId);
      if (adObject) {
        const partial = adRecordToPartial(adObject, params.sourceUrl, params.targetAdId);
        if (partial) {
          return { data: partial, matchedTargetId: true };
        }
      }
    }
  }

  let best: Partial<ExtractedListingData> | null = null;
  let bestScore = 0;

  for (const response of params.responses) {
    const snapshot = scanListingJson(response.payload);
    const partial = snapshotToPartial(snapshot, params.sourceUrl, params.targetAdId);
    const title = partial.title;
    if (!title) {
      continue;
    }

    let score = 1;
    if (partial.rawPrice) {
      score += 2;
    }
    if ((partial.images?.length ?? 0) > 0) {
      score += 2;
    }
    if (partial.description) {
      score += 1;
    }
    if (response.containsTargetId) {
      score += 5;
    }

    if (score > bestScore) {
      bestScore = score;
      best = partial;
    }
  }

  if (!best) {
    return null;
  }

  return { data: best, matchedTargetId: false };
}
