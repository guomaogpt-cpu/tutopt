import dns from "node:dns/promises";
import net from "node:net";
import { ValidationError } from "@/shared/lib/errors";

const FETCH_TIMEOUT_MS = 12_000;
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 3;
const USER_AGENT = "Mozilla/5.0 (compatible; VseTutImportBot/1.0; +https://vsetut.kg)";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
]);

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

async function assertSafeHostname(hostname: string): Promise<void> {
  const lower = hostname.toLowerCase().replace(/\.$/, "");
  if (BLOCKED_HOSTNAMES.has(lower)) {
    throw new ValidationError("Не удалось открыть ссылку.");
  }
  if (lower.endsWith(".local") || lower.endsWith(".internal")) {
    throw new ValidationError("Не удалось открыть ссылку.");
  }

  if (net.isIP(lower)) {
    if (isPrivateIp(lower)) {
      throw new ValidationError("Не удалось открыть ссылку.");
    }
    return;
  }

  let addresses: Array<{ address: string }>;
  try {
    addresses = await dns.lookup(lower, { all: true, verbatim: true });
  } catch {
    throw new ValidationError("Не удалось открыть ссылку.");
  }

  if (addresses.length === 0) {
    throw new ValidationError("Не удалось открыть ссылку.");
  }

  for (const entry of addresses) {
    if (isPrivateIp(entry.address)) {
      throw new ValidationError("Не удалось открыть ссылку.");
    }
  }
}

export async function validateImportUrl(rawUrl: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    throw new ValidationError("Укажите корректную ссылку.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new ValidationError("Поддерживаются только http/https ссылки.");
  }

  if (parsed.username || parsed.password) {
    throw new ValidationError("Не удалось открыть ссылку.");
  }

  await assertSafeHostname(parsed.hostname);
  return parsed;
}

export async function safeFetchImportPage(startUrl: string): Promise<{
  finalUrl: string;
  html: string;
}> {
  let currentUrl = await validateImportUrl(startUrl);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(currentUrl.toString(), {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
        },
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) {
          throw new ValidationError("Не удалось открыть ссылку.");
        }
        currentUrl = await validateImportUrl(new URL(location, currentUrl).toString());
        continue;
      }

      if (!response.ok) {
        throw new ValidationError("Не удалось открыть ссылку.");
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
        throw new ValidationError("На странице не найдено данных объявления.");
      }

      const buffer = await response.arrayBuffer();
      if (buffer.byteLength > MAX_RESPONSE_BYTES) {
        throw new ValidationError("Страница слишком большая для импорта.");
      }

      return {
        finalUrl: currentUrl.toString(),
        html: new TextDecoder("utf-8").decode(buffer),
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError("Не удалось открыть ссылку.");
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new ValidationError("Не удалось открыть ссылку.");
}
