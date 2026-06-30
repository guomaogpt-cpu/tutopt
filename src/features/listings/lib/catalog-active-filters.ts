import type { ListingsCatalogFilters } from "@/features/listings/lib/listings-catalog";
import { buildListingsCatalogQueryString } from "@/features/listings/lib/listings-catalog";

export type CatalogLookupMaps = {
  categories: Record<string, string>;
  cities: Record<string, string>;
  brands: Record<string, string>;
};

export type ActiveFilterChip = {
  id: string;
  label: string;
  clearPatch: Partial<ListingsCatalogFilters>;
};

export function getActiveFilterChips(
  filters: ListingsCatalogFilters,
  lookups: CatalogLookupMaps,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (filters.q) {
    chips.push({
      id: "q",
      label: `Поиск: ${filters.q}`,
      clearPatch: { q: "" },
    });
  }

  if (filters.categoryId) {
    chips.push({
      id: "category",
      label: `Категория: ${lookups.categories[filters.categoryId] ?? "Выбрана"}`,
      clearPatch: { categoryId: "" },
    });
  }

  if (filters.cityId) {
    chips.push({
      id: "city",
      label: `Город: ${lookups.cities[filters.cityId] ?? "Выбран"}`,
      clearPatch: { cityId: "" },
    });
  }

  if (filters.brandId) {
    chips.push({
      id: "brand",
      label: `Бренд: ${lookups.brands[filters.brandId] ?? "Выбран"}`,
      clearPatch: { brandId: "" },
    });
  }

  if (filters.priceMin) {
    chips.push({
      id: "priceFrom",
      label: `Цена от: ${filters.priceMin}`,
      clearPatch: { priceMin: "" },
    });
  }

  if (filters.priceMax) {
    chips.push({
      id: "priceTo",
      label: `Цена до: ${filters.priceMax}`,
      clearPatch: { priceMax: "" },
    });
  }

  if (filters.withPhotos) {
    chips.push({
      id: "withPhoto",
      label: "С фото",
      clearPatch: { withPhotos: false },
    });
  }

  return chips;
}

export function buildCatalogHref(
  filters: ListingsCatalogFilters,
  patch: Partial<ListingsCatalogFilters> = {},
): string {
  return `/listings${buildListingsCatalogQueryString(filters, { ...patch, page: 1 })}`;
}
