import { ListingStatus, type ListingVertical } from "@prisma/client";
import { normalizeListingTitleForDuplicate } from "@/lib/moderation/content-checks";
import { prisma } from "@/shared/lib/prisma";

const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

const EXCLUDED_DUPLICATE_STATUSES: ListingStatus[] = [
  ListingStatus.REJECTED,
  ListingStatus.ARCHIVED,
];

export async function findRecentDuplicateListing(params: {
  sellerProfileId: string;
  title: string;
  categoryId: string;
  vertical: ListingVertical;
  excludeListingId?: string;
}): Promise<{ id: string; title: string } | null> {
  const normalizedTitle = normalizeListingTitleForDuplicate(params.title);
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS);

  const recentListings = await prisma.listing.findMany({
    where: {
      seller_profile_id: params.sellerProfileId,
      category_id: params.categoryId,
      vertical: params.vertical,
      created_at: { gte: since },
      status: { notIn: EXCLUDED_DUPLICATE_STATUSES },
      ...(params.excludeListingId ? { id: { not: params.excludeListingId } } : {}),
    },
    select: {
      id: true,
      title: true,
    },
  });

  return (
    recentListings.find(
      (listing) => normalizeListingTitleForDuplicate(listing.title) === normalizedTitle,
    ) ?? null
  );
}

export async function hasPossibleDuplicateListing(params: {
  sellerProfileId: string;
  title: string;
  categoryId: string;
  vertical: ListingVertical;
  listingId: string;
}): Promise<boolean> {
  const duplicate = await findRecentDuplicateListing({
    sellerProfileId: params.sellerProfileId,
    title: params.title,
    categoryId: params.categoryId,
    vertical: params.vertical,
    excludeListingId: params.listingId,
  });

  return duplicate !== null;
}
