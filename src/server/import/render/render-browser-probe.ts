import {
  isNodeVersionSupportedForRender,
  isRenderFallbackEnabled,
} from "@/server/import/render/render-config";
import {
  classifyRenderFailure,
  type RenderFallbackFailureCode,
} from "@/server/import/render/render-failure";

export type RenderBrowserProbeResult = {
  nodeVersion: string;
  renderFallbackEnabled: boolean;
  playwrightPackageAvailable: boolean;
  browserExecutableAvailable: boolean;
  browserLaunchable: boolean;
  renderFallbackFailureCode: RenderFallbackFailureCode | null;
  failureMessage: string | null;
  missingLibrary: string | null;
  technicalReason: string | null;
};

const PROBE_LAUNCH_TIMEOUT_MS = 8_000;
const PROBE_CACHE_MS = 60_000;

let cachedProbe: { at: number; result: RenderBrowserProbeResult } | null = null;

function baseProbe(): Omit<
  RenderBrowserProbeResult,
  "playwrightPackageAvailable" | "browserExecutableAvailable" | "browserLaunchable"
> {
  return {
    nodeVersion: process.versions.node,
    renderFallbackEnabled: isRenderFallbackEnabled(),
    renderFallbackFailureCode: null,
    failureMessage: null,
    missingLibrary: null,
    technicalReason: null,
  };
}

export async function probeRenderBrowser(options?: {
  testLaunch?: boolean;
  force?: boolean;
}): Promise<RenderBrowserProbeResult> {
  const testLaunch = options?.testLaunch ?? true;
  const now = Date.now();

  if (!options?.force && cachedProbe && now - cachedProbe.at < PROBE_CACHE_MS) {
    return cachedProbe.result;
  }

  const result: RenderBrowserProbeResult = {
    ...baseProbe(),
    playwrightPackageAvailable: false,
    browserExecutableAvailable: false,
    browserLaunchable: false,
  };

  if (!isRenderFallbackEnabled()) {
    result.renderFallbackFailureCode = "RENDER_FALLBACK_DISABLED";
    result.failureMessage = "Браузерный режим импорта отключён.";
    cachedProbe = { at: now, result };
    return result;
  }

  if (!isNodeVersionSupportedForRender()) {
    result.renderFallbackFailureCode = "RENDER_NODE_VERSION_UNSUPPORTED";
    result.failureMessage = `Browser render требует Node.js 20+ (сейчас ${process.versions.node}).`;
    cachedProbe = { at: now, result };
    return result;
  }

  try {
    const playwright = await import("playwright-core");
    result.playwrightPackageAvailable = true;

    let executablePath: string | undefined;
    try {
      executablePath = playwright.chromium.executablePath();
      result.browserExecutableAvailable = Boolean(executablePath);
    } catch (error) {
      const failure = classifyRenderFailure({ error, stage: "binary" });
      result.renderFallbackFailureCode = failure.code;
      result.failureMessage = failure.userMessage;
      result.missingLibrary = failure.missingLibrary;
      result.technicalReason = failure.technicalReason;
      cachedProbe = { at: now, result };
      return result;
    }

    if (!testLaunch) {
      result.browserLaunchable = result.browserExecutableAvailable;
      cachedProbe = { at: now, result };
      return result;
    }

    let browser: Awaited<
      ReturnType<Awaited<typeof import("playwright-core")>["chromium"]["launch"]>
    > | null = null;

    try {
      browser = await playwright.chromium.launch({
        headless: true,
        timeout: PROBE_LAUNCH_TIMEOUT_MS,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      });
      result.browserLaunchable = true;
    } catch (error) {
      const failure = classifyRenderFailure({ error, stage: "launch" });
      result.renderFallbackFailureCode = failure.code;
      result.failureMessage = failure.userMessage;
      result.missingLibrary = failure.missingLibrary;
      result.technicalReason = failure.technicalReason;
    } finally {
      await browser?.close().catch(() => undefined);
    }
  } catch (error) {
    const failure = classifyRenderFailure({ error, stage: "package" });
    result.renderFallbackFailureCode = failure.code;
    result.failureMessage = failure.userMessage;
    result.missingLibrary = failure.missingLibrary;
    result.technicalReason = failure.technicalReason;
  }

  cachedProbe = { at: now, result };
  return result;
}

export function invalidateRenderBrowserProbeCache(): void {
  cachedProbe = null;
}

export function isRenderFallbackOperational(probe: RenderBrowserProbeResult): boolean {
  return probe.renderFallbackEnabled && probe.browserLaunchable;
}
