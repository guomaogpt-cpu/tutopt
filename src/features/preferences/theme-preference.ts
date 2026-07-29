/**
 * Theme preference types shared with Settings drawer.
 * Persistence is owned by next-themes (`storageKey: "vsetut.theme"`) since Phase 52.
 */
export type PreferredTheme = "light" | "dark" | "system";

export const PREFERRED_THEMES: readonly PreferredTheme[] = [
  "light",
  "dark",
  "system",
];

export function isPreferredTheme(value: string): value is PreferredTheme {
  return value === "light" || value === "dark" || value === "system";
}

/** @deprecated Prefer next-themes `useTheme()`. Kept for type helpers. */
export const THEME_STORAGE_KEY = "vsetut.theme";
