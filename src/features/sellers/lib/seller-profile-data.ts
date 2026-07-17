import { ListingStatus } from "@prisma/client";
import { buildNotExpiredListingFilter } from "@/lib/listings/listing-expiration";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import {
  listingCardSelect,
  serializeListingCards,
} from "@/features/listings/lib/serialize-listing-card";
import { prisma } from "@/shared/lib/prisma";

export const sellerProfileSelect = {
  id: true,
  company_name: true,
  slug: true,
  description: true,
  logo_url: true,
  contact_phone: true,
  contact_email: true,
  whatsapp: true,
  telegram: true,
  website: true,
  is_verified: true,
  created_at: true,
  city: { select: { name: true } },
  region: { select: { name: true } },
  user: {
    select: {
      name: true,
      avatar_url: true,
      phone: true,
      phone_verified_at: true,
      created_at: true,
    },
  },
} as const;

export type SellerProfileData = NonNullable<Awaited<ReturnType<typeof getSellerProfileByParam>>>;

export async function getSellerProfileByParam(param: string) {
  return prisma.sellerProfile.findFirst({
    where: {
      OR: [{ id: param }, { slug: param }],
    },
    select: sellerProfileSelect,
  });
}

export async function getSellerPublishedListings(
  sellerProfileId: string,
): Promise<ListingCardData[]> {
  const listings = await prisma.listing.findMany({
    where: {
      seller_profile_id: sellerProfileId,
      status: ListingStatus.PUBLISHED,
      AND: [buildNotExpiredListingFilter()],
    },
    orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
    select: listingCardSelect,
  });

  return serializeListingCards(listings);
}

export async function getSellerPublishedListingCount(sellerProfileId: string): Promise<number> {
  return prisma.listing.count({
    where: {
      seller_profile_id: sellerProfileId,
      status: ListingStatus.PUBLISHED,
      AND: [buildNotExpiredListingFilter()],
    },
  });
}
