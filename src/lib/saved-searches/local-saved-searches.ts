export type SavedSearch = {
  id: string;
  title: string;
  url: string;
  query: string | null;
  vertical: string | null;
  createdAt: string;
};

export type SavedSearchInput = {
  title: string;
  url: string;
  query?: string | null;
  vertical?: string | null;
};

const STORAGE_KEY = "tutopt.savedSearches.v1";
const MAX_SAVED_SEARCHES = 20;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Каноничный вид URL поиска: убирает page (сохранённый поиск всегда
 * открывается с первой страницы) и сортирует параметры, чтобы одинаковые
 * поиски с разным порядком параметров считались дублями.
 */
export function normalizeSearchUrl(url: string): string {
  const [pathPart, queryPart] = url.split("?");
  const pathname = pathPart || "/listings";

  if (!queryPart) {
    return pathname;
  }

  const params = new URLSearchParams(queryPart);
  params.delete("page");
  params.sort();

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function isSavedSearch(value: unknown): value is SavedSearch {
  if (!value || typeof value !== "object") {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.url === "string" &&
    typeof item.createdAt === "string" &&
    (item.query === null || typeof item.query === "string") &&
    (item.vertical === null || typeof item.vertical === "string")
  );
}

export function getSavedSearches(): SavedSearch[] {
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

    return parsed.filter(isSavedSearch).slice(0, MAX_SAVED_SEARCHES);
  } catch {
    return [];
  }
}

function persist(searches: SavedSearch[]): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(searches.slice(0, MAX_SAVED_SEARCHES)),
    );
  } catch {
    // localStorage может быть недоступен (private mode, quota) — не ломаем страницу
  }
}

export function isSearchSaved(url: string): boolean {
  const normalized = normalizeSearchUrl(url);
  return getSavedSearches().some((item) => normalizeSearchUrl(item.url) === normalized);
}

export function saveSearch(input: SavedSearchInput): SavedSearch | null {
  if (!isBrowser()) {
    return null;
  }

  const normalizedUrl = normalizeSearchUrl(input.url);
  const existing = getSavedSearches();

  const duplicate = existing.find(
    (item) => normalizeSearchUrl(item.url) === normalizedUrl,
  );
  if (duplicate) {
    return duplicate;
  }

  const search: SavedSearch = {
    id:
      typeof window.crypto !== "undefined" && "randomUUID" in window.crypto
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    title: input.title.trim() || "Все объявления",
    url: normalizedUrl,
    query: input.query?.trim() || null,
    vertical: input.vertical ?? null,
    createdAt: new Date().toISOString(),
  };

  persist([search, ...existing]);
  return search;
}

export function removeSavedSearch(id: string): void {
  persist(getSavedSearches().filter((item) => item.id !== id));
}

export function clearSavedSearches(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
