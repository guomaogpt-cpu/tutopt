export type DisplayRegion = "KG" | "KZ" | "RU" | "OTHER";

export type DisplayCurrency = "KGS" | "KZT" | "RUB" | "USD";

export type DisplayPreferences = {
  region: DisplayRegion;
  currency: DisplayCurrency;
};

export const DISPLAY_PREFERENCES_STORAGE_KEY = "vsetut_display_preferences_v1";

export const DEFAULT_DISPLAY_PREFERENCES: DisplayPreferences = {
  region: "KG",
  currency: "KGS",
};

const VALID_REGIONS = new Set<DisplayRegion>(["KG", "KZ", "RU", "OTHER"]);
const VALID_CURRENCIES = new Set<DisplayCurrency>(["KGS", "KZT", "RUB", "USD"]);

function isDisplayRegion(value: unknown): value is DisplayRegion {
  return typeof value === "string" && VALID_REGIONS.has(value as DisplayRegion);
}

function isDisplayCurrency(value: unknown): value is DisplayCurrency {
  return typeof value === "string" && VALID_CURRENCIES.has(value as DisplayCurrency);
}

export function readDisplayPreferences(): DisplayPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_DISPLAY_PREFERENCES;
  }

  try {
    const raw = window.localStorage.getItem(DISPLAY_PREFERENCES_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_DISPLAY_PREFERENCES;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return DEFAULT_DISPLAY_PREFERENCES;
    }

    const record = parsed as Record<string, unknown>;
    const region = isDisplayRegion(record.region)
      ? record.region
      : DEFAULT_DISPLAY_PREFERENCES.region;
    const currency = isDisplayCurrency(record.currency)
      ? record.currency
      : DEFAULT_DISPLAY_PREFERENCES.currency;

    return { region, currency };
  } catch {
    return DEFAULT_DISPLAY_PREFERENCES;
  }
}

export function writeDisplayPreferences(preferences: DisplayPreferences): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      DISPLAY_PREFERENCES_STORAGE_KEY,
      JSON.stringify(preferences),
    );
  } catch {
    // ignore storage errors (private mode, WebView quirks)
  }
}
