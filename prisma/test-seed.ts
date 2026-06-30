import bcrypt from "bcryptjs";
import { ListingStatus, ListingUnit, PrismaClient, UserRole } from "@prisma/client";
import {
  generateShortId,
  getBrandMap,
  getCityMap,
  getLeafCategories,
  getRegionMap,
} from "./seed-utils";

const prisma = new PrismaClient();

const TEST_SELLER_PASSWORD = "Seller123!";

const SELLERS = [
  {
    email: "seller1@tutopt.kg",
    name: "Азамат Кыдыров",
    company_name: "ОсОО «Чуй Трейд»",
    slug: "chuy-trade",
    regionSlug: "bishkek",
    citySlug: "bishkek-city",
    contact_phone: "+996700111001",
    whatsapp: "+996700111001",
    telegram: "chuytrade",
    website: "https://chuytrade.kg",
    inn: "12345678901234",
    description: "Оптовые поставки продуктов питания по Бишкеку и области.",
  },
  {
    email: "seller2@tutopt.kg",
    name: "Гульнара Асанова",
    company_name: "ИП «Асанова Г.К.»",
    slug: "asanova-gk",
    regionSlug: "osh",
    citySlug: "osh-city",
    contact_phone: "+996700111002",
    whatsapp: "+996700111002",
    telegram: "asanovagk",
    website: null,
    inn: "23456789012345",
    description: "Одежда и текстиль оптом. Склад в Оше.",
  },
  {
    email: "seller3@tutopt.kg",
    name: "Нурбек Токтогулов",
    company_name: "ОсОО «СтройОпт КР»",
    slug: "stroyopt-kr",
    regionSlug: "chuy",
    citySlug: "tokmok",
    contact_phone: "+996700111003",
    whatsapp: "+996700111003",
    telegram: "stroyoptkr",
    website: "https://stroyopt.kg",
    inn: "34567890123456",
    description: "Строительные материалы и металлопрокат оптом.",
  },
] as const;

const LISTING_TEMPLATES: Array<{
  title: string;
  unit: ListingUnit;
  price: number;
  moq: number;
  brandSlug?: string;
}> = [
  {
    title: "Молоко пастеризованное 3.2% оптом",
    unit: ListingUnit.LITER,
    price: 65,
    moq: 100,
    brandSlug: "nestle",
  },
  {
    title: "Сыр Голландский 45% оптом",
    unit: ListingUnit.KG,
    price: 520,
    moq: 20,
    brandSlug: "kulikovskiy",
  },
  { title: "Говядина охлаждённая оптом", unit: ListingUnit.KG, price: 480, moq: 50 },
  {
    title: "Крупа рис басмати 25 кг",
    unit: ListingUnit.PACK,
    price: 2800,
    moq: 10,
    brandSlug: "lenta",
  },
  {
    title: "Минеральная вода 0.5л оптом",
    unit: ListingUnit.PACK,
    price: 180,
    moq: 50,
    brandSlug: "shoro",
  },
  { title: "Мужские рубашки оптом", unit: ListingUnit.PIECE, price: 450, moq: 30 },
  { title: "Женские платья летние оптом", unit: ListingUnit.PIECE, price: 890, moq: 20 },
  { title: "Постельное бельё комплект оптом", unit: ListingUnit.PIECE, price: 1200, moq: 15 },
  {
    title: "Цемент М500 50 кг оптом",
    unit: ListingUnit.PIECE,
    price: 420,
    moq: 100,
    brandSlug: "ak-tilek",
  },
  { title: "Кирпич красный оптом", unit: ListingUnit.PIECE, price: 18, moq: 1000 },
  { title: "Арматура А500 12мм оптом", unit: ListingUnit.PIECE, price: 650, moq: 200 },
  { title: "Краска водоэмульсионная 15л", unit: ListingUnit.PIECE, price: 1850, moq: 10 },
  {
    title: "Смартфоны Android оптом",
    unit: ListingUnit.PIECE,
    price: 8500,
    moq: 10,
    brandSlug: "xiaomi",
  },
  {
    title: 'Ноутбуки 15.6" оптом',
    unit: ListingUnit.PIECE,
    price: 42000,
    moq: 5,
    brandSlug: "samsung",
  },
  {
    title: "Холодильники двухкамерные оптом",
    unit: ListingUnit.PIECE,
    price: 28000,
    moq: 3,
    brandSlug: "samsung",
  },
  { title: "Моторное масло 5W-30 оптом", unit: ListingUnit.LITER, price: 520, moq: 24 },
  { title: "Летние шины R16 оптом", unit: ListingUnit.PIECE, price: 6500, moq: 8 },
  {
    title: "Средство для стирки 5л",
    unit: ListingUnit.PIECE,
    price: 380,
    moq: 24,
    brandSlug: "aidar",
  },
  { title: "Офисные стулья оптом", unit: ListingUnit.PIECE, price: 3200, moq: 10 },
  {
    title: "Газированный напиток 1л оптом",
    unit: ListingUnit.PACK,
    price: 95,
    moq: 48,
    brandSlug: "coca-cola",
  },
];

const CITY_BY_LISTING_INDEX = [
  "bishkek-city",
  "bishkek-city",
  "osh-city",
  "bishkek-city",
  "karakol",
  "osh-city",
  "bishkek-city",
  "tokmok",
  "bishkek-city",
  "tokmok",
  "bishkek-city",
  "jalal-abad-city",
  "bishkek-city",
  "osh-city",
  "bishkek-city",
  "osh-city",
  "bishkek-city",
  "karakol",
  "bishkek-city",
  "bishkek-city",
] as const;

async function ensureBaseSeed(): Promise<void> {
  const regionCount = await prisma.region.count();
  const cityCount = await prisma.city.count();
  const brandCount = await prisma.brand.count();
  if (regionCount === 0 || cityCount === 0 || brandCount === 0) {
    throw new Error("Base seed required. Run `npm run db:seed` before test seed.");
  }
}

async function seedTestSellers(): Promise<string[]> {
  const regionMap = await getRegionMap();
  const cityMap = await getCityMap();
  const password_hash = await bcrypt.hash(TEST_SELLER_PASSWORD, 12);
  const sellerProfileIds: string[] = [];

  for (const seller of SELLERS) {
    const regionId = regionMap[seller.regionSlug];
    const cityId = cityMap[seller.citySlug];
    if (!regionId) {
      throw new Error(`Region not found: ${seller.regionSlug}`);
    }
    if (!cityId) {
      throw new Error(`City not found: ${seller.citySlug}`);
    }

    const user = await prisma.user.upsert({
      where: { email: seller.email },
      update: {
        name: seller.name,
        role: UserRole.SELLER,
        password_hash,
        region_id: regionId,
        email_verified_at: new Date(),
        phone: seller.contact_phone,
        phone_verified_at: new Date(),
      },
      create: {
        email: seller.email,
        name: seller.name,
        role: UserRole.SELLER,
        password_hash,
        region_id: regionId,
        email_verified_at: new Date(),
        phone: seller.contact_phone,
        phone_verified_at: new Date(),
      },
    });

    const profile = await prisma.sellerProfile.upsert({
      where: { user_id: user.id },
      update: {
        company_name: seller.company_name,
        slug: seller.slug,
        description: seller.description,
        contact_phone: seller.contact_phone,
        whatsapp: seller.whatsapp,
        telegram: seller.telegram,
        website: seller.website,
        region_id: regionId,
        city_id: cityId,
        inn: seller.inn,
        is_verified: true,
        verified_at: new Date(),
      },
      create: {
        user_id: user.id,
        company_name: seller.company_name,
        slug: seller.slug,
        description: seller.description,
        contact_phone: seller.contact_phone,
        whatsapp: seller.whatsapp,
        telegram: seller.telegram,
        website: seller.website,
        region_id: regionId,
        city_id: cityId,
        inn: seller.inn,
        is_verified: true,
        verified_at: new Date(),
      },
    });

    sellerProfileIds.push(profile.id);
  }

  console.log(`✓ Test sellers seeded: ${SELLERS.length}`);
  return sellerProfileIds;
}

async function seedTestListings(sellerProfileIds: string[]): Promise<void> {
  const leafCategories = await getLeafCategories();
  const regionMap = await getRegionMap();
  const cityMap = await getCityMap();
  const brandMap = await getBrandMap();

  if (leafCategories.length === 0) {
    throw new Error("No leaf categories found. Run base seed first.");
  }

  const bishkekId = regionMap["bishkek"];
  const now = new Date();

  for (let i = 0; i < LISTING_TEMPLATES.length; i++) {
    const template = LISTING_TEMPLATES[i];
    const sellerProfileId = sellerProfileIds[i % sellerProfileIds.length];
    const category = leafCategories[i % leafCategories.length];
    const regionId = i % 3 === 0 ? regionMap["osh"] : i % 3 === 1 ? regionMap["chuy"] : bishkekId;
    const citySlug = CITY_BY_LISTING_INDEX[i];
    const cityId = cityMap[citySlug];
    const brandId = template.brandSlug ? brandMap[template.brandSlug] : null;

    const slugBase = template.title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 200);
    const short_id = generateShortId();

    const existing = await prisma.listing.findFirst({
      where: {
        seller_profile_id: sellerProfileId,
        title: template.title,
      },
    });

    if (existing) {
      continue;
    }

    await prisma.listing.create({
      data: {
        seller_profile_id: sellerProfileId,
        category_id: category.id,
        region_id: regionId ?? bishkekId!,
        city_id: cityId ?? null,
        brand_id: brandId ?? null,
        title: template.title,
        slug: `${slugBase}-${short_id}`,
        short_id,
        description: `${template.title}. Оптовые поставки по Кыргызстану. Минимальный заказ: ${template.moq} ${template.unit.toLowerCase()}.`,
        price: template.price,
        unit: template.unit,
        moq: template.moq,
        stock_quantity: template.moq * 10,
        status: ListingStatus.PUBLISHED,
        published_at: now,
        expires_at: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        images: {
          create: [
            {
              url: `https://placehold.co/800x600/e2e8f0/334155?text=Listing+${i + 1}`,
              thumbnail_url: `https://placehold.co/400x300/e2e8f0/334155?text=Listing+${i + 1}`,
              sort_order: 0,
            },
          ],
        },
        attributes: {
          create: [
            { key: "Условия", value: "Опт" },
            { key: "Доставка", value: "По договорённости" },
          ],
        },
      },
    });

    await prisma.category.update({
      where: { id: category.id },
      data: { listings_count: { increment: 1 } },
    });
  }

  const listingCount = await prisma.listing.count();
  console.log(`✓ Test listings total in DB: ${listingCount}`);
}

async function main(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ Test seed is not allowed in production.");
    process.exit(1);
  }

  console.log("🧪 Seeding Tutopt test data (dev/staging)...");

  await ensureBaseSeed();
  const sellerProfileIds = await seedTestSellers();
  await seedTestListings(sellerProfileIds);

  console.log("✅ Test seed completed.");
}

main()
  .catch((error) => {
    console.error("❌ Test seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
