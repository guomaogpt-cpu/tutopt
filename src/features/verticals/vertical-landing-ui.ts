import type { ListingVertical } from "@prisma/client";

/** Catalog filters expect `category` as category id (see listings-catalog). */
export function buildVerticalCategoryListingsHref(
  vertical: ListingVertical,
  categoryId: string,
): string {
  const params = new URLSearchParams();
  params.set("vertical", vertical);
  params.set("category", categoryId);
  return `/listings?${params.toString()}`;
}

/** Shared compact grid for “Последние объявления” on vertical landing pages. */
export { LISTING_CARD_GRID_CLASS as VERTICAL_LATEST_LISTINGS_GRID_CLASS } from "@/components/listings/listing-card-grid";
