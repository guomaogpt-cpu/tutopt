import { ListingStatus } from "@prisma/client";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { favoriteListingSelect } from "@/features/favorites/lib/favorites-data";
import { prisma } from "@/shared/lib/prisma";

export async function recordListingView(userId: string, listingId: string): Promise<void> {
  await prisma.userListingView.deleteMany({
    where: {
      user_id: userId,
      listing_id: listingId,
    },
  });

  await prisma.userListingView.create({
    data: {
      user_id: userId,
      listing_id: listingId,
    },
  });
}

export async function getUserRecentViewedListings(
  userId: string,
  limit: number,
): Promise<ListingCardData[]> {
  const views = await prisma.userListingView.findMany({
    where: {
      user_id: userId,
      listing: {
        status: ListingStatus.PUBLISHED,
      },
    },
    orderBy: { viewed_at: "desc" },
    take: limit * 3,
    select: {
      listing_id: true,
      listing: {
        select: favoriteListingSelect,
      },
    },
  });

  const seen = new Set<string>();
  const listings: ListingCardData[] = [];

  for (const view of views) {
    if (seen.has(view.listing_id)) {
      continue;
    }

    seen.add(view.listing_id);
    listings.push(view.listing);

    if (listings.length >= limit) {
      break;
    }
  }

  return listings;
}
