import type { ImportExtractionDebug } from "@/server/import/import-error-codes";
import { ExternalImportError } from "@/shared/lib/errors";
import {
  classifyRenderFailure,
  mapLegacyRenderCode,
  type RenderFallbackFailureCode,
} from "@/server/import/render/render-failure";

export function throwRenderImportError(params: {
  code?: RenderFallbackFailureCode | string;
  error?: unknown;
  reason?: string;
  debug?: ImportExtractionDebug;
}): never {
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
