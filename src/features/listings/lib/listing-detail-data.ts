import { ListingStatus } from "@prisma/client";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { prisma } from "@/shared/lib/prisma";

export const listingDetailSelect = {
  id: true,
  title: true,
  short_id: true,
  description: true,
  price: true,
  currency: true,
  unit: true,
  moq: true,
  stock_quantity: true,
  status: true,
  vertical: true,
  view_count: true,
  published_at: true,
  created_at: true,
  category_id: true,
  category: { select: { name: true, slug: true } },
  city: { select: { name: true } },
  brand: { select: { name: true } },
  images: {
    orderBy: { sort_order: "asc" as const },
    select: { id: true, url: true },
  },
  attributes: {
    select: { key: true, value: true },
  },
  sellerProfile: {
    select: {
      id: true,
      user_id: true,
      company_name: true,
      slug: true,
      logo_url: true,
      is_verified: true,
      contact_phone: true,
      whatsapp: true,
      telegram: true,
      created_at: true,
      city: { select: { name: true } },
      user: { select: { name: true, avatar_url: true } },
    },
  },
} as const;

export type ListingDetailData = Awaited<ReturnType<typeof getListingDetail>>;

export async function getListingDetail(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    select: listingDetailSelect,
  });
}

const similarListingSelect = {
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

export async function getSimilarListings(
  listingId: string,
  categoryId: string,
): Promise<ListingCardData[]> {
  return prisma.listing.findMany({
    where: {
      id: { not: listingId },
      category_id: categoryId,
      status: ListingStatus.PUBLISHED,
    },
    orderBy: { published_at: "desc" },
    take: 4,
    select: similarListingSelect,
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

export function getListingCondition(
  attributes: { key: string; value: string }[],
): string | null {
  const condition = attributes.find((attribute) => {
    const key = attribute.key.toLowerCase();
    return key === "condition" || key === "sostoyanie" || key === "состояние";
  });

  return condition?.value.trim() || null;
}
