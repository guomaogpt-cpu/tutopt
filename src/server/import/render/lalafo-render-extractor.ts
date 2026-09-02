import { parsePriceText } from "@/server/import/category-mapper";
import { extractLalafoListing } from "@/server/import/extractors/lalafo";
import type { ImportExtractionDebug } from "@/server/import/import-error-codes";
import { parseLalafoUrlHints } from "@/server/import/lalafo-url-hints";
import {
  extractEmbeddedJsonState,
  extractJsonLdObjects,
  extractNextDataObject,
  uniqueUrls,
} from "@/server/import/parse-html-meta";
import { scanEmbeddedListingJson } from "@/server/import/render/embedded-json-scanner";
import { hasMeaningfulLalafoFields } from "@/server/import/render/render-field-utils";
import { invalidateRenderBrowserProbeCache } from "@/server/import/render/render-browser-probe";
import {
  classifyRenderFailure,
  type RenderFallbackFailureCode,
} from "@/server/import/render/render-failure";
import {
  IMPORT_RENDER_NAVIGATION_TIMEOUT_MS,
  getRenderFallbackUnavailableReason,
  isNodeVersionSupportedForRender,
  isRenderFallbackEnabled,
} from "@/server/import/render/render-config";
import { validateImportUrl } from "@/server/import/safe-fetch-url";
import type { ExtractedListingData, ExtractedListingResult } from "@/server/import/types";
import { logger } from "@/shared/lib/logger";

export type LalafoRenderExtractResult =
  | { ok: true; extracted: ExtractedListingData; debug: ImportExtractionDebug }
  | {
      ok: false;
      code: RenderFallbackFailureCode;
      reason: string;
      debug?: ImportExtractionDebug;
    };

function buildRenderDebug(params: {
  canonicalUrl: string;
  failure?: ReturnType<typeof classifyRenderFailure>;
  attempted?: boolean;
  succeeded?: boolean;
  browserLaunchable?: boolean;
  playwrightPackageAvailable?: boolean;
  browserExecutableAvailable?: boolean;
  extra?: ImportExtractionDebug;
}): ImportExtractionDebug {
  return {
    requestedUrl: params.canonicalUrl,
    extractorUsed: "LALAFO",
    extractionSource: params.succeeded ? "browser-render" : "failed",
    renderFallbackEnabled: isRenderFallbackEnabled(),
    renderFallbackAvailable: params.browserLaunchable ?? false,
    renderFallbackAttempted: params.attempted ?? false,
    renderFallbackSucceeded: params.succeeded ?? false,
    playwrightPackageAvailable: params.playwrightPackageAvailable,
    browserExecutableAvailable: params.browserExecutableAvailable,
    browserLaunchable: params.browserLaunchable,
    renderFallbackFailureCode: params.failure?.code,
    failureReason: params.failure?.userMessage,
    missingLibrary: params.failure?.missingLibrary,
    technicalReason: params.failure?.technicalReason,
    ...params.extra,
  };
}

type DomSnapshot = {
  title: string | null;
  priceText: string | null;
  description: string | null;
  imageUrls: string[];
  city: string | null;
  categoryLabels: string[];
};

const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 VseTutImportBot/1.0";

const IMAGE_BLOCKLIST = /logo|avatar|icon|sprite|placeholder|favicon|emoji|banner-ad/i;

function filterProductImages(urls: string[]): string[] {
  return uniqueUrls(
    urls.filter((url) => {
      if (url.startsWith("data:")) {
        return false;
      }
      return !IMAGE_BLOCKLIST.test(url);
    }),
  );
}

function mergeExtracted(
  primary: ExtractedListingData,
  secondary: Partial<ExtractedListingData>,
): ExtractedListingData {
  const images = filterProductImages([...primary.images, ...(secondary.images ?? [])]);
  const title = primary.title ?? secondary.title ?? null;
  const description = primary.description ?? secondary.description ?? null;
  const rawPrice = primary.rawPrice ?? secondary.rawPrice ?? null;
  const city = primary.city ?? secondary.city ?? null;
  const categoryText = primary.categoryText ?? secondary.categoryText ?? null;

  return {
    ...primary,
    title,
    description,
    rawPrice,
    currency: primary.currency ?? secondary.currency ?? null,
    city,
    categoryText,
    subcategoryText: primary.subcategoryText ?? secondary.subcategoryText ?? null,
    breadcrumbSlugs: primary.breadcrumbSlugs ?? secondary.breadcrumbSlugs,
    images,
    rawContact: primary.rawContact ?? secondary.rawContact ?? null,
    partial: false,
    fieldsFound: {
      title: Boolean(title?.trim()),
      description: Boolean(description?.trim()),
      price: Boolean(rawPrice?.trim()),
      city: Boolean(city?.trim()),
      images: images.length,
      category: Boolean(categoryText),
    },
  };
}

function extractEmbeddedFromHtml(html: string): Partial<ExtractedListingData> {
  const snapshots = [
    ...extractJsonLdObjects(html),
    extractNextDataObject(html),
    extractEmbeddedJsonState(html),
  ].filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"));

  let merged: Partial<ExtractedListingData> = {};

  for (const payload of snapshots) {
    const scan = scanEmbeddedListingJson(payload);
    const priceParsed = parsePriceText(scan.rawPrice);
    merged = {
      title: merged.title ?? scan.title,
      description: merged.description ?? scan.description,
      rawPrice: merged.rawPrice ?? priceParsed.rawPrice,
      currency: merged.currency ?? priceParsed.normalizedCurrency ?? scan.currency,
      city: merged.city ?? scan.city,
      images: filterProductImages([...(merged.images ?? []), ...scan.images]),
    };
  }

  return merged;
}

function dataFromDomSnapshot(snapshot: DomSnapshot, baseUrl: string): Partial<ExtractedListingData> {
  const priceParsed = parsePriceText(snapshot.priceText);
  const hints = parseLalafoUrlHints(baseUrl);

  return {
    title: snapshot.title,
    description: snapshot.description,
    rawPrice: priceParsed.rawPrice,
    currency: priceParsed.normalizedCurrency,
    city: snapshot.city ?? hints.city,
    images: filterProductImages(snapshot.imageUrls),
    categoryText: snapshot.categoryLabels[0] ?? null,
    subcategoryText: snapshot.categoryLabels[1] ?? null,
  };
}

async function readDomSnapshot(page: {
  evaluate: <T>(fn: () => T) => Promise<T>;
}): Promise<DomSnapshot> {
  return page.evaluate(() => {
    const pickText = (selectors: string[]): string | null => {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        const text = element?.textContent?.trim();
        if (text) {
          return text;
        }
      }
      return null;
    };

    const meta = (property: string): string | null => {
      const node =
        document.querySelector(`meta[property="${property}"]`) ??
        document.querySelector(`meta[name="${property}"]`);
      return node?.getAttribute("content")?.trim() ?? null;
    };

    const title =
      pickText(["h1", '[data-testid*="title"]', '[class*="title"]']) ??
      meta("og:title") ??
      document.title?.trim() ??
      null;

    const bodyText = document.body?.innerText ?? "";
    const priceMatch = bodyText.match(
      /(\d[\d\s\u00A0]{2,})(?:\s*(?:KGS|сом|USD|\$|€)|(?:\s*сом))/i,
    );
    const negotiable = /договорн/i.test(bodyText) ? "Договорная" : null;
    const priceText = priceMatch?.[0]?.trim() ?? negotiable;

    let description =
      pickText([
        '[data-testid*="description"]',
        '[class*="description"]',
        'section[class*="Description"]',
      ]) ?? meta("og:description") ?? meta("description");

    if (!description) {
      const labels = [...document.querySelectorAll("dt, th, label, span, div")];
      for (const label of labels) {
        if (/описание/i.test(label.textContent ?? "")) {
          const sibling =
            label.nextElementSibling?.textContent?.trim() ??
            label.parentElement?.querySelector("dd, p")?.textContent?.trim();
          if (sibling && sibling.length > 20) {
            description = sibling;
            break;
          }
        }
      }
    }

    const imageUrls: string[] = [];
    const pushUrl = (value: string | null | undefined) => {
      if (value && /^https?:\/\//i.test(value) && !value.startsWith("data:")) {
        imageUrls.push(value);
      }
    };

    pushUrl(meta("og:image"));
    document.querySelectorAll("img[src]").forEach((img) => {
      pushUrl(img.getAttribute("src"));
    });
    document.querySelectorAll("source[srcset]").forEach((source) => {
      const srcset = source.getAttribute("srcset");
      if (!srcset) {
        return;
      }
      const first = srcset.split(",")[0]?.trim().split(/\s+/)[0];
      pushUrl(first ?? null);
    });

    const categoryLabels = [...document.querySelectorAll("nav a, .breadcrumb a, [class*='breadcrumb'] a")]
      .map((node) => node.textContent?.trim())
      .filter((value): value is string => Boolean(value && value.length > 1))
      .slice(0, 4);

    const cityFromPath = window.location.pathname.includes("/bishkek/") ? "Бишкек" : null;

    return {
      title,
      priceText,
      description,
      imageUrls,
      city: cityFromPath,
      categoryLabels,
    };
  });
}

async function fetchLalafoPageViaBrowser(url: string): Promise<
  | { ok: true; html: string; finalUrl: string; dom: DomSnapshot }
  | {
      ok: false;
      code: RenderFallbackFailureCode;
      reason: string;
      failure: ReturnType<typeof classifyRenderFailure>;
    }
> {
  if (!isNodeVersionSupportedForRender()) {
    const failure = classifyRenderFailure({
      codeHint: "RENDER_NODE_VERSION_UNSUPPORTED",
    });
    return { ok: false, code: failure.code, reason: failure.userMessage, failure };
  }

  let browser: Awaited<
    ReturnType<Awaited<typeof import("playwright-core")>["chromium"]["launch"]>
  > | null = null;

  try {
    const playwright = await import("playwright-core");
    try {
      playwright.chromium.executablePath();
    } catch {
      // binary check — launch will classify failure
    }

    browser = await playwright.chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    invalidateRenderBrowserProbeCache();

    const context = await browser.newContext({
      userAgent: BROWSER_USER_AGENT,
      locale: "ru-RU",
      viewport: { width: 1280, height: 900 },
    });
    const page = await context.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: IMPORT_RENDER_NAVIGATION_TIMEOUT_MS,
    });
    await page.waitForTimeout(1500);

    const dom = await readDomSnapshot(page);
    const html = await page.content();
    const finalUrl = page.url();

    await context.close();

    logger.info("Lalafo browser render completed", { url, finalUrl, bytes: html.length });

    return { ok: true, html, finalUrl, dom };
  } catch (error) {
    invalidateRenderBrowserProbeCache();
    const stage =
      error instanceof Error && error.name === "TimeoutError"
        ? "goto"
        : error instanceof Error && /goto|navigation/i.test(error.message)
          ? "goto"
          : "launch";
    const failure = classifyRenderFailure({ error, stage });
    return { ok: false, code: failure.code, reason: failure.userMessage, failure };
  } finally {
    if (browser) {
      await browser.close().catch(() => undefined);
    }
  }
}

function hasMeaningfulFields(data: ExtractedListingData): boolean {
  return hasMeaningfulLalafoFields(data);
}

export async function extractLalafoViaRender(canonicalUrl: string): Promise<LalafoRenderExtractResult> {
  await validateImportUrl(canonicalUrl);

  const unavailableReason = getRenderFallbackUnavailableReason();
  if (unavailableReason) {
    const failure = classifyRenderFailure({
      codeHint: !isNodeVersionSupportedForRender()
        ? "RENDER_NODE_VERSION_UNSUPPORTED"
        : "RENDER_FALLBACK_DISABLED",
    });
    return {
      ok: false,
      code: failure.code,
      reason: failure.userMessage,
      debug: buildRenderDebug({
        canonicalUrl,
        failure,
        attempted: false,
        browserLaunchable: false,
      }),
    };
  }

  const pageFetch = await fetchLalafoPageViaBrowser(canonicalUrl);
  if (!pageFetch.ok) {
    return {
      ok: false,
      code: pageFetch.code,
      reason: pageFetch.reason,
      debug: buildRenderDebug({
        canonicalUrl,
        failure: pageFetch.failure,
        attempted: true,
        succeeded: false,
        browserLaunchable: false,
      }),
    };
  }

  const domData = dataFromDomSnapshot(pageFetch.dom, pageFetch.finalUrl);
  const embedded = extractEmbeddedFromHtml(pageFetch.html);
  const htmlExtracted: ExtractedListingResult = extractLalafoListing(
    pageFetch.html,
    pageFetch.finalUrl,
  );

  const base: ExtractedListingData = {
    sourcePlatform: "LALAFO",
    sourceUrl: pageFetch.finalUrl,
    sourceExternalId: parseLalafoUrlHints(canonicalUrl).sourceExternalId,
    title: null,
    description: null,
    rawPrice: null,
    currency: "KGS",
    city: null,
    categoryText: null,
    subcategoryText: null,
    images: [],
    rawContact: null,
    partial: false,
  };

  let extracted = htmlExtracted.ok ? htmlExtracted.data : base;
  extracted = mergeExtracted(extracted, embedded);
  extracted = mergeExtracted(extracted, domData);

  if (!extracted.title && !extracted.rawPrice && extracted.images.length === 0) {
    const failure = classifyRenderFailure({
      codeHint: "EXTRACTION_FAILED",
      stage: "extract",
      error: htmlExtracted.ok ? undefined : htmlExtracted.error,
    });
    return {
      ok: false,
      code: failure.code,
      reason: failure.userMessage,
      debug: buildRenderDebug({
        canonicalUrl,
        failure,
        attempted: true,
        succeeded: false,
        browserLaunchable: true,
        extra: {
          finalUrl: pageFetch.finalUrl,
          responseSize: pageFetch.html.length,
        },
      }),
    };
  }

  const meaningful = hasMeaningfulFields(extracted);
  const extractionQuality = meaningful ? "FULL" : "PARTIAL";

  return {
    ok: true,
    extracted: {
      ...extracted,
      partial: !meaningful,
    },
    debug: buildRenderDebug({
      canonicalUrl,
      attempted: true,
      succeeded: true,
      browserLaunchable: true,
      extra: {
        finalUrl: pageFetch.finalUrl,
        extractionSources: ["browser-render", "html", "embedded-json"],
        fieldsFound: extracted.fieldsFound,
        responseSize: pageFetch.html.length,
        partial: !meaningful,
        extractionQuality,
      },
    }),
  };
}
