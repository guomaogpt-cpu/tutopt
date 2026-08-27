import { validateImportUrl } from "@/server/import/safe-fetch-url";
import { logger } from "@/shared/lib/logger";

const LALAFO_API_BASE = "https://lalafo.kg/api/search/v3/feed/details";
const LALAFO_API_TIMEOUT_MS = 12_000;

const LALAFO_API_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 VseTutImportBot/1.0",
  Accept: "application/json",
  "Accept-Language": "ru-RU,ru;q=0.9",
  Device: "pc",
  "Country-Id": "12",
  Language: "ru_RU",
} as const;

export type LalafoApiImage = {
  original_url?: string;
  thumbnail_url?: string;
};

export type LalafoApiAd = {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  city: string | null;
  images: LalafoApiImage[];
  mobile: string | null;
  url: string | null;
  category_id: number | null;
  is_negotiable: boolean;
};

export type LalafoApiFetchResult =
  | { ok: true; data: LalafoApiAd; statusCode: number; responseSize: number }
  | { ok: false; reason: string; statusCode?: number };

function parseLalafoApiAd(payload: unknown): LalafoApiAd | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  if (typeof record.id !== "number" || typeof record.title !== "string") {
    return null;
  }

  const imagesRaw = Array.isArray(record.images) ? record.images : [];
  const images: LalafoApiImage[] = imagesRaw
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => ({
      original_url: typeof item.original_url === "string" ? item.original_url : undefined,
      thumbnail_url: typeof item.thumbnail_url === "string" ? item.thumbnail_url : undefined,
    }));

  return {
    id: record.id,
    title: record.title,
    description: typeof record.description === "string" ? record.description : null,
    price: typeof record.price === "number" ? record.price : null,
    currency: typeof record.currency === "string" ? record.currency : null,
    city: typeof record.city === "string" ? record.city : null,
    images,
    mobile: typeof record.mobile === "string" ? record.mobile : null,
    url: typeof record.url === "string" ? record.url : null,
    category_id: typeof record.category_id === "number" ? record.category_id : null,
    is_negotiable: record.is_negotiable === true,
  };
}

export function extractLalafoAdIdFromUrl(url: string): string | null {
  return url.match(/-id-(\d+)/i)?.[1] ?? url.match(/[?&]id=(\d+)/i)?.[1] ?? null;
}

export async function fetchLalafoAdById(adId: string): Promise<LalafoApiFetchResult> {
  if (!/^\d{5,}$/.test(adId)) {
    return { ok: false, reason: "invalid ad id" };
  }

  const apiUrl = `${LALAFO_API_BASE}/${adId}`;
  await validateImportUrl(apiUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LALAFO_API_TIMEOUT_MS);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      signal: controller.signal,
      headers: LALAFO_API_HEADERS,
    });

    const bodyText = await response.text();
    const responseSize = bodyText.length;

    if (!response.ok) {
      logger.warn("Lalafo API fetch failed", {
        adId,
        status: response.status,
        bodyPreview: bodyText.slice(0, 200),
      });
      return {
        ok: false,
        reason: `HTTP ${response.status}`,
        statusCode: response.status,
      };
    }

    let payload: unknown;
    try {
      payload = JSON.parse(bodyText) as unknown;
    } catch {
      return { ok: false, reason: "invalid JSON", statusCode: response.status };
    }

    const parsed = parseLalafoApiAd(payload);
    if (!parsed) {
      return { ok: false, reason: "unexpected API payload", statusCode: response.status };
    }

    logger.info("Lalafo API fetched", { adId, bytes: responseSize });

    return {
      ok: true,
      data: parsed,
      statusCode: response.status,
      responseSize,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "fetch failed";
    return { ok: false, reason };
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchLalafoAdFromPageUrl(pageUrl: string): Promise<LalafoApiFetchResult> {
  const adId = extractLalafoAdIdFromUrl(pageUrl);
  if (!adId) {
    return { ok: false, reason: "ad id not found in URL" };
  }
  return fetchLalafoAdById(adId);
}

export function lalafoApiImagesToUrls(ad: LalafoApiAd): string[] {
  return ad.images
    .map((image) => image.original_url ?? image.thumbnail_url ?? null)
    .filter((value): value is string => Boolean(value));
}

export function lalafoApiPriceText(ad: LalafoApiAd): string | null {
  if (ad.is_negotiable || ad.price === null) {
    return "Договорная";
  }
  return `${ad.price} ${ad.currency ?? "KGS"}`;
}
