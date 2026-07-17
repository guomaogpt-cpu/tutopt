import type { ListingVertical } from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";
import { getUserFavoriteListings } from "@/features/favorites/lib/favorites-data";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import type { BuyerLeadItem } from "@/features/leads/lib/leads-data";
import { getBuyerLeads } from "@/features/leads/lib/leads-data";
import { getUserRecentViewedListings } from "@/features/buyer/lib/listing-views";

export type BuyerDashboardData = {
  profile: PublicUser;
  favoriteListings: ListingCardData[];
  favoriteListingIds: string[];
  favoriteVerticals: ListingVertical[];
  leads: BuyerLeadItem[];
  recentViewedListings: ListingCardData[];
};

export async function getBuyerDashboardData(user: PublicUser): Promise<BuyerDashboardData> {
  const [allFavorites, leads, recentViewedListings] = await Promise.all([
    getUserFavoriteListings(user.id),
    getBuyerLeads(user.id),
    getUserRecentViewedListings(user.id, 6),
  ]);

  const favoriteListings = allFavorites.slice(0, 6);
  const favoriteListingIds = allFavorites.map((listing) => listing.id);
  const favoriteVerticals = Array.from(
    new Set(allFavorites.map((listing) => listing.vertical)),
  );

  return {
    profile: user,
    favoriteListings,
    favoriteListingIds,
    favoriteVerticals,
    leads,
    recentViewedListings,
  };
}
