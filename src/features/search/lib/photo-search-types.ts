import type { ListingVertical } from "@prisma/client";

export type PhotoSearchResultItem = {
  id: string;
  title: string;
  priceLabel: string;
  city: string | null;
  vertical: ListingVertical;
  imageUrl: string | null;
};

export type PhotoSearchResponse = {
  ok: true;
  mode: "hybrid-prototype";
  visualSearch: boolean;
  prototype: true;
  items: PhotoSearchResultItem[];
  /** @deprecated Prefer `items` — kept for older clients. */
  results: PhotoSearchResultItem[];
  total: number;
  explanation: string;
  queryHint: string | null;
  vertical: ListingVertical | null;
  categoryId: string | null;
};

export const PHOTO_SEARCH_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const PHOTO_SEARCH_MAX_BYTES = 5 * 1024 * 1024;
export const PHOTO_SEARCH_UI_LIMIT = 6;
export const PHOTO_SEARCH_API_LIMIT = 12;
export const PHOTO_SEARCH_QUERY_HINT_MAX = 120;
