import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { AccountListingsEmptyState } from "@/components/account/AccountListingsEmptyState";
import { AccountListingsFilters } from "@/components/account/AccountListingsFilters";
import { AccountListingsPageHeader } from "@/components/account/AccountListingsPageHeader";
import { SellerListingManageCard } from "@/components/seller/SellerListingManageCard";
import { SellerListingsPagination } from "@/components/seller/SellerListingsPagination";
import { getCurrentUser } from "@/features/auth/lib/session";
import { needsSellerOnboarding } from "@/features/auth/lib/seller-onboarding";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { buildSellerOnboardingUrl } from "@/features/auth/validators/seller-onboarding.validators";
import { formatListingPrice } from "@/features/listings/lib/format-listing-price";
import {
  SELLER_LISTINGS_PER_PAGE,
  buildSellerListingsWhere,
  hasActiveSellerListingsFilters,
  parseSellerListingsParams,
} from "@/features/sellers/lib/seller-listings";
import { calculateListingQuality } from "@/lib/moderation/listing-quality";
import { prisma } from "@/shared/lib/prisma";
import { Container } from "@/components/ui/container";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";
import { translate } from "@/lib/i18n/dictionaries";

export const metadata = buildPrivatePageMetadata(
  "Мои объявления",
  "Управление объявлениями в личном кабинете ВсеТут.",
);

export const dynamic = "force-dynamic";

type AccountListingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AccountListingsPage({ searchParams }: AccountListingsPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/account/listings"));
  }

  if (user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) {
    redirect("/admin");
  }

  if (
    user.role === UserRole.SELLER &&
    needsSellerOnboarding({ role: user.role, phone: user.phone })
  ) {
    redirect(buildSellerOnboardingUrl("/account/listings"));
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.BUYER) {
    redirect("/");
  }

  const rawParams = await searchParams;
  const filters = parseSellerListingsParams(rawParams);

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { user_id: user.id },
    select: {
      id: true,
      company_name: true,
      company_type: true,
    },
  });

  const where = sellerProfile ? buildSellerListingsWhere(sellerProfile.id, filters) : null;

  const [totalCount, listings] = where
    ? await Promise.all([
        prisma.listing.count({ where }),
        prisma.listing.findMany({
          where,
          orderBy: { created_at: "desc" },
          skip: (filters.page - 1) * SELLER_LISTINGS_PER_PAGE,
          take: SELLER_LISTINGS_PER_PAGE,
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            vertical: true,
            posted_as_company: true,
            price: true,
            currency: true,
            moq: true,
            unit: true,
            created_at: true,
            updated_at: true,
            published_at: true,
            expires_at: true,
            view_count: true,
            rejection_reason: true,
            city: { select: { name: true } },
            category: { select: { name: true } },
            images: {
              orderBy: { sort_order: "asc" },
              take: 1,
              select: { url: true, thumbnail_url: true },
            },
            _count: { select: { images: true, leads: true } },
          },
        }),
      ])
    : [0, []];

  const serializedListings = listings.map((listing) => {
    const quality = calculateListingQuality({
      title: listing.title,
      description: listing.description,
      price: listing.price.toString(),
      cityName: listing.city?.name ?? null,
      categoryName: listing.category.name,
      vertical: listing.vertical,
      imageCount: listing._count.images,
      moq: listing.moq,
      unit: listing.unit,
    });

    const hasPrice = Number(listing.price.toString()) > 0;
    const postedAsCompany = Boolean(
      listing.posted_as_company && sellerProfile?.company_type,
    );

    return {
      id: listing.id,
      title: listing.title,
      status: listing.status,
      vertical: listing.vertical,
      priceLabel: hasPrice
        ? formatListingPrice(listing.price, listing.currency)
        : translate("ru", "listingCard.priceOnRequest"),
      categoryName: listing.category.name,
      cityName: listing.city?.name ?? null,
      created_at: listing.created_at.toISOString(),
      updated_at: listing.updated_at.toISOString(),
      published_at: listing.published_at?.toISOString() ?? null,
      expires_at: listing.expires_at?.toISOString() ?? null,
      view_count: listing.view_count,
      image_url: listing.images[0]?.thumbnail_url ?? listing.images[0]?.url ?? null,
      qualityLevel: quality.level,
      qualityWarnings: quality.warnings.slice(0, 2),
      postedAsCompany,
      companyName: postedAsCompany ? sellerProfile?.company_name ?? null : null,
      leadsCount: listing._count.leads,
      rejection_reason: listing.rejection_reason,
    };
  });

  const hasFilters = hasActiveSellerListingsFilters(filters);

  return (
    <main className="min-w-0 bg-[#F5F7FA] pt-4 dark:bg-slate-950 sm:py-8">
      <Container size="lg" className="max-w-[1100px] min-w-0">
        <AccountListingsPageHeader />

        <div className="mt-5 space-y-4 sm:mt-6">
          <AccountListingsFilters filters={filters} />

          {serializedListings.length === 0 ? (
            <AccountListingsEmptyState
              hasFilters={hasFilters}
              vertical={filters.vertical}
              statusFilter={filters.status}
            />
          ) : (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {totalCount}
              </p>
              <div className="space-y-3">
                {serializedListings.map((listing) => (
                  <SellerListingManageCard
                    key={listing.id}
                    listing={listing}
                    statusFilter={filters.status}
                    useAccountLabels
                  />
                ))}
              </div>
              <SellerListingsPagination
                filters={filters}
                totalCount={totalCount}
                basePath="/account/listings"
              />
            </>
          )}
        </div>
      </Container>
    </main>
  );
}
