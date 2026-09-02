import { ValidationError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";

export const IMPORT_ERROR_CODES = [
  "INVALID_URL",
  "UNSUPPORTED_PROTOCOL",
  "PRIVATE_NETWORK_BLOCKED",
  "DNS_LOOKUP_FAILED",
  "FETCH_TIMEOUT",
  "FETCH_FAILED",
  "HTTP_STATUS_BLOCKED",
  "HTTP_STATUS_NOT_FOUND",
  "REDIRECT_BLOCKED",
  "EMPTY_RESPONSE",
  "EXTRACTION_FAILED",
  "UNSUPPORTED_SOURCE",
  "DUPLICATE_SOURCE",
  "RENDER_FALLBACK_UNAVAILABLE",
  "RENDER_FALLBACK_UNAVAILABLE_NODE_VERSION",
  "RENDER_BROWSER_SYSTEM_DEPS_MISSING",
  "RENDER_BROWSER_LAUNCH_FAILED",
  "RENDER_BROWSER_BINARY_MISSING",
  "RENDER_PLAYWRIGHT_PACKAGE_MISSING",
] as const;

export type ImportErrorCode = (typeof IMPORT_ERROR_CODES)[number];

export type ImportErrorDetails = {
  importErrorCode: ImportErrorCode;
  nextAction?: string;
  debug?: ImportFetchDebugInfo;
};

export type ImportFetchDebugInfo = {
  requestedUrl?: string;
  finalUrl?: string;
  statusCode?: number;
  contentType?: string;
  responseSize?: number;
  redirectCount?: number;
  extractor?: string;
  extractorUsed?: string;
  extractionSource?: string;
  extractionSources?: string[];
  extractionQuality?: "FULL" | "PARTIAL" | "URL_ONLY" | "FAILED";
  failureReason?: string;
  fieldsFound?: {
    title: boolean;
    description: boolean;
    images: number;
    price: boolean;
    city?: boolean;
    category?: boolean;
  };
  partial?: boolean;
  renderFallbackEnabled?: boolean;
  renderFallbackAvailable?: boolean;
  renderFallbackAttempted?: boolean;
  renderFallbackSucceeded?: boolean;
  playwrightPackageAvailable?: boolean;
  browserExecutableAvailable?: boolean;
  browserLaunchable?: boolean;
  renderFallbackFailureCode?: string;
  missingLibrary?: string | null;
  technicalReason?: string;
  documentTitle?: string | null;
  pageUrl?: string | null;
  bodyTextSample?: string | null;
  h1Texts?: string[];
  imageCountTotal?: number;
  candidateImageCount?: number;
  jsonResponseCount?: number;
  jsonResponsesWithTargetId?: number;
  blockedPageDetected?: boolean;
  captchaDetected?: boolean;
};

export type ImportExtractionDebug = ImportFetchDebugInfo;

const ERROR_MESSAGES: Record<ImportErrorCode, string> = {
  INVALID_URL: "Некорректная ссылка.",
  UNSUPPORTED_PROTOCOL: "Поддерживаются только http/https ссылки.",
  PRIVATE_NETWORK_BLOCKED: "Ссылка заблокирована защитой безопасности.",
  DNS_LOOKUP_FAILED: "Не удалось найти адрес сайта. Проверьте ссылку.",
  FETCH_TIMEOUT: "Источник слишком долго не отвечает.",
  FETCH_FAILED: "Не удалось открыть ссылку. Проверьте ссылку или попробуйте позже.",
  HTTP_STATUS_BLOCKED: "Источник заблокировал запрос. Попробуйте позже или создайте черновик вручную.",
  HTTP_STATUS_NOT_FOUND: "Страница не найдена.",
  REDIRECT_BLOCKED: "Переадресация заблокирована защитой безопасности.",
  EMPTY_RESPONSE: "Источник вернул пустой ответ.",
  EXTRACTION_FAILED: "Ссылку открыли, но данные объявления не найдены.",
  UNSUPPORTED_SOURCE: "Источник не поддерживается.",
  DUPLICATE_SOURCE: "Такой источник уже импортировался.",
  RENDER_FALLBACK_UNAVAILABLE: "Рендер страницы недоступен на сервере.",
  RENDER_FALLBACK_UNAVAILABLE_NODE_VERSION:
    "Browser render недоступен: требуется Node.js 20 или выше.",
  RENDER_BROWSER_SYSTEM_DEPS_MISSING:
    "Browser render недоступен: не хватает Linux-библиотек Chromium.",
  RENDER_BROWSER_LAUNCH_FAILED: "Browser render недоступен на сервере.",
  RENDER_BROWSER_BINARY_MISSING: "Chromium binary не найден на сервере.",
  RENDER_PLAYWRIGHT_PACKAGE_MISSING: "Playwright package недоступен на сервере.",
};

const ERROR_NEXT_ACTIONS: Partial<Record<ImportErrorCode, string>> = {
  HTTP_STATUS_BLOCKED:
    "Можно создать черновик вручную или попробовать позже.",
  EXTRACTION_FAILED: "Создайте черновик вручную и заполните данные.",
  FETCH_FAILED: "Проверьте ссылку или попробуйте позже.",
  FETCH_TIMEOUT: "Попробуйте позже или создайте черновик вручную.",
  HTTP_STATUS_NOT_FOUND: "Проверьте, что ссылка ведёт на существующее объявление.",
  PRIVATE_NETWORK_BLOCKED: "Используйте публичную ссылку на объявление.",
};

export function getImportErrorMessage(code: ImportErrorCode): string {
  return ERROR_MESSAGES[code];
}

export function throwImportError(
  code: ImportErrorCode,
  options?: {
    message?: string;
    technicalReason?: string;
    debug?: ImportFetchDebugInfo;
  },
): never {
  if (options?.technicalReason) {
    logger.warn("Import fetch error", {
      code,
      reason: options.technicalReason,
      debug: options.debug,
    });
  }

  throw new ValidationError(options?.message ?? getImportErrorMessage(code), {
    importErrorCode: code,
    nextAction: ERROR_NEXT_ACTIONS[code],
    debug: options?.debug,
  } satisfies ImportErrorDetails);
}

export function mapFetchExceptionToCode(error: unknown): ImportErrorCode {
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return "FETCH_TIMEOUT";
    }
    const message = error.message.toLowerCase();
    if (message.includes("enotfound") || message.includes("getaddrinfo")) {
      return "DNS_LOOKUP_FAILED";
    }
    if (message.includes("timeout") || message.includes("aborted")) {
      return "FETCH_TIMEOUT";
    }
    if (message.includes("certificate") || message.includes("ssl")) {
      return "FETCH_FAILED";
    }
  }
  return "FETCH_FAILED";
}
