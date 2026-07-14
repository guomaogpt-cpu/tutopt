/** Public web URL saved in DB for a listing image filename. */
export function buildListingImagePublicUrl(filename: string): string {
  return `/api/uploads/listings/${filename}`;
}

/**
 * Normalize stored / legacy image URLs for display.
 * - /api/uploads/... → as is
 * - /uploads/... → /api/uploads/...
 * - else → as is (blob:, http(s):, etc.)
 */
export function normalizeListingImageUrl(url: string): string {
  if (url.startsWith("/api/uploads/")) {
    return url;
  }
  if (url.startsWith("/uploads/")) {
    return `/api${url}`;
  }
  return url;
}

/** @deprecated Prefer normalizeListingImageUrl */
export const resolveListingImageUrl = normalizeListingImageUrl;
