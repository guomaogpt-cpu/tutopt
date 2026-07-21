import { ListingStatus, type ListingVertical } from "@prisma/client";
import { buildNotExpiredListingFilter } from "@/lib/listings/listing-expiration";
import { getDescendantIds } from "@/features/listings/lib/category-search";
import type { CategoryItem } from "@/features/listings/types/category";
import { prisma } from "@/shared/lib/prisma";

export type CategoriesDirectoryItem = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
  listingsCount: number;
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

/**
 * Root active categories across all verticals, with published listing counts
 * (including descendants). One groupBy — no heavy per-category queries.
 */
export async function getCategoriesPageData(): Promise<CategoriesDirectoryItem[]> {
  const notExpired = buildNotExpiredListingFilter();

  const [allCategories, publishedByCategory] = await Promise.all([
    prisma.category.findMany({
      where: { is_active: true },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        parent_id: true,
        vertical: true,
        icon: true,
      },
    }),
    prisma.listing.groupBy({
      by: ["category_id"],
      where: {
        status: ListingStatus.PUBLISHED,
        AND: [notExpired],
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
    icon: category.icon,
    vertical: category.vertical,
  }));

  const rootCategories = allCategories.filter((category) => category.parent_id === null);

  return rootCategories.map((root) => {
    const treeIds = getDescendantIds(categoryItems, root.id);

    return {
      id: root.id,
      name: root.name,
      slug: root.slug,
      vertical: root.vertical,
      listingsCount: countPublishedInTree(treeIds, countByCategory),
    };
  });
}
