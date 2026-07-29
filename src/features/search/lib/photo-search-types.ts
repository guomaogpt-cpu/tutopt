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
  prototype: true;
  results: PhotoSearchResultItem[];
  total: number;
};

export const PHOTO_SEARCH_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const PHOTO_SEARCH_MAX_BYTES = 5 * 1024 * 1024;
export const PHOTO_SEARCH_UI_LIMIT = 6;
