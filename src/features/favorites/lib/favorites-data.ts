import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { prisma } from "@/shared/lib/prisma";

export const favoriteListingSelect = {
  id: true,
  title: true,
  price: true,
  currency: true,
  moq: true,
  unit: true,
  status: true,
  created_at: true,
  published_at: true,
  category: { select: { name: true } },
  city: { select: { name: true } },
  brand: { select: { name: true } },
  sellerProfile: { select: { company_name: true } },
  images: {
    orderBy: { sort_order: "asc" as const },
    take: 1,
    select: { url: true },
  },
} as const;

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

  return favorites.map((favorite) => favorite.listing);
}
