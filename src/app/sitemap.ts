import type { MetadataRoute } from "next";
import { ListingStatus } from "@prisma/client";
import { getCategorySeoSlug } from "@/features/seo/category-seo-slug";
import { getCitySeoSlug } from "@/features/seo/city-slug";
import { VERTICAL_LIST, VERTICALS } from "@/features/verticals/verticals";
import { getAbsoluteUrl } from "@/shared/seo/absolute-url";
import { prisma } from "@/shared/lib/prisma";

function collectAncestorIds(
  categoryId: string,
  parentById: Map<string, string | null>,
): string[] {
  const ids: string[] = [];
  let current: string | null | undefined = categoryId;

  while (current) {
    ids.push(current);
    current = parentById.get(current) ?? null;
  }

  return ids;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: getAbsoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...VERTICAL_LIST.map((vertical) => ({
      url: getAbsoluteUrl(vertical.href),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    {
      url: getAbsoluteUrl("/listings"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl("/sellers"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: getAbsoluteUrl("/categories"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const [categories, publishedCombos, listings] = await Promise.all([
    prisma.category.findMany({
      where: { is_active: true },
      select: {
        id: true,
        slug: true,
        vertical: true,
        parent_id: true,
        updated_at: true,
      },
    }),
    prisma.listing.findMany({
      where: {
        status: ListingStatus.PUBLISHED,
        city_id: { not: null },
      },
      select: {
        category_id: true,
        city_id: true,
        updated_at: true,
      },
      distinct: ["category_id", "city_id"],
    }),
    prisma.listing.findMany({
      where: { status: ListingStatus.PUBLISHED },
      select: {
        id: true,
        updated_at: true,
        published_at: true,
        created_at: true,
      },
      orderBy: { updated_at: "desc" },
      take: 5000,
    }),
  ]);

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => {
    const vertical = VERTICALS[category.vertical];
    const path = `/${vertical.slug}/${getCategorySeoSlug(category)}`;

    return {
      url: getAbsoluteUrl(path),
      lastModified: category.updated_at ?? now,
      changeFrequency: "daily" as const,
      priority: 0.75,
    };
  });

  const cityIds = [
    ...new Set(
      publishedCombos
        .map((item) => item.city_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const cities =
    cityIds.length > 0
      ? await prisma.city.findMany({
          where: { id: { in: cityIds }, is_active: true },
          select: { id: true, slug: true },
        })
      : [];

  const cityById = new Map(cities.map((city) => [city.id, city]));
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const parentById = new Map(
    categories.map((category) => [category.id, category.parent_id] as const),
  );

  const categoryCityEntries: MetadataRoute.Sitemap = [];
  const seenCombo = new Set<string>();

  for (const combo of publishedCombos) {
    if (!combo.city_id) {
      continue;
    }

    const city = cityById.get(combo.city_id);
    if (!city) {
      continue;
    }

    const ancestorIds = collectAncestorIds(combo.category_id, parentById);

    for (const ancestorId of ancestorIds) {
      const category = categoryById.get(ancestorId);
      if (!category) {
        continue;
      }

      const vertical = VERTICALS[category.vertical];
      const path = `/${vertical.slug}/${getCategorySeoSlug(category)}/${getCitySeoSlug(city)}`;
      if (seenCombo.has(path)) {
        continue;
      }
      seenCombo.add(path);

      categoryCityEntries.push({
        url: getAbsoluteUrl(path),
        lastModified: combo.updated_at ?? now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  const listingEntries: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: getAbsoluteUrl(`/listings/${listing.id}`),
    lastModified: listing.updated_at ?? listing.published_at ?? listing.created_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...categoryCityEntries,
    ...listingEntries,
  ];
}
