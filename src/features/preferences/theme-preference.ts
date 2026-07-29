/**
 * Theme preference storage only — Phase 51 UI stub.
 * Real light/dark/system application is Phase 52 (next-themes).
 */
export const THEME_STORAGE_KEY = "vsetut.theme";

export type PreferredTheme = "light" | "dark" | "system";

export const PREFERRED_THEMES: readonly PreferredTheme[] = [
  "light",
  "dark",
  "system",
];

export function isPreferredTheme(value: string): value is PreferredTheme {
  return value === "light" || value === "dark" || value === "system";
}

export function getPreferredTheme(): PreferredTheme {
  if (typeof window === "undefined") {
    return "system";
  }

  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (raw && isPreferredTheme(raw)) {
      return raw;
    }
  } catch {
    // ignore storage errors
  }

  return "system";
}

export function setPreferredTheme(theme: PreferredTheme): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // ignore storage errors
  }
}
