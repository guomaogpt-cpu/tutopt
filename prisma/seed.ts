import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";
import { CATEGORIES } from "./seed-data/categories";
import { REGIONS } from "./seed-data/regions";
import {
  CITIES,
  getRegionMap,
  seedBrands,
  seedCategories,
  seedCities,
} from "./seed-utils";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@tutopt.kg";
const ADMIN_PASSWORD = "Admin123!";

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

async function seedAdminUser(): Promise<void> {
  const bishkek = await prisma.region.findUnique({ where: { slug: "bishkek" } });
  const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: "Tutopt Admin",
      role: UserRole.ADMIN,
      password_hash,
      region_id: bishkek?.id ?? null,
      email_verified_at: new Date(),
      is_blocked: false,
    },
    create: {
      email: ADMIN_EMAIL,
      name: "Tutopt Admin",
      role: UserRole.ADMIN,
      password_hash,
      region_id: bishkek?.id ?? null,
      email_verified_at: new Date(),
    },
  });

  console.log(`✓ Admin user seeded: ${ADMIN_EMAIL}`);
}

async function main(): Promise<void> {
  console.log("🌱 Seeding Tutopt database (base)...");

  await seedRegions();
  const regionMap = await getRegionMap();
  await seedCities(CITIES, regionMap);
  await seedCategories(CATEGORIES);
  await seedBrands();
  await seedAdminUser();

  const categoryCount = await prisma.category.count();
  const cityCount = await prisma.city.count();
  const brandCount = await prisma.brand.count();
  console.log(`✓ Categories total: ${categoryCount}`);
  console.log(`✓ Cities total: ${cityCount}`);
  console.log(`✓ Brands total: ${brandCount}`);
  console.log("✅ Base seed completed.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
