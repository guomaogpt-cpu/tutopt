import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import {
  listingCardSelect,
  serializeListingCard,
} from "@/features/listings/lib/serialize-listing-card";
import { prisma } from "@/shared/lib/prisma";

export const favoriteListingSelect = listingCardSelect;

export async function getUserFavoriteListingIds(userId: string): Promise<string[]> {
  const favorites = await prisma.favorite.findMany({
    where: { user_id: userId },
    select: { listing_id: true },
    orderBy: { created_at: "desc" },
  });

  return favorites.map((favorite) => favorite.listing_id);
}

export async function getUserFavoriteListings(userId: string): Promise<ListingCardData[]> {
  const favorites = await prisma.favorite.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    select: {
      listing: {
        select: favoriteListingSelect,
      },
    },
  });

  return favorites.map((favorite) => serializeListingCard(favorite.listing));
}

export async function getUserFavoritesPageData(userId: string): Promise<{
  listings: ListingCardData[];
  lastAddedAt: Date | null;
}> {
  const favorites = await prisma.favorite.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    select: {
      created_at: true,
      listing: {
        select: favoriteListingSelect,
      },
    },
  });

  return {
    listings: favorites.map((favorite) => serializeListingCard(favorite.listing)),
    lastAddedAt: favorites[0]?.created_at ?? null,
  };
}
