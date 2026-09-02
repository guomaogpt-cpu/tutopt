export type RenderFallbackFailureCode =
  | "RENDER_FALLBACK_DISABLED"
  | "RENDER_NODE_VERSION_UNSUPPORTED"
  | "RENDER_PLAYWRIGHT_PACKAGE_MISSING"
  | "RENDER_BROWSER_BINARY_MISSING"
  | "RENDER_BROWSER_SYSTEM_DEPS_MISSING"
  | "RENDER_BROWSER_LAUNCH_FAILED"
  | "RENDER_PAGE_GOTO_FAILED"
  | "RENDER_EXTRACTION_FAILED"
  | "RENDER_TIMEOUT";

export type RenderFailureInfo = {
  code: RenderFallbackFailureCode;
  userMessage: string;
  missingLibrary: string | null;
  technicalReason: string;
};

const USER_MESSAGE_SYSTEM_DEPS =
  "Браузер Playwright установлен, но на сервере не хватает Linux-библиотек Chromium.";

const USER_MESSAGE_LAUNCH_FAILED = "Браузерный импорт недоступен на сервере.";

export function extractMissingSharedLibrary(message: string): string | null {
  const match =
    message.match(/lib[\w.-]+\.so(?:\.\d+)*/i) ??
    message.match(/cannot open shared object file:\s*([^\s]+)/i);
  return match?.[0] ?? match?.[1] ?? null;
}

export function classifyRenderFailure(params: {
  error?: unknown;
  codeHint?: string;
  stage?: "package" | "binary" | "launch" | "goto" | "extract";
}): RenderFailureInfo {
  if (params.codeHint === "RENDER_NODE_VERSION_UNSUPPORTED") {
    return {
      code: "RENDER_NODE_VERSION_UNSUPPORTED",
      userMessage: "Browser render требует Node.js 20 или выше.",
      missingLibrary: null,
      technicalReason: params.codeHint,
    };
  }

  if (params.codeHint === "RENDER_FALLBACK_DISABLED") {
    return {
      code: "RENDER_FALLBACK_DISABLED",
      userMessage: "Браузерный режим импорта отключён.",
      missingLibrary: null,
      technicalReason: params.codeHint,
    };
  }

  const rawMessage =
    params.error instanceof Error
      ? params.error.message
      : typeof params.error === "string"
        ? params.error
        : params.codeHint ?? "Render fallback failed";

  const message = rawMessage.toLowerCase();
  const missingLibrary = extractMissingSharedLibrary(rawMessage);

  if (
    message.includes("shared libraries") ||
    message.includes("shared object file") ||
    message.includes("libglib") ||
    missingLibrary?.includes(".so")
  ) {
    return {
      code: "RENDER_BROWSER_SYSTEM_DEPS_MISSING",
      userMessage: USER_MESSAGE_SYSTEM_DEPS,
      missingLibrary,
      technicalReason: rawMessage.slice(0, 500),
    };
  }

  if (
    message.includes("executable doesn't exist") ||
    message.includes("browser binary") ||
    params.stage === "binary"
  ) {
    return {
      code: "RENDER_BROWSER_BINARY_MISSING",
      userMessage: USER_MESSAGE_LAUNCH_FAILED,
      missingLibrary: null,
      technicalReason: rawMessage.slice(0, 500),
    };
  }

  if (
    message.includes("cannot find module 'playwright-core'") ||
    message.includes('cannot find module "playwright-core"') ||
    params.stage === "package"
  ) {
    return {
      code: "RENDER_PLAYWRIGHT_PACKAGE_MISSING",
      userMessage: USER_MESSAGE_LAUNCH_FAILED,
      missingLibrary: null,
      technicalReason: rawMessage.slice(0, 500),
    };
  }

  if (params.stage === "goto" || message.includes("page.goto") || message.includes("navigation")) {
    return {
      code: "RENDER_PAGE_GOTO_FAILED",
      userMessage: "Не удалось открыть страницу объявления в браузере.",
      missingLibrary: null,
      technicalReason: rawMessage.slice(0, 500),
    };
  }

  if (params.stage === "extract") {
    return {
      code: "RENDER_EXTRACTION_FAILED",
      userMessage: "Страница открылась, но данные объявления не найдены.",
      missingLibrary: null,
      technicalReason: rawMessage.slice(0, 500),
    };
  }

  if (message.includes("timeout") || message.includes("aborted")) {
    return {
      code: "RENDER_TIMEOUT",
      userMessage: "Browser render превысил время ожидания.",
      missingLibrary: null,
      technicalReason: rawMessage.slice(0, 500),
    };
  }

  return {
    code: "RENDER_BROWSER_LAUNCH_FAILED",
    userMessage: USER_MESSAGE_LAUNCH_FAILED,
    missingLibrary,
    technicalReason: rawMessage.slice(0, 500),
  };
}

export function mapLegacyRenderCode(code: string): RenderFallbackFailureCode {
  switch (code) {
    case "RENDER_FALLBACK_UNAVAILABLE_NODE_VERSION":
      return "RENDER_NODE_VERSION_UNSUPPORTED";
    case "RENDER_FALLBACK_UNAVAILABLE":
      return "RENDER_PLAYWRIGHT_PACKAGE_MISSING";
    case "RENDER_TIMEOUT":
      return "RENDER_TIMEOUT";
    case "EXTRACTION_FAILED":
      return "RENDER_EXTRACTION_FAILED";
    default:
      return "RENDER_BROWSER_LAUNCH_FAILED";
  }
}
