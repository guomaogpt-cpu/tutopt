import { ListingStatus, type ListingVertical } from "@prisma/client";
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
  const [categories, listings, publishedCount] = await Promise.all([
    prisma.category.findMany({
      where: {
        is_active: true,
        vertical: verticalId,
        parent_id: null,
      },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      take: 12,
      select: { id: true, name: true, slug: true, vertical: true },
    }),
    prisma.listing.findMany({
      where: {
        status: ListingStatus.PUBLISHED,
        vertical: verticalId,
      },
      orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
      take: 8,
      select: listingCardSelect,
    }),
    prisma.listing.count({
      where: {
        status: ListingStatus.PUBLISHED,
        vertical: verticalId,
      },
    }),
  ]);

  return { categories, listings: serializeListingCards(listings), publishedCount };
}
