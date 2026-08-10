import type { ListingVertical } from "@prisma/client";
import {
  buildListingsCatalogQueryString,
  type ListingSort,
  type ListingsCatalogFilters,
} from "@/features/listings/lib/listings-catalog";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";

export type CatalogLookupMaps = {
  categories: Record<string, string>;
  cities: Record<string, string>;
  brands: Record<string, string>;
};

export type ActiveFilterChip = {
  id: string;
  label: string;
  clearPatch: Partial<ListingsCatalogFilters>;
  clearAriaLabelKey?: DictionaryKey;
};

type ChipTranslator = (key: DictionaryKey) => string;

type ChipOptions = {
  t: ChipTranslator;
  includeSort?: boolean;
  sortLabel?: string;
};

function verticalLabel(vertical: ListingVertical, t: ChipTranslator): string {
  switch (vertical) {
    case "MARKET":
      return t("vertical.market");
    case "OPT":
      return t("vertical.opt");
    case "SERVICES":
      return t("vertical.services");
    case "CARGO":
      return t("vertical.cargo");
  }
}

export function getActiveFilterChips(
  filters: ListingsCatalogFilters,
  lookups: CatalogLookupMaps,
  options: ChipOptions,
): ActiveFilterChip[] {
  const { t, includeSort = false, sortLabel } = options;
  const chips: ActiveFilterChip[] = [];

  if (filters.q) {
    chips.push({
      id: "q",
      label: `${t("search.find")}: ${filters.q}`,
      clearPatch: { q: "" },
      clearAriaLabelKey: "filters.clearOne",
    });
  }

  if (filters.vertical) {
    chips.push({
      id: "vertical",
      label: verticalLabel(filters.vertical, t),
      clearPatch: { vertical: null, categoryId: "", subcategoryId: "", brandId: "" },
      clearAriaLabelKey: "filters.clearOne",
    });
  }

  if (filters.subcategoryId) {
    chips.push({
      id: "subcategory",
      label: lookups.categories[filters.subcategoryId] ?? t("filters.subcategory"),
      clearPatch: { subcategoryId: "" },
      clearAriaLabelKey: "filters.clearOne",
    });
  } else if (filters.categoryId) {
    chips.push({
      id: "category",
      label: lookups.categories[filters.categoryId] ?? t("filters.category"),
      clearPatch: { categoryId: "", subcategoryId: "" },
      clearAriaLabelKey: "filters.clearOne",
    });
  }

  if (filters.cityId) {
    chips.push({
      id: "city",
      label: lookups.cities[filters.cityId] ?? t("filters.city"),
      clearPatch: { cityId: "" },
      clearAriaLabelKey: "filters.clearOne",
    });
  }

  if (filters.brandId) {
    chips.push({
      id: "brand",
      label: `${t("catalog.brand")}: ${lookups.brands[filters.brandId] ?? "—"}`,
      clearPatch: { brandId: "" },
      clearAriaLabelKey: "filters.clearOne",
    });
  }

  if (filters.priceMin || filters.priceMax) {
    const from = filters.priceMin ? `${t("filters.priceFrom")} ${filters.priceMin}` : "";
    const to = filters.priceMax ? `${t("filters.priceTo")} ${filters.priceMax}` : "";
    chips.push({
      id: "price",
      label: [from, to].filter(Boolean).join(" · "),
      clearPatch: { priceMin: "", priceMax: "" },
      clearAriaLabelKey: "filters.clearOne",
    });
  }

  if (filters.withPhotos) {
    chips.push({
      id: "withPhoto",
      label: t("filters.onlyWithPhoto"),
      clearPatch: { withPhotos: false },
      clearAriaLabelKey: "filters.clearOne",
    });
  }

  if (includeSort && filters.sort !== "newest" && sortLabel) {
    chips.push({
      id: "sort",
      label: sortLabel,
      clearPatch: { sort: "newest" satisfies ListingSort },
      clearAriaLabelKey: "filters.clearOne",
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

export function getCatalogAnalyticsContext(filters: ListingsCatalogFilters) {
  return {
    vertical: filters.vertical,
    hasQuery: Boolean(filters.q),
    hasCategory: Boolean(filters.categoryId || filters.subcategoryId),
    hasCity: Boolean(filters.cityId),
    hasPrice: Boolean(filters.priceMin || filters.priceMax),
    sort: filters.sort,
  };
}
