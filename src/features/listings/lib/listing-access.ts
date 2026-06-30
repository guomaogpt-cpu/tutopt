import { ListingStatus, UserRole } from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";

type ListingAccessContext = {
  status: ListingStatus;
  sellerProfile: {
    user_id: string;
  };
};

export function canViewListing(listing: ListingAccessContext, user: PublicUser | null): boolean {
  if (listing.status === ListingStatus.PUBLISHED) {
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
