import {
  detectBrowserLocale,
  getStoredLocale,
  isSupportedLocale,
  LOCALE_STORAGE_KEY,
  resolveInitialLocale,
  setStoredLocale,
  type LocaleSource,
} from "@/lib/i18n/locale-storage";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/dictionaries";

export { LOCALE_STORAGE_KEY };

/** Alias kept for Phase 51+ callers. */
export type PreferredLocale = Locale;

export const PREFERRED_LOCALES: readonly PreferredLocale[] = [
  "ru",
  "kg",
  "en",
] as const;

export function isPreferredLocale(value: string): value is PreferredLocale {
  return isSupportedLocale(value);
}

/**
 * Returns a usable locale for callers that always need a value.
 * Prefers stored choice; otherwise default ru (no browser detect here —
 * detection runs once via resolveInitialLocale in LocaleProvider).
 */
export function getPreferredLocale(): PreferredLocale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  return getStoredLocale() ?? DEFAULT_LOCALE;
}

export function setPreferredLocale(
  locale: PreferredLocale,
  source: LocaleSource = "manual",
): void {
  setStoredLocale(locale, { source });
}

export {
  detectBrowserLocale,
  getStoredLocale,
  resolveInitialLocale,
  setStoredLocale,
};
