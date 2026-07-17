import { ListingStatus, ListingVertical } from "@prisma/client";
import { buildNotExpiredListingFilter } from "@/lib/listings/listing-expiration";
import { getDescendantIds } from "@/features/listings/lib/category-search";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import {
  listingCardSelect,
  serializeListingCards,
} from "@/features/listings/lib/serialize-listing-card";
import type { CategoryItem } from "@/features/listings/types/category";
import { prisma } from "@/shared/lib/prisma";

export const HOME_CATEGORIES_LIMIT = 10;
export const HOME_LISTINGS_PRIMARY_LIMIT = 12;
export const HOME_LISTINGS_SECONDARY_LIMIT = 8;

export type HomeCategoryCard = {
  id: string;
  name: string;
  slug: string;
  listingsCount: number;
};

export type HomePageStats = {
  listingsCount: number;
  sellersCount: number;
  leadsCount: number;
};

export type HomePageData = {
  categories: HomeCategoryCard[];
  listings: ListingCardData[];
  moreListings: ListingCardData[];
  stats: HomePageStats;
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
  const totalListingsNeeded = HOME_LISTINGS_PRIMARY_LIMIT + HOME_LISTINGS_SECONDARY_LIMIT;
  const notExpired = buildNotExpiredListingFilter();

  const [
    allCategories,
    listings,
    publishedByCategory,
    listingsCount,
    sellersCount,
    leadsCount,
  ] = await Promise.all([
    prisma.category.findMany({
      where: { is_active: true, vertical: ListingVertical.OPT },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        parent_id: true,
        sort_order: true,
        vertical: true,
      },
    }),
    prisma.listing.findMany({
      where: {
        status: ListingStatus.PUBLISHED,
        vertical: ListingVertical.OPT,
        AND: [notExpired],
      },
      orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
      take: totalListingsNeeded,
      select: listingCardSelect,
    }),
    prisma.listing.groupBy({
      by: ["category_id"],
      where: {
        status: ListingStatus.PUBLISHED,
        vertical: ListingVertical.OPT,
        AND: [notExpired],
      },
      _count: { _all: true },
    }),
    prisma.listing.count({
      where: {
        status: ListingStatus.PUBLISHED,
        vertical: ListingVertical.OPT,
        AND: [notExpired],
      },
    }),
    prisma.sellerProfile.count({
      where: {
        listings: {
          some: { status: ListingStatus.PUBLISHED, AND: [notExpired] },
        },
      },
    }),
    prisma.lead.count(),
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

  const primaryListings = serializeListingCards(
    listings.slice(0, HOME_LISTINGS_PRIMARY_LIMIT),
  );
  const moreListings =
    listings.length > HOME_LISTINGS_PRIMARY_LIMIT
      ? serializeListingCards(
          listings.slice(
            HOME_LISTINGS_PRIMARY_LIMIT,
            HOME_LISTINGS_PRIMARY_LIMIT + HOME_LISTINGS_SECONDARY_LIMIT,
          ),
        )
      : [];

  return {
    categories,
    listings: primaryListings,
    moreListings,
    stats: {
      listingsCount,
      sellersCount,
      leadsCount,
    },
  };
}
