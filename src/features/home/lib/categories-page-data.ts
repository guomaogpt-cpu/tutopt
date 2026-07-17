import { ListingStatus, ListingVertical } from "@prisma/client";
import { buildNotExpiredListingFilter } from "@/lib/listings/listing-expiration";
import { getDescendantIds } from "@/features/listings/lib/category-search";
import type { HomeCategoryCard } from "@/features/home/lib/home-data";
import type { CategoryItem } from "@/features/listings/types/category";
import { prisma } from "@/shared/lib/prisma";

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

export async function getCategoriesPageData(): Promise<HomeCategoryCard[]> {
  const [allCategories, publishedByCategory] = await Promise.all([
    prisma.category.findMany({
      where: { is_active: true, vertical: ListingVertical.OPT },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        parent_id: true,
        vertical: true,
      },
    }),
    prisma.listing.groupBy({
      by: ["category_id"],
      where: {
        status: ListingStatus.PUBLISHED,
        vertical: ListingVertical.OPT,
        AND: [buildNotExpiredListingFilter()],
      },
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
    icon: null,
    vertical: category.vertical,
  }));

  const rootCategories = allCategories.filter((category) => category.parent_id === null);

  return rootCategories.map((root) => {
    const treeIds = getDescendantIds(categoryItems, root.id);

    return {
      id: root.id,
      name: root.name,
      slug: root.slug,
      listingsCount: countPublishedInTree(treeIds, countByCategory),
    };
  });
}
