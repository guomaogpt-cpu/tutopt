import { ListingStatus, type ListingVertical } from "@prisma/client";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import {
  listingCardSelect,
  serializeListingCards,
} from "@/features/listings/lib/serialize-listing-card";
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
      description: true,
      logo_url: true,
      is_verified: true,
      contact_phone: true,
      whatsapp: true,
      telegram: true,
      created_at: true,
      city: { select: { name: true } },
      user: {
        select: {
          name: true,
          avatar_url: true,
          phone: true,
          phone_verified_at: true,
          created_at: true,
        },
      },
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

const similarListingSelect = listingCardSelect;

export async function getSimilarListings(
  listingId: string,
  categoryId: string,
): Promise<ListingCardData[]> {
  const listings = await prisma.listing.findMany({
    where: {
      id: { not: listingId },
      category_id: categoryId,
      status: ListingStatus.PUBLISHED,
    },
    orderBy: { published_at: "desc" },
    take: 4,
    select: similarListingSelect,
  });

  return serializeListingCards(listings);
}

export async function getSellerPublishedListingCount(sellerProfileId: string): Promise<number> {
  return prisma.listing.count({
    where: {
      seller_profile_id: sellerProfileId,
      status: ListingStatus.PUBLISHED,
    },
  });
}

export async function getSellerPublishedVerticals(
  sellerProfileId: string,
): Promise<ListingVertical[]> {
  const rows = await prisma.listing.findMany({
    where: {
      seller_profile_id: sellerProfileId,
      status: ListingStatus.PUBLISHED,
    },
    distinct: ["vertical"],
    select: { vertical: true },
  });

  return rows.map((row) => row.vertical);
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
