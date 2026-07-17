export type RecentlyViewedListing = {
  id: string;
  title: string;
  url: string;
  vertical: string | null;
  price: string | number | null;
  currency: string | null;
  city: string | null;
  imageUrl: string | null;
  viewedAt: string;
};

export type RecentlyViewedInput = {
  id: string;
  title: string;
  url?: string;
  vertical?: string | null;
  price?: string | number | null;
  currency?: string | null;
  city?: string | null;
  imageUrl?: string | null;
};

const STORAGE_KEY = "tutopt.recentlyViewedListings.v1";
const MAX_ITEMS = 30;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isRecentlyViewedListing(value: unknown): value is RecentlyViewedListing {
  if (!value || typeof value !== "object") {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.url === "string" &&
    typeof item.viewedAt === "string" &&
    (item.vertical === null || typeof item.vertical === "string") &&
    (item.price === null ||
      typeof item.price === "string" ||
      typeof item.price === "number") &&
    (item.currency === null || typeof item.currency === "string") &&
    (item.city === null || typeof item.city === "string") &&
    (item.imageUrl === null || typeof item.imageUrl === "string")
  );
}

export function normalizeRecentlyViewedItem(
  item: RecentlyViewedInput,
): RecentlyViewedListing {
  return {
    id: item.id,
    title: item.title.trim(),
    url: item.url?.trim() || `/listings/${item.id}`,
    vertical: item.vertical ?? null,
    price: item.price ?? null,
    currency: item.currency ?? null,
    city: item.city?.trim() || null,
    imageUrl: item.imageUrl?.trim() || null,
    viewedAt: new Date().toISOString(),
  };
}

export function getRecentlyViewedListings(): RecentlyViewedListing[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isRecentlyViewedListing).slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

function persist(items: RecentlyViewedListing[]): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // localStorage может быть недоступен (private mode, quota) — не ломаем страницу
  }
}

export function saveRecentlyViewedListing(input: RecentlyViewedInput): void {
  if (!isBrowser() || !input.id || !input.title.trim()) {
    return;
  }

  const normalized = normalizeRecentlyViewedItem(input);
  const existing = getRecentlyViewedListings().filter((item) => item.id !== normalized.id);

  persist([normalized, ...existing]);
}

export function removeRecentlyViewedListing(id: string): void {
  persist(getRecentlyViewedListings().filter((item) => item.id !== id));
}

export function clearRecentlyViewedListings(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
