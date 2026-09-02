import type { ImportExtractionDebug } from "@/server/import/import-error-codes";
import { ExternalImportError, SourceBlockedError } from "@/shared/lib/errors";
import {
  classifyRenderFailure,
  mapLegacyRenderCode,
  type RenderFallbackFailureCode,
} from "@/server/import/render/render-failure";

export const SOURCE_PROTECTION_PAGE_CODE = "SOURCE_PROTECTION_PAGE";

export const SOURCE_PROTECTION_PAGE_MESSAGE =
  "Lalafo не отдал данные серверному импорту. Используйте ручной импорт из браузера.";

export const SOURCE_PROTECTION_NEXT_ACTION =
  "Откройте объявление в своём браузере и используйте «Импорт из открытой страницы» на /admin/import.";

export function isSourceProtectionFailure(params: {
  code?: string;
  debug?: ImportExtractionDebug;
  reason?: string;
}): boolean {
  return (
    params.code === SOURCE_PROTECTION_PAGE_CODE ||
    Boolean(params.debug?.blockedPageDetected || params.debug?.captchaDetected) ||
    params.reason?.includes("страницу проверки/защиты") === true
  );
}

export function throwRenderImportError(params: {
  code?: RenderFallbackFailureCode | string;
  error?: unknown;
  reason?: string;
  debug?: ImportExtractionDebug;
}): never {
  if (isSourceProtectionFailure(params)) {
    throw new SourceBlockedError(SOURCE_PROTECTION_PAGE_MESSAGE, {
      importErrorCode: SOURCE_PROTECTION_PAGE_CODE,
      nextAction: SOURCE_PROTECTION_NEXT_ACTION,
      debug: {
        ...params.debug,
        failureReason: SOURCE_PROTECTION_PAGE_CODE,
        renderFallbackAttempted: true,
        renderFallbackSucceeded: false,
        browserLaunchable: params.debug?.browserLaunchable ?? true,
        blockedPageDetected: params.debug?.blockedPageDetected ?? true,
      },
    });
  }

  const failure = params.error
    ? classifyRenderFailure({ error: params.error })
    : params.reason
      ? classifyRenderFailure({ error: params.reason })
      : null;

  const mappedCode = params.code
    ? typeof params.code === "string" && !params.code.startsWith("RENDER_BROWSER")
      ? mapLegacyRenderCode(params.code)
      : (params.code as RenderFallbackFailureCode)
    : "RENDER_BROWSER_LAUNCH_FAILED";

  const code = failure?.code ?? mappedCode;
  const message =
    code === "RENDER_BROWSER_SYSTEM_DEPS_MISSING"
      ? "Браузер Playwright установлен, но на сервере не хватает Linux-библиотек Chromium."
      : "Браузерный импорт недоступен на сервере.";

  throw new ExternalImportError(message, {
    importErrorCode: code,
    missingLibrary: failure?.missingLibrary ?? null,
    debug: params.debug,
    technicalReason: failure?.technicalReason,
  });
}
