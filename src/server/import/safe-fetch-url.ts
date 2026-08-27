import dns from "node:dns/promises";
import net from "node:net";
import {
  mapFetchExceptionToCode,
  throwImportError,
  type ImportFetchDebugInfo,
} from "@/server/import/import-error-codes";
import { ValidationError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";

export const FETCH_TIMEOUT_MS = 15_000;
export const MAX_RESPONSE_BYTES = 3 * 1024 * 1024;
export const MAX_REDIRECTS = 5;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 VseTutImportBot/1.0";

const DEFAULT_FETCH_HEADERS = {
  "User-Agent": USER_AGENT,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
  "Cache-Control": "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
} as const;

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
  "metadata.google",
]);

const BLOCKED_HOST_SUFFIXES = [".local", ".internal", ".localhost"];

function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function isPrivateIpv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  return (
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80")
  );
}

function isPrivateIp(ip: string): boolean {
  const version = net.isIP(ip);
  if (version === 4) {
    return isPrivateIpv4(ip);
  }
  if (version === 6) {
    return isPrivateIpv6(ip);
  }
  return false;
}

function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase().replace(/\.$/, "");
  if (BLOCKED_HOSTNAMES.has(lower)) {
    return true;
  }
  return BLOCKED_HOST_SUFFIXES.some((suffix) => lower.endsWith(suffix));
}

async function assertSafeHostname(hostname: string): Promise<void> {
  const lower = hostname.toLowerCase().replace(/\.$/, "");

  if (isBlockedHostname(lower)) {
    throwImportError("PRIVATE_NETWORK_BLOCKED", {
      technicalReason: `blocked hostname: ${lower}`,
    });
  }

  if (net.isIP(lower)) {
    if (isPrivateIp(lower)) {
      throwImportError("PRIVATE_NETWORK_BLOCKED", {
        technicalReason: `private IP hostname: ${lower}`,
      });
    }
    return;
  }

  let addresses: Array<{ address: string; family: number }>;
  try {
    addresses = await dns.lookup(lower, { all: true });
  } catch (error) {
    throwImportError("DNS_LOOKUP_FAILED", {
      technicalReason: error instanceof Error ? error.message : "dns lookup failed",
    });
  }

  if (addresses.length === 0) {
    throwImportError("DNS_LOOKUP_FAILED", {
      technicalReason: `no DNS records for ${lower}`,
    });
  }

  for (const entry of addresses) {
    if (isPrivateIp(entry.address)) {
      throwImportError("PRIVATE_NETWORK_BLOCKED", {
        technicalReason: `${lower} resolves to private IP ${entry.address}`,
      });
    }
  }
}

export async function validateImportUrl(rawUrl: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    throwImportError("INVALID_URL");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throwImportError("UNSUPPORTED_PROTOCOL");
  }

  if (parsed.username || parsed.password) {
    throwImportError("INVALID_URL", {
      technicalReason: "credentials in URL are not allowed",
    });
  }

  await assertSafeHostname(parsed.hostname);
  return parsed;
}

function mapHttpStatusToError(status: number): void {
  if (status === 404 || status === 410) {
    throwImportError("HTTP_STATUS_NOT_FOUND", {
      technicalReason: `HTTP ${status}`,
    });
  }

  if (status === 401 || status === 403 || status === 429 || status >= 500) {
    throwImportError("HTTP_STATUS_BLOCKED", {
      technicalReason: `HTTP ${status}`,
    });
  }

  throwImportError("FETCH_FAILED", {
    technicalReason: `HTTP ${status}`,
  });
}

export type SafeFetchImportPageResult = {
  finalUrl: string;
  html: string;
  debug: ImportFetchDebugInfo;
};

export async function safeFetchImportPage(startUrl: string): Promise<SafeFetchImportPageResult> {
  let currentUrl = await validateImportUrl(startUrl);
  let lastStatusCode: number | undefined;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(currentUrl.toString(), {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: DEFAULT_FETCH_HEADERS,
      });

      lastStatusCode = response.status;

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) {
          throwImportError("FETCH_FAILED", {
            technicalReason: `redirect ${response.status} without Location header`,
            debug: { finalUrl: currentUrl.toString(), statusCode: response.status },
          });
        }

        let nextUrl: URL;
        try {
          nextUrl = new URL(location, currentUrl);
        } catch {
          throwImportError("INVALID_URL", {
            technicalReason: `invalid redirect location: ${location}`,
          });
        }

        try {
          currentUrl = await validateImportUrl(nextUrl.toString());
        } catch {
          throwImportError("REDIRECT_BLOCKED", {
            technicalReason: `unsafe redirect to ${nextUrl.toString()}`,
          });
        }
        continue;
      }

      if (!response.ok) {
        mapHttpStatusToError(response.status);
      }

      const contentType = response.headers.get("content-type") ?? "";
      const buffer = await response.arrayBuffer();

      if (buffer.byteLength === 0) {
        throwImportError("EMPTY_RESPONSE", {
          debug: {
            finalUrl: currentUrl.toString(),
            statusCode: response.status,
            contentType,
          },
        });
      }

      if (buffer.byteLength > MAX_RESPONSE_BYTES) {
        throwImportError("FETCH_FAILED", {
          message: "Страница слишком большая для импорта.",
          technicalReason: `response size ${buffer.byteLength} exceeds limit`,
        });
      }

      const html = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
      const looksLikeHtml =
        contentType.includes("text/html") ||
        contentType.includes("application/xhtml") ||
        /<html[\s>]/i.test(html) ||
        /<meta[\s>]/i.test(html);

      if (!looksLikeHtml) {
        throwImportError("EXTRACTION_FAILED", {
          technicalReason: `unexpected content-type: ${contentType || "unknown"}`,
          debug: {
            finalUrl: currentUrl.toString(),
            statusCode: response.status,
            contentType,
          },
        });
      }

      logger.info("Import page fetched", {
        url: currentUrl.toString(),
        status: response.status,
        bytes: buffer.byteLength,
        contentType,
      });

      return {
        finalUrl: currentUrl.toString(),
        html,
        debug: {
          finalUrl: currentUrl.toString(),
          statusCode: response.status,
          contentType,
        },
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }

      const code = mapFetchExceptionToCode(error);
      throwImportError(code, {
        technicalReason: error instanceof Error ? error.message : "unknown fetch error",
        debug: {
          finalUrl: currentUrl.toString(),
          statusCode: lastStatusCode,
        },
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  throwImportError("FETCH_FAILED", {
    technicalReason: "too many redirects",
    debug: { finalUrl: currentUrl.toString() },
  });
}
