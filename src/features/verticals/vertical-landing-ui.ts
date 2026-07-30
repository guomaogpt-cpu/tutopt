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
export const VERTICAL_LATEST_LISTINGS_GRID_CLASS =
  "grid w-full min-w-0 grid-cols-2 gap-3.5 max-[339px]:grid-cols-1 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";
