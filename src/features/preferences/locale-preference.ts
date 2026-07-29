export const LOCALE_STORAGE_KEY = "vsetut.locale";

export type PreferredLocale = "ru" | "kg" | "en";

export const PREFERRED_LOCALES: readonly PreferredLocale[] = ["ru", "kg", "en"];

export function isPreferredLocale(value: string): value is PreferredLocale {
  return value === "ru" || value === "kg" || value === "en";
}

export function getPreferredLocale(): PreferredLocale {
  if (typeof window === "undefined") {
    return "ru";
  }

  try {
    const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw && isPreferredLocale(raw)) {
      return raw;
    }
  } catch {
    // ignore storage errors
  }

  return "ru";
}

export function setPreferredLocale(locale: PreferredLocale): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore storage errors
  }
}
