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
import {
  findAdObjectById,
  scanListingJson,
} from "@/server/import/render/listing-json-scanner";
import {
  extractLalafoFromNetworkResponses,
  NetworkResponseCollector,
  type CapturedNetworkJson,
} from "@/server/import/render/lalafo-network-extractor";
import { hasMeaningfulLalafoFields } from "@/server/import/render/render-field-utils";
import { invalidateRenderBrowserProbeCache } from "@/server/import/render/render-browser-probe";
import {
  classifyRenderFailure,
  type RenderFallbackFailureCode,
} from "@/server/import/render/render-failure";
import {
  SOURCE_PROTECTION_PAGE_CODE,
  SOURCE_PROTECTION_PAGE_MESSAGE,
} from "@/server/import/render/render-import-errors";
import {
  IMPORT_RENDER_NAVIGATION_TIMEOUT_MS,
  getRenderFallbackUnavailableReason,
  isNodeVersionSupportedForRender,
  isRenderFallbackEnabled,
} from "@/server/import/render/render-config";
import {
  buildPageDiagnostics,
  truncateBodySample,
  type PageDiagnostics,
} from "@/server/import/render/page-diagnostics";
import { isValidListingTitle, sanitizeListingTitle } from "@/server/import/render/title-validation";
import { validateImportUrl } from "@/server/import/safe-fetch-url";
import type { ExtractedListingData, ExtractedListingResult } from "@/server/import/types";
import { logger } from "@/shared/lib/logger";

export type LalafoRenderExtractResult =
  | { ok: true; extracted: ExtractedListingData; debug: ImportExtractionDebug }
  | {
      ok: false;
      code: RenderFallbackFailureCode | typeof SOURCE_PROTECTION_PAGE_CODE;
      reason: string;
      debug?: ImportExtractionDebug;
    };

export type LalafoExtractionSource =
  | "network-json"
  | "embedded-json"
  | "dom"
  | "open-graph"
  | "url-slug-fallback";

type DomSnapshot = {
  title: string | null;
  priceText: string | null;
  description: string | null;
  imageUrls: string[];
  city: string | null;
  categoryLabels: string[];
};

type BrowserPageResult = {
  html: string;
  finalUrl: string;
  dom: DomSnapshot;
  diagnostics: PageDiagnostics;
  networkPayloads: CapturedNetworkJson[];
};

const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 VseTutImportBot/1.0";

const IMAGE_BLOCKLIST = /logo|avatar|icon|sprite|placeholder|favicon|emoji|banner-ad|\.svg(\?|$)/i;

const EMPTY_PAGE_MESSAGE =
  "Страница открылась, но данные объявления не найдены. Возможно, Lalafo отдаёт защитную или пустую страницу.";

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

function snapshotToPartial(
  snapshot: ReturnType<typeof scanListingJson>,
  hints: Pick<ReturnType<typeof parseLalafoUrlHints>, "city" | "sourceExternalId">,
): Partial<ExtractedListingData> {
  const priceParsed = parsePriceText(snapshot.rawPrice);
  return {
    title: sanitizeListingTitle(snapshot.title),
    description: snapshot.description,
    rawPrice: priceParsed.rawPrice,
    currency: priceParsed.normalizedCurrency ?? snapshot.currency,
    city: snapshot.city ?? hints.city,
    categoryText: snapshot.categoryText,
    images: filterProductImages(snapshot.images),
    sourceExternalId: snapshot.sourceExternalId ?? hints.sourceExternalId,
  };
}

function extractEmbeddedFromHtml(
  html: string,
  targetAdId: string | null,
): { data: Partial<ExtractedListingData>; matchedTargetId: boolean } {
  const hints = { city: null as string | null, sourceExternalId: targetAdId };
  const snapshots = [
    ...extractJsonLdObjects(html),
    extractNextDataObject(html),
    extractEmbeddedJsonState(html),
  ].filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"));

  if (targetAdId) {
    for (const payload of snapshots) {
      const adObject = findAdObjectById(payload, targetAdId);
      if (adObject) {
        return {
          data: snapshotToPartial(scanListingJson(adObject), {
            ...parseLalafoUrlHints("https://lalafo.kg/"),
            sourceExternalId: targetAdId,
          }),
          matchedTargetId: true,
        };
      }
    }
  }

  let merged: Partial<ExtractedListingData> = {};
  for (const payload of snapshots) {
    const scan = scanListingJson(payload);
    const partial = snapshotToPartial(scan, hints);
    merged = {
      title: merged.title ?? partial.title,
      description: merged.description ?? partial.description,
      rawPrice: merged.rawPrice ?? partial.rawPrice,
      currency: merged.currency ?? partial.currency,
      city: merged.city ?? partial.city,
      categoryText: merged.categoryText ?? partial.categoryText,
      images: filterProductImages([...(merged.images ?? []), ...(partial.images ?? [])]),
    };
  }

  return { data: merged, matchedTargetId: false };
}

function dataFromDomSnapshot(
  snapshot: DomSnapshot,
  baseUrl: string,
): Partial<ExtractedListingData> {
  const priceParsed = parsePriceText(snapshot.priceText);
  const hints = parseLalafoUrlHints(baseUrl);

  return {
    title: sanitizeListingTitle(snapshot.title),
    description: snapshot.description,
    rawPrice: priceParsed.rawPrice,
    currency: priceParsed.normalizedCurrency,
    city: snapshot.city ?? hints.city,
    images: filterProductImages(snapshot.imageUrls),
    categoryText: snapshot.categoryLabels[0] ?? null,
    subcategoryText: snapshot.categoryLabels[1] ?? null,
  };
}

function pickByPriority<T>(
  layers: Array<{ source: LalafoExtractionSource; value: T | null | undefined }>,
): { value: T | null; source: LalafoExtractionSource | null } {
  for (const layer of layers) {
    if (layer.value !== null && layer.value !== undefined) {
      if (typeof layer.value === "string" && !layer.value.trim()) {
        continue;
      }
      if (Array.isArray(layer.value) && layer.value.length === 0) {
        continue;
      }
      return { value: layer.value, source: layer.source };
    }
  }
  return { value: null, source: null };
}

function determineExtractionSource(params: {
  network: Partial<ExtractedListingData> | null;
  networkMatchedTargetId: boolean;
  embeddedMatchedTargetId: boolean;
  titlePick: { source: LalafoExtractionSource | null };
  pricePick: { source: LalafoExtractionSource | null };
  descriptionPick: { source: LalafoExtractionSource | null };
  imagesPick: { source: LalafoExtractionSource | null; value: string[] | null };
}): LalafoExtractionSource {
  const hasNetworkData = Boolean(
    params.network?.title ||
      params.network?.rawPrice ||
      (params.network?.images?.length ?? 0) > 0 ||
      params.network?.description,
  );

  if (params.networkMatchedTargetId && hasNetworkData) {
    return "network-json";
  }
  if (hasNetworkData) {
    return "network-json";
  }
  if (params.embeddedMatchedTargetId) {
    return "embedded-json";
  }

  const contributors = [
    params.titlePick.source,
    params.pricePick.source,
    params.descriptionPick.source,
    (params.imagesPick.value?.length ?? 0) > 0 ? params.imagesPick.source : null,
  ].filter((item): item is LalafoExtractionSource => Boolean(item && item !== "url-slug-fallback"));

  if (contributors.includes("embedded-json")) {
    return "embedded-json";
  }
  if (contributors.includes("dom")) {
    return "dom";
  }
  if (contributors.includes("open-graph")) {
    return "open-graph";
  }
  if (params.titlePick.source === "url-slug-fallback") {
    return "url-slug-fallback";
  }
  return contributors[0] ?? "dom";
}

function mergeLayers(params: {
  hints: ReturnType<typeof parseLalafoUrlHints>;
  network: Partial<ExtractedListingData> | null;
  networkMatchedTargetId: boolean;
  embedded: Partial<ExtractedListingData>;
  embeddedMatchedTargetId: boolean;
  dom: Partial<ExtractedListingData>;
  html: Partial<ExtractedListingData>;
  finalUrl: string;
}): { extracted: ExtractedListingData; extractionSource: LalafoExtractionSource; sources: string[] } {
  const slugTitle = params.hints.titleFromSlug;
  const sources: string[] = ["browser-render"];

  const titlePick = pickByPriority<string>([
    { source: "network-json", value: params.network?.title },
    { source: "embedded-json", value: params.embedded.title },
    { source: "dom", value: params.dom.title },
    { source: "open-graph", value: params.html.title },
    { source: "url-slug-fallback", value: slugTitle },
  ]);

  const descriptionPick = pickByPriority<string>([
    { source: "network-json", value: params.network?.description },
    { source: "embedded-json", value: params.embedded.description },
    { source: "dom", value: params.dom.description },
    { source: "open-graph", value: params.html.description },
    { source: "url-slug-fallback", value: null },
  ]);

  const pricePick = pickByPriority<string>([
    { source: "network-json", value: params.network?.rawPrice },
    { source: "embedded-json", value: params.embedded.rawPrice },
    { source: "dom", value: params.dom.rawPrice },
    { source: "open-graph", value: params.html.rawPrice },
    { source: "url-slug-fallback", value: null },
  ]);

  const imagesPick = pickByPriority<string[]>([
    { source: "network-json", value: params.network?.images },
    { source: "embedded-json", value: params.embedded.images },
    { source: "dom", value: params.dom.images },
    { source: "open-graph", value: params.html.images },
    { source: "url-slug-fallback", value: [] },
  ]);

  const cityPick = pickByPriority<string>([
    { source: "network-json", value: params.network?.city },
    { source: "embedded-json", value: params.embedded.city },
    { source: "dom", value: params.dom.city },
    { source: "open-graph", value: params.html.city },
    { source: "url-slug-fallback", value: params.hints.city },
  ]);

  const categoryPick = pickByPriority<string>([
    { source: "network-json", value: params.network?.categoryText },
    { source: "embedded-json", value: params.embedded.categoryText },
    { source: "dom", value: params.dom.categoryText },
    { source: "open-graph", value: params.html.categoryText },
    { source: "url-slug-fallback", value: null },
  ]);

  if (params.network && Object.keys(params.network).length > 0) {
    sources.push("network-json");
  }
  if (Object.keys(params.embedded).length > 0) {
    sources.push("embedded-json");
  }
  sources.push("dom", "html");

  let extractionSource = determineExtractionSource({
    network: params.network,
    networkMatchedTargetId: params.networkMatchedTargetId,
    embeddedMatchedTargetId: params.embeddedMatchedTargetId,
    titlePick,
    pricePick,
    descriptionPick,
    imagesPick,
  });

  const title = titlePick.value;
  const description = descriptionPick.value;
  const rawPrice = pricePick.value;
  const images = filterProductImages(imagesPick.value ?? []);
  const city = cityPick.value;
  const categoryText = categoryPick.value;

  const currency =
    params.network?.currency ??
    params.embedded.currency ??
    params.dom.currency ??
    params.html.currency ??
    "KGS";

  const extracted: ExtractedListingData = {
    sourcePlatform: "LALAFO",
    sourceUrl: params.finalUrl,
    sourceExternalId: params.hints.sourceExternalId,
    title,
    description: description ?? null,
    rawPrice: rawPrice ?? null,
    currency,
    city: city ?? null,
    categoryText: categoryText ?? null,
    subcategoryText: params.dom.subcategoryText ?? null,
    images,
    rawContact: params.network?.rawContact ?? null,
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

  if (titlePick.source === "url-slug-fallback" && extractionSource !== "network-json" && extractionSource !== "embedded-json") {
    extractionSource = "url-slug-fallback";
  }

  return { extracted, extractionSource, sources: [...new Set(sources)] };
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

    const h1Title = pickText(["h1", '[data-testid*="title"]', '[class*="AdTitle"]', '[class*="title"]']);
    const ogTitle = meta("og:title");
    const docTitle = document.title?.trim() ?? null;
    const title = h1Title ?? ogTitle ?? docTitle;

    const bodyText = document.body?.innerText ?? "";
    const priceMatch = bodyText.match(
      /(\d[\d\s\u00A0]{2,8})(?:\s*(?:KGS|сом|USD|\$|€))/i,
    );
    const negotiable = /(?:цена\s+)?договорн/i.test(bodyText) ? "Договорная" : null;
    const priceText = priceMatch?.[0]?.trim() ?? negotiable;

    let description =
      pickText([
        '[data-testid*="description"]',
        '[class*="description"]',
        '[class*="Description"]',
        'section[class*="Description"]',
      ]) ?? meta("og:description") ?? meta("description");

    if (!description) {
      const labels = [...document.querySelectorAll("dt, th, label, span, div, h2, h3")];
      for (const label of labels) {
        if (/^описание$/i.test((label.textContent ?? "").trim())) {
          const sibling =
            label.nextElementSibling?.textContent?.trim() ??
            label.parentElement?.querySelector("dd, p, div")?.textContent?.trim();
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
    document.querySelectorAll("picture source[srcset]").forEach((source) => {
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

async function readDomDiagnostics(page: {
  evaluate: <T>(fn: () => T) => Promise<T>;
  url: () => string;
}): Promise<PageDiagnostics> {
  const snapshot = await page.evaluate(() => {
    const h1Texts = [...document.querySelectorAll("h1")]
      .map((node) => node.textContent?.trim())
      .filter((value): value is string => Boolean(value))
      .slice(0, 5);

    const allImages = document.querySelectorAll("img");
    const candidateImages = [...allImages].filter((img) => {
      const src = img.getAttribute("src") ?? "";
      return src && !/logo|avatar|icon|svg|favicon/i.test(src);
    });

    const bodyText = document.body?.innerText ?? "";
    const sample = bodyText.replace(/\s+/g, " ").trim();

    return {
      documentTitle: document.title?.trim() ?? null,
      pageUrl: window.location.href,
      bodyTextSample: sample.slice(0, 500),
      h1Texts,
      imageCountTotal: allImages.length,
      candidateImageCount: candidateImages.length,
    };
  });

  return buildPageDiagnostics({
    ...snapshot,
    bodyTextSample: snapshot.bodyTextSample
      ? truncateBodySample(snapshot.bodyTextSample, 400)
      : null,
    pageUrl: page.url(),
  });
}

async function fetchLalafoPageViaBrowser(
  url: string,
  targetAdId: string | null,
): Promise<
  | { ok: true; page: BrowserPageResult }
  | {
      ok: false;
      code: RenderFallbackFailureCode;
      reason: string;
      failure: ReturnType<typeof classifyRenderFailure>;
      diagnostics?: PageDiagnostics;
      networkPayloads?: CapturedNetworkJson[];
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

  const collector = new NetworkResponseCollector(targetAdId);

  try {
    const playwright = await import("playwright-core");
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

    page.on("response", (response) => {
      void collector.captureResponse(response);
    });

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: IMPORT_RENDER_NAVIGATION_TIMEOUT_MS,
    });

    await Promise.race([
      page
        .waitForResponse(
          (response) =>
            /api|feed\/details|ads|listing|graphql|classifieds|lalafo/i.test(response.url()),
          { timeout: 8000 },
        )
        .catch(() => undefined),
      page.waitForTimeout(4000),
    ]);

    await page
      .waitForSelector("h1, img[src], [class*='price'], [class*='Price']", { timeout: 3000 })
      .catch(() => undefined);

    await page.waitForTimeout(2000);

    const diagnostics = await readDomDiagnostics(page);
    const dom = await readDomSnapshot(page);
    const html = await page.content();
    const finalUrl = page.url();

    await context.close();

    logger.info("Lalafo browser render completed", {
      url,
      finalUrl,
      bytes: html.length,
      jsonResponseCount: collector.count,
      jsonResponsesWithTargetId: collector.withTargetIdCount,
      blockedPageDetected: diagnostics.blockedPageDetected,
    });

    return {
      ok: true,
      page: {
        html,
        finalUrl,
        dom,
        diagnostics,
        networkPayloads: collector.payloads,
      },
    };
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

function computeExtractionQuality(
  extractionSource: LalafoExtractionSource,
  extracted: ExtractedListingData,
): "FULL" | "PARTIAL" | "URL_ONLY" {
  if (extractionSource === "url-slug-fallback") {
    return "URL_ONLY";
  }

  const fields = extracted.fieldsFound;
  if (!fields) {
    return "URL_ONLY";
  }

  const score = [
    fields.title && isValidListingTitle(extracted.title),
    fields.price,
    fields.description,
    fields.images > 0,
    fields.city,
    fields.category,
  ].filter(Boolean).length;

  if (score >= 4) {
    return "FULL";
  }
  if (score >= 2) {
    return "PARTIAL";
  }
  return "URL_ONLY";
}

export async function extractLalafoViaRender(canonicalUrl: string): Promise<LalafoRenderExtractResult> {
  await validateImportUrl(canonicalUrl);

  const hints = parseLalafoUrlHints(canonicalUrl);

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

  const pageFetch = await fetchLalafoPageViaBrowser(canonicalUrl, hints.sourceExternalId);
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

  const { page: pageResult } = pageFetch;
  const diagnostics = pageResult.diagnostics;

  const debugBase: ImportExtractionDebug = {
    documentTitle: diagnostics.documentTitle,
    pageUrl: diagnostics.pageUrl,
    bodyTextSample: diagnostics.bodyTextSample,
    h1Texts: diagnostics.h1Texts,
    imageCountTotal: diagnostics.imageCountTotal,
    candidateImageCount: diagnostics.candidateImageCount,
    jsonResponseCount: pageResult.networkPayloads.length,
    jsonResponsesWithTargetId: pageResult.networkPayloads.filter((item) => item.containsTargetId)
      .length,
    blockedPageDetected: diagnostics.blockedPageDetected,
    captchaDetected: diagnostics.captchaDetected,
    finalUrl: pageResult.finalUrl,
    responseSize: pageResult.html.length,
  };

  if (diagnostics.blockedPageDetected || diagnostics.captchaDetected) {
    return {
      ok: false,
      code: SOURCE_PROTECTION_PAGE_CODE,
      reason: SOURCE_PROTECTION_PAGE_MESSAGE,
      debug: buildRenderDebug({
        canonicalUrl,
        attempted: true,
        succeeded: false,
        browserLaunchable: true,
        extra: {
          ...debugBase,
          failureReason: SOURCE_PROTECTION_PAGE_CODE,
          extractionQuality: "BLOCKED",
          renderFallbackAttempted: true,
          renderFallbackSucceeded: false,
          renderFallbackAvailable: true,
        },
      }),
    };
  }

  const networkResult = extractLalafoFromNetworkResponses({
    responses: pageResult.networkPayloads,
    targetAdId: hints.sourceExternalId,
    sourceUrl: pageResult.finalUrl,
  });

  const embeddedResult = extractEmbeddedFromHtml(pageResult.html, hints.sourceExternalId);
  const domData = dataFromDomSnapshot(pageResult.dom, pageResult.finalUrl);

  const htmlExtracted: ExtractedListingResult = extractLalafoListing(
    pageResult.html,
    pageResult.finalUrl,
  );

  const htmlData: Partial<ExtractedListingData> = htmlExtracted.ok
    ? {
        title: sanitizeListingTitle(htmlExtracted.data.title),
        description: htmlExtracted.data.description,
        rawPrice: htmlExtracted.data.rawPrice,
        currency: htmlExtracted.data.currency,
        city: htmlExtracted.data.city,
        images: filterProductImages(htmlExtracted.data.images),
        categoryText: htmlExtracted.data.categoryText,
      }
    : {};

  const { extracted, extractionSource, sources } = mergeLayers({
    hints,
    network: networkResult?.data ?? null,
    networkMatchedTargetId: networkResult?.matchedTargetId ?? false,
    embedded: embeddedResult.data,
    embeddedMatchedTargetId: embeddedResult.matchedTargetId,
    dom: domData,
    html: htmlData,
    finalUrl: pageResult.finalUrl,
  });

  const hasData =
    Boolean(extracted.title) ||
    Boolean(extracted.rawPrice) ||
    extracted.images.length > 0 ||
    Boolean(extracted.description);

  if (!hasData) {
    const failure = classifyRenderFailure({
      codeHint: "EXTRACTION_FAILED",
      stage: "extract",
    });
    return {
      ok: false,
      code: failure.code,
      reason: EMPTY_PAGE_MESSAGE,
      debug: buildRenderDebug({
        canonicalUrl,
        failure,
        attempted: true,
        succeeded: false,
        browserLaunchable: true,
        extra: {
          ...debugBase,
          failureReason: EMPTY_PAGE_MESSAGE,
          fieldsFound: extracted.fieldsFound,
          extractionQuality: "FAILED",
        },
      }),
    };
  }

  const extractionQuality = computeExtractionQuality(extractionSource, extracted);
  const meaningful = hasMeaningfulLalafoFields(extracted) && extractionQuality !== "URL_ONLY";

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
        ...debugBase,
        extractionSource,
        extractionSources: sources,
        fieldsFound: extracted.fieldsFound,
        partial: !meaningful,
        extractionQuality,
        failureReason:
          extractionQuality === "URL_ONLY"
            ? "Данные частично восстановлены из URL slug."
            : undefined,
      },
    }),
  };
}
