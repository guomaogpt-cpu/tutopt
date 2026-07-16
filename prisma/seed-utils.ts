import {
  ListingVertical,
  PrismaClient,
  type Brand,
  type Category,
  type City,
} from "@prisma/client";
import type { CategorySeed } from "./seed-data/categories";
import { BRANDS } from "./seed-data/brands";
import { CITIES, type CitySeed } from "./seed-data/regions";

export const prisma = new PrismaClient();

export function generateShortId(): string {
  return Math.random().toString(36).slice(2, 10).padEnd(8, "0").slice(0, 8);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 200);
}

export async function seedCategories(
  categories: CategorySeed[],
  parentId: string | null = null,
  inheritedVertical: ListingVertical = ListingVertical.OPT,
): Promise<void> {
  for (const category of categories) {
    const vertical = category.vertical ?? inheritedVertical;

    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        icon: category.icon ?? null,
        sort_order: category.sort_order,
        parent_id: parentId,
        is_active: true,
        vertical,
      },
      create: {
        name: category.name,
        slug: category.slug,
        icon: category.icon ?? null,
        sort_order: category.sort_order,
        parent_id: parentId,
        is_active: true,
        vertical,
      },
    });

    if (category.children?.length) {
      await seedCategories(category.children, created.id, vertical);
    }
  }
}

export type RegionMap = Record<string, string>;
export type CityMap = Record<string, string>;
export type BrandMap = Record<string, string>;

export async function getRegionMap(): Promise<RegionMap> {
  const regions = await prisma.region.findMany();
  return Object.fromEntries(regions.map((r) => [r.slug, r.id]));
}

export async function seedCities(cities: CitySeed[], regionMap: RegionMap): Promise<void> {
  for (const city of cities) {
    const regionId = regionMap[city.regionSlug];
    if (!regionId) {
      throw new Error(`Region not found for city ${city.slug}: ${city.regionSlug}`);
    }

    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {
        name: city.name,
        region_id: regionId,
        sort_order: city.sort_order,
        is_active: true,
      },
      create: {
        name: city.name,
        slug: city.slug,
        region_id: regionId,
        sort_order: city.sort_order,
        is_active: true,
      },
    });
  }
}

export async function getCityMap(): Promise<CityMap> {
  const cities = await prisma.city.findMany();
  return Object.fromEntries(cities.map((c) => [c.slug, c.id]));
}

export async function seedBrands(): Promise<void> {
  for (const brand of BRANDS) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {
        name: brand.name,
        is_active: true,
      },
      create: {
        name: brand.name,
        slug: brand.slug,
        is_active: true,
      },
    });
  }
}

export async function getBrandMap(): Promise<BrandMap> {
  const brands = await prisma.brand.findMany();
  return Object.fromEntries(brands.map((b) => [b.slug, b.id]));
}

export async function getLeafCategories(): Promise<Category[]> {
  const all = await prisma.category.findMany({ where: { is_active: true } });
  const parentIds = new Set(all.filter((c) => c.parent_id).map((c) => c.parent_id as string));
  return all.filter((c) => !parentIds.has(c.id));
}

export async function getCities(): Promise<City[]> {
  return prisma.city.findMany({ where: { is_active: true } });
}

export async function getBrands(): Promise<Brand[]> {
  return prisma.brand.findMany({ where: { is_active: true } });
}

// Re-export city seeds for convenience in seed.ts
export { CITIES };
