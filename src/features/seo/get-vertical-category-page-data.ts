import { ListingStatus, type ListingVertical } from "@prisma/client";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { getCategorySlugCandidates } from "@/features/seo/category-seo-slug";
import { getCitySlugCandidates } from "@/features/seo/city-slug";
import { prisma } from "@/shared/lib/prisma";

export const SEO_LANDING_PAGE_SIZE = 24;

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

export type SeoLandingCategory = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
};

export type SeoLandingCity = {
  id: string;
  name: string;
  slug: string;
};

export type VerticalCategoryLandingData = {
  category: SeoLandingCategory;
  city: SeoLandingCity | null;
  categoryIds: string[];
  listings: ListingCardData[];
  totalCount: number;
  page: number;
  pageSize: number;
};

async function collectCategorySubtreeIds(
  rootId: string,
  vertical: ListingVertical,
): Promise<string[]> {
  const categories = await prisma.category.findMany({
    where: { vertical, is_active: true },
    select: { id: true, parent_id: true },
  });

  const childrenByParent = new Map<string, string[]>();
  for (const category of categories) {
    if (!category.parent_id) {
      continue;
    }
    const siblings = childrenByParent.get(category.parent_id) ?? [];
    siblings.push(category.id);
    childrenByParent.set(category.parent_id, siblings);
  }

  const ids: string[] = [];
  const stack = [rootId];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }
    ids.push(current);
    const children = childrenByParent.get(current) ?? [];
    for (const childId of children) {
      stack.push(childId);
    }
  }

  return ids;
}

export async function findCategoryForVerticalSeo(
  vertical: ListingVertical,
  categorySlug: string,
): Promise<SeoLandingCategory | null> {
  const candidates = getCategorySlugCandidates(vertical, categorySlug);
  if (candidates.length === 0) {
    return null;
  }

  return prisma.category.findFirst({
    where: {
      vertical,
      is_active: true,
      slug: { in: candidates },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      vertical: true,
    },
  });
}

export async function findCityForSeoSlug(
  citySlug: string,
): Promise<SeoLandingCity | null> {
  const candidates = getCitySlugCandidates(citySlug);
  if (candidates.length === 0) {
    return null;
  }

  return prisma.city.findFirst({
    where: {
      is_active: true,
      slug: { in: candidates },
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}

export async function getVerticalCategoryLandingData(options: {
  vertical: ListingVertical;
  categorySlug: string;
  citySlug?: string;
  page?: number;
}): Promise<VerticalCategoryLandingData | null> {
  const category = await findCategoryForVerticalSeo(
    options.vertical,
    options.categorySlug,
  );

  if (!category) {
    return null;
  }

  let city: SeoLandingCity | null = null;
  if (options.citySlug) {
    city = await findCityForSeoSlug(options.citySlug);
    if (!city) {
      return null;
    }
  }

  const categoryIds = await collectCategorySubtreeIds(category.id, options.vertical);
  const page = options.page && options.page > 0 ? options.page : 1;
  const skip = (page - 1) * SEO_LANDING_PAGE_SIZE;

  const where = {
    status: ListingStatus.PUBLISHED,
    vertical: options.vertical,
    category_id: { in: categoryIds },
    ...(city ? { city_id: city.id } : {}),
  };

  const [listings, totalCount] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
      skip,
      take: SEO_LANDING_PAGE_SIZE,
      select: listingCardSelect,
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    category,
    city,
    categoryIds,
    listings,
    totalCount,
    page,
    pageSize: SEO_LANDING_PAGE_SIZE,
  };
}
