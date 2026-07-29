/**
 * Theme preference types shared with Settings drawer.
 * Persistence is owned by next-themes (`storageKey: "vsetut.theme.v2"`).
 * Default product theme is light (not system).
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

/** Active next-themes storage key (v2 resets accidental Phase 52 system default). */
export const THEME_STORAGE_KEY = "vsetut.theme.v2";
