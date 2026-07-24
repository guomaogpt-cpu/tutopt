import { ListingStatus, type ListingVertical } from "@prisma/client";
import { buildNotExpiredListingFilter } from "@/lib/listings/listing-expiration";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import {
  listingCardSelect,
  serializeListingCards,
} from "@/features/listings/lib/serialize-listing-card";
import { prisma } from "@/shared/lib/prisma";

export type VerticalCategoryCard = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
};

export type VerticalPageData = {
  categories: VerticalCategoryCard[];
  listings: ListingCardData[];
  publishedCount: number;
};

export async function getVerticalPageData(
  verticalId: ListingVertical,
): Promise<VerticalPageData> {
  const notExpired = buildNotExpiredListingFilter();
  const [categories, listings, publishedCount] = await Promise.all([
    prisma.category.findMany({
      where: {
        is_active: true,
        vertical: verticalId,
        parent_id: null,
      },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      take: verticalId === "MARKET" || verticalId === "OPT" ? 24 : 12,
      select: { id: true, name: true, slug: true, vertical: true },
    }),
    prisma.listing.findMany({
      where: {
        status: ListingStatus.PUBLISHED,
        vertical: verticalId,
        AND: [notExpired],
      },
      orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
      take: 8,
      select: listingCardSelect,
    }),
    prisma.listing.count({
      where: {
        status: ListingStatus.PUBLISHED,
        vertical: verticalId,
        AND: [notExpired],
      },
    }),
  ]);

  return { categories, listings: serializeListingCards(listings), publishedCount };
}
