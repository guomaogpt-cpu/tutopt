import { ListingCard } from "@/components/listings/ListingCard";
import { ListingsCatalogToolbar } from "@/components/listings/ListingsCatalogToolbar";
import { ListingsEmptyState } from "@/components/listings/ListingsEmptyState";
import { ListingsPagination } from "@/components/listings/ListingsPagination";
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
import { prisma } from "@/shared/lib/prisma";
import { Container } from "@/components/ui/container";

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
      where: { is_active: true },
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

  const hasFilters = hasActiveCatalogFilters(filters);
  const headerUser = user ? { id: user.id, name: user.name, role: user.role } : null;
  const createListingHref = getCreateListingHref(headerUser);
  const showCreateListingCTA = shouldShowCreateListingCTA(headerUser);

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container size="lg" className="min-w-0">
        <header className="mb-5 sm:mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            Оптовые объявления
          </h1>
          <p className="mt-1.5 text-sm text-[#64748B] sm:text-base">
            Оптовые предложения от поставщиков Кыргызстана
          </p>
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
            createListingHref={createListingHref}
            showCreateListingCTA={showCreateListingCTA}
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
