import { ListingStatus, type ListingVertical } from "@prisma/client";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { prisma } from "@/shared/lib/prisma";

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
} as const;

export type VerticalCategoryCard = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
};

export type VerticalPageData = {
  categories: VerticalCategoryCard[];
  listings: ListingCardData[];
  publishedCount: number;
};

export async function getVerticalPageData(
  verticalId: ListingVertical,
): Promise<VerticalPageData> {
  const [categories, listings, publishedCount] = await Promise.all([
    prisma.category.findMany({
      where: {
        is_active: true,
        vertical: verticalId,
        parent_id: null,
      },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      take: 12,
      select: { id: true, name: true, slug: true, vertical: true },
    }),
    prisma.listing.findMany({
      where: {
        status: ListingStatus.PUBLISHED,
        vertical: verticalId,
      },
      orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
      take: 8,
      select: listingCardSelect,
    }),
    prisma.listing.count({
      where: {
        status: ListingStatus.PUBLISHED,
        vertical: verticalId,
      },
    }),
  ]);

  return { categories, listings, publishedCount };
}
