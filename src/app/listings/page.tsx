import type { Metadata } from "next";
import { ListingCard } from "@/components/listings/ListingCard";
import { LISTING_CARD_GRID_CLASS } from "@/components/listings/listing-card-grid";
import { ListingsCatalogToolbar } from "@/components/listings/ListingsCatalogToolbar";
import { ListingsEmptyState } from "@/components/listings/ListingsEmptyState";
import { ListingsPagination } from "@/components/listings/ListingsPagination";
import { PhotoSearchListingsNotice } from "@/components/listings/PhotoSearchListingsNotice";
import { AppBreadcrumbs } from "@/components/navigation/Breadcrumbs";
import {
  LISTINGS_PER_PAGE,
  buildListingsCatalogOrderBy,
  buildListingsCatalogWhere,
  hasActiveCatalogFilters,
  parseListingsCatalogParams,
} from "@/features/listings/lib/listings-catalog";
import {
  buildCatalogTextSearchWhere,
  isEquipmentLikeQuery,
  matchSynonymCategoryIds,
} from "@/features/listings/lib/catalog-search";
import { resolveCatalogCategoryFilter } from "@/features/listings/lib/resolve-catalog-filters";
import {
  listingCardSelect,
  serializeListingCards,
} from "@/features/listings/lib/serialize-listing-card";
import { getCurrentUser } from "@/features/auth/lib/session";
import {
  getCreateListingHref,
  shouldShowCreateListingCTA,
} from "@/features/auth/lib/login-redirect";
import { getUserFavoriteListingIds } from "@/features/favorites/lib/favorites-data";
import { getCatalogVerticalCopy } from "@/features/listings/lib/listing-display";
import { VERTICALS } from "@/features/verticals/verticals";
import { prisma } from "@/shared/lib/prisma";
import { Container } from "@/components/ui/container";
import { getVerticalTheme } from "@/lib/vertical-theme";
import { cn } from "@/lib/utils";
import {
  SITE_NAME,
  VERTICAL_CATALOG_SEO,
  buildPageMetadata,
} from "@/shared/seo/seo.config";

type ListingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: ListingsPageProps): Promise<Metadata> {
  try {
    const rawParams = await searchParams;
    const filters = parseListingsCatalogParams(rawParams);

    if (filters.q) {
      return buildPageMetadata({
        title: `Поиск: ${filters.q} — объявления | ${SITE_NAME}`,
        description: `Результаты поиска «${filters.q}» на ВсеТут — объявления в Кыргызстане.`,
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
          title: `${category.name} — объявления | ${SITE_NAME}`,
          description: `${category.name}: объявления на ВсеТут в Кыргызстане.`,
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
      title: "Объявления — ВсеТут",
      description:
        "Поиск объявлений, товаров, услуг и оптовых предложений в Кыргызстане.",
      path: "/listings",
    });
  } catch (error) {
    console.error("[listings/metadata] Failed to load catalog metadata", error);
    return buildPageMetadata({
      title: "Объявления — ВсеТут",
      description:
        "Поиск объявлений, товаров, услуг и оптовых предложений в Кыргызстане.",
      path: "/listings",
    });
  }
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const rawParams = await searchParams;
  const parsedFilters = parseListingsCatalogParams(rawParams);

  const categoriesRaw = await prisma.category.findMany({
    where: { is_active: true },
    orderBy: [{ sort_order: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      parent_id: true,
      vertical: true,
      sort_order: true,
    },
  });

  const categoryItems = categoriesRaw.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    parent_id: item.parent_id,
    vertical: item.vertical,
    sort_order: item.sort_order ?? undefined,
  }));

  const rawCategory =
    typeof rawParams.category === "string" ? rawParams.category.trim() : "";
  const rawSubcategory =
    typeof rawParams.subcategory === "string" ? rawParams.subcategory.trim() : "";

  const { filters, categoryIds } = resolveCatalogCategoryFilter(
    parsedFilters,
    categoryItems,
    rawCategory,
    rawSubcategory,
  );

  const synonymCategoryIds = filters.q
    ? matchSynonymCategoryIds(filters.q, categoryItems)
    : [];
  const textSearch = filters.q
    ? buildCatalogTextSearchWhere(filters.q, synonymCategoryIds)
    : undefined;

  const where = buildListingsCatalogWhere(filters, {
    categoryIds: categoryIds ?? undefined,
    textSearch,
  });
  const orderBy = buildListingsCatalogOrderBy(filters.sort);
  const skip = (filters.page - 1) * LISTINGS_PER_PAGE;
  const user = await getCurrentUser();
  const favoriteListingIds = user ? await getUserFavoriteListingIds(user.id) : [];
  const favoriteIds = new Set(favoriteListingIds);

  const [rawListings, totalCount, cities, brands] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip,
      take: LISTINGS_PER_PAGE,
      select: listingCardSelect,
    }),
    prisma.listing.count({ where }),
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

  const listings = serializeListingCards(rawListings);

  const categoryOptions = categoriesRaw.map((item) => ({
    id: item.id,
    label: item.name,
    vertical: item.vertical,
    parentId: item.parent_id,
    slug: item.slug,
  }));
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
  const theme = getVerticalTheme(filters.vertical);

  const breadcrumbItems = activeVertical
    ? [
        { label: "Главная", href: "/" },
        { label: activeVertical.label, href: activeVertical.href },
        { label: "Каталог" },
      ]
    : [
        { label: "Главная", href: "/" },
        { label: "Каталог" },
      ];

  const equipmentRootCategory = categoryItems.find(
    (item) => item.slug === "market-oborudovanie-i-stanki",
  );
  const equipmentShortcutHref =
    filters.q && isEquipmentLikeQuery(filters.q) && equipmentRootCategory
      ? `/listings?vertical=MARKET&category=${equipmentRootCategory.slug}`
      : undefined;

  return (
    <main
      className={cn(
        "min-w-0 bg-gradient-to-b py-6 sm:py-8 dark:from-slate-950 dark:to-slate-950",
        filters.vertical ? theme.pageWash : "from-[#F5F7FA] to-[#F5F7FA]",
      )}
    >
      <Container size="lg" className="min-w-0">
        <AppBreadcrumbs className="mb-4" items={breadcrumbItems} />

        <header className="mb-5 sm:mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-slate-100">
            {catalogCopy.title}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[#64748B] sm:text-base">
            {catalogCopy.description}
          </p>
        </header>

        {filters.photoSearch ? (
          <PhotoSearchListingsNotice
            vertical={filters.vertical}
            categoryId={filters.categoryId || null}
            initialQueryHint={filters.q}
          />
        ) : null}

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
            photoSearch={filters.photoSearch}
            equipmentShortcutHref={equipmentShortcutHref}
          />
        ) : (
          <>
            <div className={cn("mt-5 pb-24 md:pb-8", LISTING_CARD_GRID_CLASS)}>
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
