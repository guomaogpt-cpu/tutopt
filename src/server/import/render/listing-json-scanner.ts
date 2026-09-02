import { uniqueUrls } from "@/server/import/parse-html-meta";

export type ListingJsonSnapshot = {
  title: string | null;
  description: string | null;
  rawPrice: string | null;
  currency: string | null;
  city: string | null;
  categoryText: string | null;
  images: string[];
  sourceExternalId: string | null;
};

const TITLE_KEYS = ["title", "name", "subject", "heading"];
const DESCRIPTION_KEYS = ["description", "body", "text", "content", "about"];
const PRICE_KEYS = ["price", "amount", "value", "cost", "priceValue"];
const CURRENCY_KEYS = ["currency", "currencyCode", "currencySymbol", "priceCurrency"];
const CITY_KEYS = ["city", "location", "region", "addressLocality", "locality"];
const CATEGORY_KEYS = ["categoryName", "category", "categoryText"];
const ID_KEYS = ["id", "ad_id", "adId", "listingId", "itemId"];

const IMAGE_BLOCKLIST = /logo|avatar|icon|sprite|placeholder|favicon|\.svg(\?|$)/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function pickString(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return null;
}

function isProductImageUrl(url: string): boolean {
  if (!/^https?:\/\//i.test(url) || url.startsWith("data:")) {
    return false;
  }
  return !IMAGE_BLOCKLIST.test(url);
}

function collectImageUrls(value: unknown, depth = 0, acc: string[] = []): string[] {
  if (depth > 12 || acc.length >= 10) {
    return acc;
  }

  if (typeof value === "string") {
    if (isProductImageUrl(value)) {
      acc.push(value);
    }
    return acc;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectImageUrls(item, depth + 1, acc);
      if (acc.length >= 10) {
        break;
      }
    }
    return acc;
  }

  if (isRecord(value)) {
    if (typeof value.original_url === "string" && isProductImageUrl(value.original_url)) {
      acc.push(value.original_url);
    }
    if (typeof value.thumbnail_url === "string" && isProductImageUrl(value.thumbnail_url)) {
      acc.push(value.thumbnail_url);
    }
    for (const [key, nested] of Object.entries(value)) {
      if (/image|photo|gallery|picture|url|src/i.test(key)) {
        collectImageUrls(nested, depth + 1, acc);
      }
    }
  }

  return acc;
}

function scanNode(node: unknown, snapshot: ListingJsonSnapshot, depth = 0): void {
  if (depth > 14 || !isRecord(node)) {
    return;
  }

  snapshot.title ??= pickString(node, TITLE_KEYS);
  snapshot.description ??= pickString(node, DESCRIPTION_KEYS);
  snapshot.rawPrice ??= pickString(node, PRICE_KEYS);
  snapshot.currency ??= pickString(node, CURRENCY_KEYS);
  snapshot.city ??= pickString(node, CITY_KEYS);
  snapshot.categoryText ??= pickString(node, CATEGORY_KEYS);
  snapshot.sourceExternalId ??= pickString(node, ID_KEYS);

  if (snapshot.images.length < 10) {
    snapshot.images.push(...collectImageUrls(node, depth, []));
  }

  for (const nested of Object.values(node)) {
    if (isRecord(nested) || Array.isArray(nested)) {
      scanNode(nested, snapshot, depth + 1);
    }
  }
}

export function scanListingJson(payload: unknown): ListingJsonSnapshot {
  const snapshot: ListingJsonSnapshot = {
    title: null,
    description: null,
    rawPrice: null,
    currency: null,
    city: null,
    categoryText: null,
    images: [],
    sourceExternalId: null,
  };

  if (Array.isArray(payload)) {
    for (const item of payload) {
      scanNode(item, snapshot);
    }
  } else {
    scanNode(payload, snapshot);
  }

  snapshot.images = uniqueUrls(snapshot.images.filter(isProductImageUrl)).slice(0, 10);
  return snapshot;
}

export function objectMatchesAdId(record: Record<string, unknown>, targetId: string): boolean {
  for (const key of ID_KEYS) {
    const value = record[key];
    if (value !== undefined && String(value) === targetId) {
      return true;
    }
  }
  return false;
}

export function isLikelyAdObject(record: Record<string, unknown>): boolean {
  const hasTitle = Boolean(pickString(record, TITLE_KEYS));
  const hasPrice = record.price !== undefined && record.price !== null;
  const hasImages = Array.isArray(record.images) && record.images.length > 0;
  const hasDescription = Boolean(pickString(record, DESCRIPTION_KEYS));
  return hasTitle && (hasPrice || hasImages || hasDescription);
}

export function findAdObjectById(
  node: unknown,
  targetId: string,
  depth = 0,
): Record<string, unknown> | null {
  if (depth > 16) {
    return null;
  }

  if (isRecord(node)) {
    if (objectMatchesAdId(node, targetId) && isLikelyAdObject(node)) {
      return node;
    }
    for (const nested of Object.values(node)) {
      const found = findAdObjectById(nested, targetId, depth + 1);
      if (found) {
        return found;
      }
    }
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findAdObjectById(item, targetId, depth + 1);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

export function payloadContainsTargetId(payload: unknown, targetId: string): boolean {
  return findAdObjectById(payload, targetId) !== null;
}
