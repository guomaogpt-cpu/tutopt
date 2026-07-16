import { ListingStatus, type ListingUnit, type ListingVertical, type Prisma } from "@prisma/client";
import { parseListingVerticalParam } from "@/features/verticals/verticals";

export const LISTINGS_PER_PAGE = 12;

export type ListingSort = "newest" | "oldest" | "price_asc" | "price_desc";

export type ListingsCatalogFilters = {
  q: string;
  categoryId: string;
  cityId: string;
  brandId: string;
  priceMin: string;
  priceMax: string;
  withPhotos: boolean;
  /** When set, filters by Listing.vertical. When empty, catalog shows all (current behavior). */
  vertical: ListingVertical | null;
  sort: ListingSort;
  page: number;
};

export type ListingCardData = {
  id: string;
  title: string;
  price: Prisma.Decimal;
  currency: string;
  moq: number;
  unit: ListingUnit;
  status: ListingStatus;
  vertical: ListingVertical;
  stock_quantity: number | null;
  created_at: Date;
  published_at: Date | null;
  category: { name: string };
  city: { name: string } | null;
  brand: { name: string } | null;
  sellerProfile: { company_name: string };
  images: { url: string }[];
};

const SORT_VALUES: ListingSort[] = ["newest", "oldest", "price_asc", "price_desc"];

export function parseListingsCatalogParams(
  params: Record<string, string | string[] | undefined>,
): ListingsCatalogFilters {
  const get = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value.trim() : "";
  };

  const sortParam = get("sort");
  const sort = SORT_VALUES.includes(sortParam as ListingSort)
    ? (sortParam as ListingSort)
    : "newest";

  const pageRaw = Number.parseInt(get("page"), 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  return {
    q: get("q"),
    categoryId: get("category"),
    cityId: get("city"),
    brandId: get("brand"),
    priceMin: get("priceFrom") || get("priceMin"),
    priceMax: get("priceTo") || get("priceMax"),
    withPhotos: get("withPhoto") === "1" || get("withPhotos") === "1",
    vertical: parseListingVerticalParam(get("vertical")),
    sort,
    page,
  };
}

export function hasActiveCatalogFilters(filters: ListingsCatalogFilters): boolean {
  return Boolean(
    filters.q ||
      filters.categoryId ||
      filters.cityId ||
      filters.brandId ||
      filters.priceMin ||
      filters.priceMax ||
      filters.withPhotos,
  );
}

export function buildListingsCatalogWhere(
  filters: ListingsCatalogFilters,
): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = {
    status: ListingStatus.PUBLISHED,
  };

  if (filters.q) {
    where.title = { contains: filters.q, mode: "insensitive" };
  }

  if (filters.categoryId) {
    where.category_id = filters.categoryId;
  }

  if (filters.cityId) {
    where.city_id = filters.cityId;
  }

  if (filters.brandId) {
    where.brand_id = filters.brandId;
  }

  if (filters.vertical) {
    where.vertical = filters.vertical;
  }

  const priceFilter: Prisma.DecimalFilter = {};

  if (filters.priceMin) {
    const min = Number.parseFloat(filters.priceMin);
    if (Number.isFinite(min)) {
      priceFilter.gte = min;
    }
  }

  if (filters.priceMax) {
    const max = Number.parseFloat(filters.priceMax);
    if (Number.isFinite(max)) {
      priceFilter.lte = max;
    }
  }

  if (Object.keys(priceFilter).length > 0) {
    where.price = priceFilter;
  }

  if (filters.withPhotos) {
    where.images = { some: {} };
  }

  return where;
}

export function buildListingsCatalogOrderBy(
  sort: ListingSort,
): Prisma.ListingOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return { created_at: "asc" };
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "newest":
    default:
      return { created_at: "desc" };
  }
}

export function buildListingsCatalogQueryString(
  filters: ListingsCatalogFilters,
  overrides?: Partial<ListingsCatalogFilters>,
): string {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (next.q) {
    params.set("q", next.q);
  }
  if (next.categoryId) {
    params.set("category", next.categoryId);
  }
  if (next.cityId) {
    params.set("city", next.cityId);
  }
  if (next.brandId) {
    params.set("brand", next.brandId);
  }
  if (next.priceMin) {
    params.set("priceFrom", next.priceMin);
  }
  if (next.priceMax) {
    params.set("priceTo", next.priceMax);
  }
  if (next.withPhotos) {
    params.set("withPhoto", "1");
  }
  if (next.vertical) {
    params.set("vertical", next.vertical);
  }
  if (next.sort !== "newest") {
    params.set("sort", next.sort);
  }
  if (next.page > 1) {
    params.set("page", String(next.page));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export const listingSortOptions: { value: ListingSort; label: string }[] = [
  { value: "newest", label: "Сначала новые" },
  { value: "oldest", label: "Сначала старые" },
  { value: "price_asc", label: "Дешевле" },
  { value: "price_desc", label: "Дороже" },
];
