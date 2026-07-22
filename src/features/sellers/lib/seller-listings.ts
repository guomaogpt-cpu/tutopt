import { ListingStatus, type ListingVertical, type Prisma } from "@prisma/client";
import { buildNotExpiredListingFilter } from "@/lib/listings/listing-expiration";
import { parseListingVerticalParam } from "@/features/verticals/verticals";

export const SELLER_LISTINGS_PER_PAGE = 20;

/**
 * "deleted" is intentionally absent: the schema has no soft-delete field
 * (deleted_at / DELETED status), so this page manages archive via
 * ListingStatus.ARCHIVED only.
 */
export type SellerListingsStatusFilter =
  | "all"
  | "active"
  | "pending"
  | "rejected"
  | "archived"
  | "expired";

export type SellerListingsFilters = {
  status: SellerListingsStatusFilter;
  vertical: ListingVertical | null;
  q: string;
  page: number;
};

const STATUS_VALUES: SellerListingsStatusFilter[] = [
  "all",
  "active",
  "pending",
  "rejected",
  "archived",
  "expired",
];

export const sellerListingsStatusOptions: {
  value: SellerListingsStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "Все" },
  { value: "active", label: "Активные" },
  { value: "pending", label: "На модерации" },
  { value: "rejected", label: "Отклонённые" },
  { value: "archived", label: "Архив" },
  { value: "expired", label: "Истёкшие" },
];

export function parseSellerListingsParams(
  params: Record<string, string | string[] | undefined>,
): SellerListingsFilters {
  const get = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value.trim() : "";
  };

  const statusParam = get("status");
  const status = STATUS_VALUES.includes(statusParam as SellerListingsStatusFilter)
    ? (statusParam as SellerListingsStatusFilter)
    : "all";

  const pageRaw = Number.parseInt(get("page"), 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  return {
    status,
    vertical: parseListingVerticalParam(get("vertical")),
    q: get("q"),
    page,
  };
}

export function buildSellerListingsWhere(
  sellerProfileId: string,
  filters: SellerListingsFilters,
  now: Date = new Date(),
): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = {
    seller_profile_id: sellerProfileId,
  };

  switch (filters.status) {
    case "active":
      where.status = ListingStatus.PUBLISHED;
      where.AND = [buildNotExpiredListingFilter(now)];
      break;
    case "pending":
      where.status = ListingStatus.PENDING_MODERATION;
      break;
    case "rejected":
      where.status = ListingStatus.REJECTED;
      break;
    case "archived":
      where.status = ListingStatus.ARCHIVED;
      break;
    case "expired":
      where.status = ListingStatus.PUBLISHED;
      where.expires_at = { lt: now };
      break;
    case "all":
    default:
      break;
  }

  if (filters.vertical) {
    where.vertical = filters.vertical;
  }

  if (filters.q) {
    where.title = { contains: filters.q, mode: "insensitive" };
  }

  return where;
}

export function buildSellerListingsQueryString(
  filters: SellerListingsFilters,
  overrides?: Partial<SellerListingsFilters>,
): string {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (next.status !== "all") {
    params.set("status", next.status);
  }
  if (next.vertical) {
    params.set("vertical", next.vertical);
  }
  if (next.q) {
    params.set("q", next.q);
  }
  if (next.page > 1) {
    params.set("page", String(next.page));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function hasActiveSellerListingsFilters(filters: SellerListingsFilters): boolean {
  return filters.status !== "all" || filters.vertical !== null || filters.q !== "";
}
