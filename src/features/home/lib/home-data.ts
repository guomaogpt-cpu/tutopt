import { ListingStatus } from "@prisma/client";
import {
  getDescendantIds,
} from "@/features/listings/lib/category-search";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import type { CategoryItem } from "@/features/listings/types/category";
import { prisma } from "@/shared/lib/prisma";

export const HOME_CATEGORIES_LIMIT = 12;
export const HOME_LISTINGS_LIMIT = 8;

const listingCardSelect = {
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

export type HomeCategoryCard = {
  id: string;
  name: string;
  slug: string;
  listingsCount: number;
};

export type HomePageData = {
  categories: HomeCategoryCard[];
  listings: ListingCardData[];
};

function countPublishedInTree(
  categoryIds: Set<string>,
  countByCategory: Map<string, number>,
): number {
  let total = 0;

  for (const categoryId of categoryIds) {
    total += countByCategory.get(categoryId) ?? 0;
  }

  return total;
}

export async function getHomePageData(): Promise<HomePageData> {
  const [allCategories, listings, publishedByCategory] = await Promise.all([
    prisma.category.findMany({
      where: { is_active: true },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        parent_id: true,
        sort_order: true,
      },
    }),
    prisma.listing.findMany({
      where: { status: ListingStatus.PUBLISHED },
      orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
      take: HOME_LISTINGS_LIMIT,
      select: listingCardSelect,
    }),
    prisma.listing.groupBy({
      by: ["category_id"],
      where: { status: ListingStatus.PUBLISHED },
      _count: { _all: true },
    }),
  ]);

  const countByCategory = new Map(
    publishedByCategory.map((item) => [item.category_id, item._count._all]),
  );

  const categoryItems: CategoryItem[] = allCategories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    parent_id: category.parent_id,
    icon: category.icon,
  }));

  const rootCategories = allCategories
    .filter((category) => category.parent_id === null)
    .slice(0, HOME_CATEGORIES_LIMIT);

  const categories: HomeCategoryCard[] = rootCategories.map((root) => {
    const treeIds = getDescendantIds(categoryItems, root.id);

    return {
      id: root.id,
      name: root.name,
      slug: root.slug,
      listingsCount: countPublishedInTree(treeIds, countByCategory),
    };
  });

  return { categories, listings };
}
