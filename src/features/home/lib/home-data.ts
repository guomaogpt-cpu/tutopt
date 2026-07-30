import { ListingStatus, ListingVertical, type Prisma } from "@prisma/client";
import { buildNotExpiredListingFilter } from "@/lib/listings/listing-expiration";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import {
  listingCardSelect,
  serializeListingCards,
  type ListingCardRow,
} from "@/features/listings/lib/serialize-listing-card";
import { prisma } from "@/shared/lib/prisma";

export const HOME_LATEST_LIMIT = 12;
export const HOME_SECTION_LIMIT = 6;

export type HomeCategoryCard = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
  listingsCount: number;
};

export type HomePageStats = {
  listingsCount: number;
  sellersCount: number;
  leadsCount: number;
};

export type HomePageData = {
  latest: ListingCardData[];
  popularMarket: ListingCardData[];
  market: ListingCardData[];
  opt: ListingCardData[];
  services: ListingCardData[];
  cargo: ListingCardData[];
  emptyCategories: {
    market: HomeCategoryCard[];
    opt: HomeCategoryCard[];
    services: HomeCategoryCard[];
    cargo: HomeCategoryCard[];
  };
  stats: HomePageStats;
  /** @deprecated Prefer `latest` — kept for older call sites during Phase 63. */
  listings: ListingCardData[];
  /** @deprecated Prefer vertical sections. */
  moreListings: ListingCardData[];
};

const publishedWhere: Prisma.ListingWhereInput = {
  status: ListingStatus.PUBLISHED,
  AND: [buildNotExpiredListingFilter()],
};

async function fetchLatestByVertical(
  vertical: ListingVertical,
  take: number,
): Promise<ListingCardData[]> {
  const rows: ListingCardRow[] = await prisma.listing.findMany({
    where: {
      ...publishedWhere,
      vertical,
    },
    orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
    take,
    select: listingCardSelect,
  });

  return serializeListingCards(rows);
}

async function fetchCategories(
  vertical: ListingVertical,
  take = 4,
): Promise<HomeCategoryCard[]> {
  const rows = await prisma.category.findMany({
    where: {
      is_active: true,
      vertical,
    },
    orderBy: [{ sort_order: "asc" }, { name: "asc" }],
    take,
    select: {
      id: true,
      name: true,
      slug: true,
      vertical: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    vertical: row.vertical,
    listingsCount: 0,
  }));
}

export async function getHomePageData(): Promise<HomePageData> {
  const [
    latestRows,
    popularMarketRows,
    market,
    opt,
    services,
    cargo,
    marketCategories,
    optCategories,
    servicesCategories,
    cargoCategories,
    listingsCount,
    sellersCount,
    leadsCount,
  ] = await Promise.all([
    prisma.listing.findMany({
      where: publishedWhere,
      orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
      take: HOME_LATEST_LIMIT,
      select: listingCardSelect,
    }),
    prisma.listing.findMany({
      where: {
        ...publishedWhere,
        vertical: ListingVertical.MARKET,
      },
      orderBy: [{ view_count: "desc" }, { published_at: "desc" }],
      take: HOME_SECTION_LIMIT,
      select: listingCardSelect,
    }),
    fetchLatestByVertical(ListingVertical.MARKET, HOME_SECTION_LIMIT),
    fetchLatestByVertical(ListingVertical.OPT, HOME_SECTION_LIMIT),
    fetchLatestByVertical(ListingVertical.SERVICES, HOME_SECTION_LIMIT),
    fetchLatestByVertical(ListingVertical.CARGO, HOME_SECTION_LIMIT),
    fetchCategories(ListingVertical.MARKET),
    fetchCategories(ListingVertical.OPT),
    fetchCategories(ListingVertical.SERVICES),
    fetchCategories(ListingVertical.CARGO),
    prisma.listing.count({ where: publishedWhere }),
    prisma.sellerProfile.count({
      where: {
        listings: {
          some: publishedWhere,
        },
      },
    }),
    prisma.lead.count(),
  ]);

  const latest = serializeListingCards(latestRows);
  const popularMarket = serializeListingCards(popularMarketRows);

  return {
    latest,
    popularMarket,
    market,
    opt,
    services,
    cargo,
    emptyCategories: {
      market: marketCategories,
      opt: optCategories,
      services: servicesCategories,
      cargo: cargoCategories,
    },
    stats: {
      listingsCount,
      sellersCount,
      leadsCount,
    },
    listings: latest,
    moreListings: popularMarket,
  };
}
