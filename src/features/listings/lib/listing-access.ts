import { ListingStatus, UserRole } from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";
import { isListingExpired } from "@/lib/listings/listing-expiration";

type ListingAccessContext = {
  status: ListingStatus;
  expires_at?: Date | string | null;
  sellerProfile: {
    user_id: string;
  };
};

export function canViewListing(listing: ListingAccessContext, user: PublicUser | null): boolean {
  if (
    listing.status === ListingStatus.PUBLISHED &&
    !isListingExpired({ expires_at: listing.expires_at ?? null })
  ) {
    return true;
  }

  if (!user) {
    return false;
  }

  if (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) {
    return true;
  }

  return listing.sellerProfile.user_id === user.id;
}
