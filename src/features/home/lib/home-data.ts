import { ListingStatus, ListingVertical } from "@prisma/client";
import { buildNotExpiredListingFilter } from "@/lib/listings/listing-expiration";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import {
  listingCardSelect,
  serializeListingCards,
} from "@/features/listings/lib/serialize-listing-card";
import { prisma } from "@/shared/lib/prisma";

export const HOME_LISTINGS_PRIMARY_LIMIT = 12;
export const HOME_LISTINGS_SECONDARY_LIMIT = 8;

export type HomeCategoryCard = {
  id: string;
  name: string;
  slug: string;
  listingsCount: number;
};

export type HomePageStats = {
  listingsCount: number;
  sellersCount: number;
  leadsCount: number;
};

export type HomePageData = {
  listings: ListingCardData[];
  moreListings: ListingCardData[];
  stats: HomePageStats;
};

export async function getHomePageData(): Promise<HomePageData> {
  const totalListingsNeeded = HOME_LISTINGS_PRIMARY_LIMIT + HOME_LISTINGS_SECONDARY_LIMIT;
  const notExpired = buildNotExpiredListingFilter();

  const [listings, listingsCount, sellersCount, leadsCount] = await Promise.all([
    prisma.listing.findMany({
      where: {
        status: ListingStatus.PUBLISHED,
        vertical: ListingVertical.OPT,
        AND: [notExpired],
      },
      orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
      take: totalListingsNeeded,
      select: listingCardSelect,
    }),
    prisma.listing.count({
      where: {
        status: ListingStatus.PUBLISHED,
        vertical: ListingVertical.OPT,
        AND: [notExpired],
      },
    }),
    prisma.sellerProfile.count({
      where: {
        listings: {
          some: { status: ListingStatus.PUBLISHED, AND: [notExpired] },
        },
      },
    }),
    prisma.lead.count(),
  ]);

  const primaryListings = serializeListingCards(
    listings.slice(0, HOME_LISTINGS_PRIMARY_LIMIT),
  );
  const moreListings =
    listings.length > HOME_LISTINGS_PRIMARY_LIMIT
      ? serializeListingCards(
          listings.slice(
            HOME_LISTINGS_PRIMARY_LIMIT,
            HOME_LISTINGS_PRIMARY_LIMIT + HOME_LISTINGS_SECONDARY_LIMIT,
          ),
        )
      : [];

  return {
    listings: primaryListings,
    moreListings,
    stats: {
      listingsCount,
      sellersCount,
      leadsCount,
    },
  };
}
