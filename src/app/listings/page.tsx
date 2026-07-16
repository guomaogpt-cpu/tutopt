import type { Metadata } from "next";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingsCatalogToolbar } from "@/components/listings/ListingsCatalogToolbar";
import { ListingsEmptyState } from "@/components/listings/ListingsEmptyState";
import { ListingsPagination } from "@/components/listings/ListingsPagination";
import { AppBreadcrumbs } from "@/components/navigation/Breadcrumbs";
import {
  LISTINGS_PER_PAGE,
  buildListingsCatalogOrderBy,
  buildListingsCatalogWhere,
  hasActiveCatalogFilters,
  parseListingsCatalogParams,
} from "@/features/listings/lib/listings-catalog";
import { getCurrentUser } from "@/features/auth/lib/session";
import {
  getCreateListingHref,
  shouldShowCreateListingCTA,
} from "@/features/auth/lib/login-redirect";
import { getUserFavoriteListingIds } from "@/features/favorites/lib/favorites-data";
import { VERTICALS } from "@/features/verticals/verticals";
import { getCatalogVerticalCopy } from "@/features/listings/lib/listing-display";
import { prisma } from "@/shared/lib/prisma";
import { Container } from "@/components/ui/container";
import {
  SITE_NAME,
  VERTICAL_CATALOG_SEO,
  buildPageMetadata,
} from "@/shared/seo/seo.config";

type ListingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

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
};

export async function generateMetadata({
  searchParams,
}: ListingsPageProps): Promise<Metadata> {
  const rawParams = await searchParams;
  const filters = parseListingsCatalogParams(rawParams);

  if (filters.q) {
    return buildPageMetadata({
      title: `Поиск: ${filters.q} — объявления Кыргызстана | ${SITE_NAME}`,
      description: `Результаты поиска «${filters.q}» на Tutopt — объявления Кыргызстана.`,
      path: "/listings",
    });
  }

  if (filters.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: filters.categoryId },
      select: { name: true },
    });

    if (category) {
      return buildPageMetadata({
        title: `${category.name} — объявления Кыргызстана | ${SITE_NAME}`,
        description: `${category.name}: объявления на Tutopt в Кыргызстане.`,
        path: filters.vertical
          ? `/listings?vertical=${filters.vertical}`
          : "/listings",
      });
    }
  }

  if (filters.vertical) {
    const seo = VERTICAL_CATALOG_SEO[filters.vertical];
    return buildPageMetadata({
      title: seo.title,
      description: seo.description,
      path: `/listings?vertical=${filters.vertical}`,
    });
  }

  return buildPageMetadata({
    title: "Объявления Кыргызстана | Tutopt",
    description:
      "Каталог объявлений Tutopt: опт, розница, услуги и грузоперевозки в Кыргызстане.",
    path: "/listings",
  });
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const rawParams = await searchParams;
  const filters = parseListingsCatalogParams(rawParams);
  const where = buildListingsCatalogWhere(filters);
  const orderBy = buildListingsCatalogOrderBy(filters.sort);
  const skip = (filters.page - 1) * LISTINGS_PER_PAGE;
  const user = await getCurrentUser();
  const favoriteListingIds = user ? await getUserFavoriteListingIds(user.id) : [];
  const favoriteIds = new Set(favoriteListingIds);

  const [listings, totalCount, categories, cities, brands] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip,
      take: LISTINGS_PER_PAGE,
      select: listingCardSelect,
    }),
    prisma.listing.count({ where }),
    prisma.category.findMany({
      where: {
        is_active: true,
        ...(filters.vertical ? { vertical: filters.vertical } : {}),
      },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
    prisma.city.findMany({
      where: { is_active: true },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
    prisma.brand.findMany({
      where: { is_active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const categoryOptions = categories.map((item) => ({ id: item.id, label: item.name }));
  const cityOptions = cities.map((item) => ({ id: item.id, label: item.name }));
  const brandOptions = brands.map((item) => ({ id: item.id, label: item.name }));

  const lookups = {
    categories: Object.fromEntries(categoryOptions.map((item) => [item.id, item.label])),
    cities: Object.fromEntries(cityOptions.map((item) => [item.id, item.label])),
    brands: Object.fromEntries(brandOptions.map((item) => [item.id, item.label])),
  };

  const hasFilters = hasActiveCatalogFilters(filters) || Boolean(filters.vertical);
  const headerUser = user ? { id: user.id, name: user.name, role: user.role } : null;
  const createListingHref = getCreateListingHref(headerUser);
  const showCreateListingCTA = shouldShowCreateListingCTA(headerUser);
  const activeVertical = filters.vertical ? VERTICALS[filters.vertical] : null;
  const catalogCopy = getCatalogVerticalCopy(filters.vertical);
  const pageTitle = catalogCopy.title;
  const pageSubtitle = catalogCopy.description;

  const breadcrumbItems = activeVertical
    ? [
        { label: "Главная", href: "/" },
        { label: activeVertical.label, href: activeVertical.href },
        { label: "Объявления" },
      ]
    : [
        { label: "Главная", href: "/" },
        { label: "Объявления" },
      ];

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container size="lg" className="min-w-0">
        <AppBreadcrumbs className="mb-4" items={breadcrumbItems} />

        <header className="mb-5 sm:mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            {pageTitle}
          </h1>
          <p className="mt-1.5 text-sm text-[#64748B] sm:text-base">{pageSubtitle}</p>
        </header>

        <ListingsCatalogToolbar
          filters={filters}
          categories={categoryOptions}
          cities={cityOptions}
          brands={brandOptions}
          lookups={lookups}
          totalCount={totalCount}
        />

        {listings.length === 0 ? (
          <ListingsEmptyState
            hasActiveFilters={hasFilters}
            createListingHref={
              filters.vertical
                ? VERTICALS[filters.vertical].createListingHref
                : createListingHref
            }
            showCreateListingCTA={showCreateListingCTA}
            vertical={filters.vertical}
          />
        ) : (
          <>
            <div className="mt-5 grid w-full min-w-0 grid-cols-2 gap-3 max-[339px]:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {listings.map((listing) => (
                <div key={listing.id} className="min-w-0 w-full">
                  <ListingCard
                    listing={listing}
                    isAuthenticated={user !== null}
                    isFavorited={favoriteIds.has(listing.id)}
                    variant="catalog"
                  />
                </div>
              ))}
            </div>

            <ListingsPagination filters={filters} totalCount={totalCount} />
          </>
        )}
      </Container>
    </main>
  );
}
