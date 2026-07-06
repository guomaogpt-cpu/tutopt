import { Container } from "@/components/layout/Container";
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
import { getCreateListingHref } from "@/features/auth/lib/login-redirect";
import { getUserFavoriteListingIds } from "@/features/favorites/lib/favorites-data";
import { prisma } from "@/shared/lib/prisma";

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

  return (
    <main className="bg-white py-6 sm:py-8">
      <Container>
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Каталог объявлений
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Оптовые предложения от поставщиков Кыргызстана
          </p>
        </div>

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
          />
        ) : (
          <>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isAuthenticated={user !== null}
                  isFavorited={favoriteIds.has(listing.id)}
                />
              ))}
            </div>

            <ListingsPagination filters={filters} totalCount={totalCount} />
          </>
        )}
      </Container>
    </main>
  );
}
