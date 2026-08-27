export type EmbeddedListingSnapshot = {
  title: string | null;
  description: string | null;
  rawPrice: string | null;
  currency: string | null;
  city: string | null;
  images: string[];
};

const TITLE_KEYS = ["title", "name", "headline"];
const DESCRIPTION_KEYS = ["description", "body", "text", "about"];
const PRICE_KEYS = ["price", "amount", "cost"];
const CURRENCY_KEYS = ["currency", "priceCurrency", "currency_code"];
const CITY_KEYS = ["city", "location", "locality", "addressLocality"];
const IMAGE_KEYS = ["images", "photos", "gallery", "pictures"];

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

function collectImageUrls(value: unknown, depth = 0, acc: string[] = []): string[] {
  if (depth > 10 || acc.length >= 10) {
    return acc;
  }

  if (typeof value === "string") {
    if (/^https?:\/\//i.test(value) && !value.startsWith("data:")) {
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
    for (const key of IMAGE_KEYS) {
      if (key in value) {
        collectImageUrls(value[key], depth + 1, acc);
      }
    }

    for (const [key, nested] of Object.entries(value)) {
      if (/url|src|original|thumbnail/i.test(key)) {
        collectImageUrls(nested, depth + 1, acc);
      }
    }
  }

  return acc;
}

function scanNode(node: unknown, snapshot: EmbeddedListingSnapshot, depth = 0): void {
  if (depth > 12 || !isRecord(node)) {
    return;
  }

  snapshot.title ??= pickString(node, TITLE_KEYS);
  snapshot.description ??= pickString(node, DESCRIPTION_KEYS);
  snapshot.rawPrice ??= pickString(node, PRICE_KEYS);
  snapshot.currency ??= pickString(node, CURRENCY_KEYS);
  snapshot.city ??= pickString(node, CITY_KEYS);

  if (snapshot.images.length < 10) {
    snapshot.images.push(...collectImageUrls(node, depth, []));
  }

  for (const nested of Object.values(node)) {
    if (isRecord(nested) || Array.isArray(nested)) {
      scanNode(nested, snapshot, depth + 1);
    }
  }
}

export function scanEmbeddedListingJson(payload: unknown): EmbeddedListingSnapshot {
  const snapshot: EmbeddedListingSnapshot = {
    title: null,
    description: null,
    rawPrice: null,
    currency: null,
    city: null,
    images: [],
  };

  if (Array.isArray(payload)) {
    for (const item of payload) {
      scanNode(item, snapshot);
    }
  } else {
    scanNode(payload, snapshot);
  }

  snapshot.images = [...new Set(snapshot.images)].slice(0, 10);
  return snapshot;
}
