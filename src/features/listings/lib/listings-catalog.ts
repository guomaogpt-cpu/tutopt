import { ListingStatus, type ListingUnit, type ListingVertical, type Prisma } from "@prisma/client";
import { buildNotExpiredListingFilter } from "@/lib/listings/listing-expiration";
import { parseListingVerticalParam } from "@/features/verticals/verticals";

export const LISTINGS_PER_PAGE = 12;

export type ListingSort = "newest" | "oldest" | "price_asc" | "price_desc";

export type ListingsCatalogFilters = {
  q: string;
  categoryId: string;
  subcategoryId: string;
  cityId: string;
  brandId: string;
  priceMin: string;
  priceMax: string;
  withPhotos: boolean;
  /** When set, filters by Listing.vertical. When empty, catalog shows all (current behavior). */
  vertical: ListingVertical | null;
  /**
   * UI-only prototype photo search mode (`photoSearch=1`).
   * Does not change query matching — catalog filters still apply as usual.
   */
  photoSearch: boolean;
  sort: ListingSort;
  page: number;
};

export type CatalogQueryContext = {
  categoryIds?: string[];
  textSearch?: Prisma.ListingWhereInput;
};

export type ListingCardData = {
  id: string;
  title: string;
  price: string;
  currency: string;
  moq: number;
  unit: ListingUnit;
  status: ListingStatus;
  vertical: ListingVertical;
  posted_as_company: boolean;
  stock_quantity: number | null;
  created_at: string;
  published_at: string | null;
  category: { name: string; parent_id: string | null; parentName: string | null };
  city: { name: string } | null;
  brand: { name: string } | null;
  sellerProfile: {
    id: string;
    company_name: string;
    company_type: string | null;
    slug: string;
    verification_status: string;
    user: { name: string };
  };
  images: { url: string }[];
  characteristics: unknown;
  highlightChips: Array<{ label: string; value: string }>;
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
    subcategoryId: get("subcategory"),
    cityId: get("city"),
    brandId: get("brand"),
    priceMin: get("priceFrom") || get("priceMin"),
    priceMax: get("priceTo") || get("priceMax"),
    withPhotos: get("withPhoto") === "1" || get("withPhotos") === "1",
    vertical: parseListingVerticalParam(get("vertical")),
    photoSearch: get("photoSearch") === "1",
    sort,
    page,
  };
}

export function hasActiveCatalogFilters(filters: ListingsCatalogFilters): boolean {
  return Boolean(
    filters.q ||
      filters.categoryId ||
      filters.subcategoryId ||
      filters.cityId ||
      filters.brandId ||
      filters.priceMin ||
      filters.priceMax ||
      filters.withPhotos,
  );
}

export function buildListingsCatalogWhere(
  filters: ListingsCatalogFilters,
  context: CatalogQueryContext = {},
): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = {
    status: ListingStatus.PUBLISHED,
    AND: [buildNotExpiredListingFilter()],
  };

  if (context.textSearch && Object.keys(context.textSearch).length > 0) {
    const existingAnd = Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : [];
    where.AND = [...existingAnd, context.textSearch];
  } else if (filters.q) {
    where.title = { contains: filters.q, mode: "insensitive" };
  }

  if (context.categoryIds?.length) {
    where.category_id = { in: context.categoryIds };
  } else if (filters.subcategoryId) {
    where.category_id = filters.subcategoryId;
  } else if (filters.categoryId) {
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
  if (next.subcategoryId) {
    params.set("subcategory", next.subcategoryId);
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
  if (next.photoSearch) {
    params.set("photoSearch", "1");
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

export const listingSortOptions: Array<{
  value: ListingSort;
  labelKey:
    | "sort.newest"
    | "sort.oldest"
    | "sort.priceAsc"
    | "sort.priceDesc";
}> = [
  { value: "newest", labelKey: "sort.newest" },
  { value: "oldest", labelKey: "sort.oldest" },
  { value: "price_asc", labelKey: "sort.priceAsc" },
  { value: "price_desc", labelKey: "sort.priceDesc" },
];
