import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/dictionaries";

/** Same key as Phase 51/53 — localStorage + cookie. */
export const LOCALE_STORAGE_KEY = "vsetut.locale";

/** Distinguishes browser auto-detect from settings drawer choice. */
export const LOCALE_SOURCE_KEY = "vsetut.locale.source";

export type LocaleSource = "auto" | "manual";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

export function isSupportedLocale(value: unknown): value is Locale {
  return value === "ru" || value === "kg" || value === "en";
}

/**
 * Normalize browser / stored locale tags to a supported Locale.
 * Understands: ru, ru-RU, ky, ky-KG, kg, en, en-US, en-GB, etc.
 */
export function normalizeLocale(
  value: string | null | undefined,
): Locale | null {
  if (!value) {
    return null;
  }

  const primary = value.trim().toLowerCase().split(/[-_]/)[0] ?? "";

  if (primary === "ru") {
    return "ru";
  }
  if (primary === "ky" || primary === "kg") {
    return "kg";
  }
  if (primary === "en") {
    return "en";
  }

  return null;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  try {
    const encodedName = `${encodeURIComponent(name)}=`;
    const parts = document.cookie.split(";");
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.startsWith(encodedName)) {
        return decodeURIComponent(trimmed.slice(encodedName.length));
      }
      // Also accept unencoded key match for plain "vsetut.locale"
      if (trimmed.startsWith(`${name}=`)) {
        return decodeURIComponent(trimmed.slice(name.length + 1));
      }
    }
  } catch {
    // ignore cookie read errors
  }

  return null;
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") {
    return;
  }

  try {
    document.cookie = [
      `${name}=${encodeURIComponent(value)}`,
      "path=/",
      `max-age=${COOKIE_MAX_AGE_SECONDS}`,
      "SameSite=Lax",
    ].join("; ");
  } catch {
    // ignore cookie write errors
  }
}

function readLocalStorage(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

/**
 * Prefer localStorage, then cookie. Does not fall back to browser language.
 */
export function getStoredLocale(): Locale | null {
  const fromStorage = normalizeLocale(readLocalStorage(LOCALE_STORAGE_KEY));
  if (fromStorage) {
    return fromStorage;
  }

  return normalizeLocale(readCookie(LOCALE_STORAGE_KEY));
}

export function getStoredLocaleSource(): LocaleSource | null {
  const raw = readLocalStorage(LOCALE_SOURCE_KEY);
  if (raw === "auto" || raw === "manual") {
    return raw;
  }
  return null;
}

type SetStoredLocaleOptions = {
  source?: LocaleSource;
};

export function setStoredLocale(
  locale: Locale,
  options: SetStoredLocaleOptions = {},
): void {
  if (!isSupportedLocale(locale)) {
    return;
  }

  writeLocalStorage(LOCALE_STORAGE_KEY, locale);
  writeCookie(LOCALE_STORAGE_KEY, locale);

  if (options.source) {
    writeLocalStorage(LOCALE_SOURCE_KEY, options.source);
  }
}

/**
 * Resolve locale from navigator.languages / navigator.language.
 * Always returns a supported Locale (default ru).
 */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") {
    return DEFAULT_LOCALE;
  }

  const candidates: string[] = [];

  try {
    if (Array.isArray(navigator.languages)) {
      for (const language of navigator.languages) {
        if (typeof language === "string" && language.length > 0) {
          candidates.push(language);
        }
      }
    }
  } catch {
    // ignore
  }

  try {
    if (typeof navigator.language === "string" && navigator.language.length > 0) {
      candidates.push(navigator.language);
    }
  } catch {
    // ignore
  }

  for (const candidate of candidates) {
    const normalized = normalizeLocale(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return DEFAULT_LOCALE;
}

/**
 * Resolve initial client locale: stored choice wins, else browser detect.
 * Persists auto-detected locale so it is not re-derived every visit.
 */
export function resolveInitialLocale(): Locale {
  const stored = getStoredLocale();
  if (stored) {
    // Keep cookie in sync if only localStorage had the value (or vice versa).
    setStoredLocale(stored, {
      source: getStoredLocaleSource() ?? "manual",
    });
    return stored;
  }

  const detected = detectBrowserLocale();
  setStoredLocale(detected, { source: "auto" });
  return detected;
}
