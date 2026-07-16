import { ListingStatus } from "@prisma/client";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
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
  user: { select: { name: true, avatar_url: true } },
} as const;

export type SellerProfileData = NonNullable<Awaited<ReturnType<typeof getSellerProfileByParam>>>;

const listingCardSelect = {
  id: true,
  title: true,
  price: true,
  currency: true,
  moq: true,
  unit: true,
  status: true,
  vertical: true,
  stock_quantity: true,
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
};

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
  return prisma.listing.findMany({
    where: {
      seller_profile_id: sellerProfileId,
      status: ListingStatus.PUBLISHED,
    },
    orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
    select: listingCardSelect,
  });
}

export async function getSellerPublishedListingCount(sellerProfileId: string): Promise<number> {
  return prisma.listing.count({
    where: {
      seller_profile_id: sellerProfileId,
      status: ListingStatus.PUBLISHED,
    },
  });
}
