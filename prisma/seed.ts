import { PrismaClient } from "@prisma/client";
import { CATEGORIES } from "./seed-data/categories";
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
  await seedCategories(CATEGORIES);
  await seedBrands();

  const categoryCount = await prisma.category.count();
  const cityCount = await prisma.city.count();
  const brandCount = await prisma.brand.count();
  console.log(`✓ Categories total: ${categoryCount}`);
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
