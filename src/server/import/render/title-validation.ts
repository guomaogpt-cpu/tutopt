const INVALID_TITLE_EXACT = new Set([
  "lalafo",
  "lalafo.kg",
  "www.lalafo.kg",
  "объявления lalafo",
  "lalafo объявления",
]);

const INVALID_TITLE_PATTERN =
  /^(lalafo(\.kg)?|www\.lalafo\.kg|объявления\s+lalafo|lalafo\s+объявления)$/i;

export function isValidListingTitle(title: string | null | undefined): boolean {
  if (!title?.trim()) {
    return false;
  }

  const normalized = title.trim();
  if (normalized.length < 3) {
    return false;
  }

  const lower = normalized.toLowerCase();
  if (INVALID_TITLE_EXACT.has(lower)) {
    return false;
  }

  if (INVALID_TITLE_PATTERN.test(normalized)) {
    return false;
  }

  if (/^lalafo\.[a-z]{2,3}$/i.test(normalized)) {
    return false;
  }

  if (/^https?:\/\//i.test(normalized)) {
    return false;
  }

  try {
    const hostname = new URL(`https://${normalized.replace(/^\/\//, "")}`).hostname;
    if (/lalafo\.(kg|com|uz|az)/i.test(hostname) && normalized.split(/\s+/).length <= 2) {
      return false;
    }
  } catch {
    // not a URL-shaped title
  }

  return true;
}

export function sanitizeListingTitle(title: string | null | undefined): string | null {
  if (!isValidListingTitle(title)) {
    return null;
  }
  return title?.trim() ?? null;
}
