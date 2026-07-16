import { ListingVertical, PrismaClient } from "@prisma/client";
import {
  CARGO_CATEGORIES,
  CATEGORIES,
  MARKET_CATEGORIES,
  OPT_EXTRA_CATEGORIES,
  SERVICES_CATEGORIES,
} from "./seed-data/categories";
import { REGIONS } from "./seed-data/regions";
import { CITIES, getRegionMap, seedBrands, seedCategories, seedCities } from "./seed-utils";

const prisma = new PrismaClient();

async function seedRegions(): Promise<void> {
  for (const region of REGIONS) {
    await prisma.region.upsert({
      where: { slug: region.slug },
      update: {
        name: region.name,
        sort_order: region.sort_order,
      },
      create: {
        name: region.name,
        slug: region.slug,
        sort_order: region.sort_order,
      },
    });
  }
  console.log(`✓ Regions seeded: ${REGIONS.length}`);
}

async function main(): Promise<void> {
  console.log("🌱 Seeding Tutopt database (base)...");

  await seedRegions();
  const regionMap = await getRegionMap();
  await seedCities(CITIES, regionMap);

  // Existing OPT tree (ids/slugs preserved via upsert by slug)
  await seedCategories(CATEGORIES, null, ListingVertical.OPT);
  await seedCategories(OPT_EXTRA_CATEGORIES, null, ListingVertical.OPT);
  await seedCategories(MARKET_CATEGORIES, null, ListingVertical.MARKET);
  await seedCategories(SERVICES_CATEGORIES, null, ListingVertical.SERVICES);
  await seedCategories(CARGO_CATEGORIES, null, ListingVertical.CARGO);

  await seedBrands();

  const [categoryCount, cityCount, brandCount, byVertical] = await Promise.all([
    prisma.category.count(),
    prisma.city.count(),
    prisma.brand.count(),
    prisma.category.groupBy({
      by: ["vertical"],
      _count: { _all: true },
    }),
  ]);

  console.log(`✓ Categories total: ${categoryCount}`);
  for (const row of byVertical) {
    console.log(`  - ${row.vertical}: ${row._count._all}`);
  }
  console.log(`✓ Cities total: ${cityCount}`);
  console.log(`✓ Brands total: ${brandCount}`);
  console.log("✅ Base seed completed.");
  console.log("ℹ️  To create the first admin, run: npm run admin:create");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
