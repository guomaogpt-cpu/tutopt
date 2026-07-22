import Link from "next/link";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { AlertTriangle, Package } from "lucide-react";
import { ListingAccessMessage } from "@/components/listings/NewListingForm";
import { SellerListingManageCard } from "@/components/seller/SellerListingManageCard";
import { SellerListingsFilters } from "@/components/seller/SellerListingsFilters";
import { SellerListingsPagination } from "@/components/seller/SellerListingsPagination";
import { getCurrentUser } from "@/features/auth/lib/session";
import { needsSellerOnboarding } from "@/features/auth/lib/seller-onboarding";
import { buildLoginUrl, buildSellerUpgradeUrl } from "@/features/auth/lib/login-redirect";
import { buildSellerOnboardingUrl } from "@/features/auth/validators/seller-onboarding.validators";
import { formatListingPrice } from "@/features/listings/lib/format-listing-price";
import {
  SELLER_LISTINGS_PER_PAGE,
  buildSellerListingsWhere,
  hasActiveSellerListingsFilters,
  parseSellerListingsParams,
} from "@/features/sellers/lib/seller-listings";
import { calculateListingQuality } from "@/lib/moderation/listing-quality";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Мои объявления",
  "Управление объявлениями продавца на ВсеТут.",
);
import { getUserRestrictionLabels } from "@/lib/security/user-restrictions";
import { prisma } from "@/shared/lib/prisma";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
} from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";

type SellerListingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SellerListingsPage({ searchParams }: SellerListingsPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/seller/listings"));
  }

  if (user.role === UserRole.BUYER) {
    redirect(buildSellerUpgradeUrl("/seller/listings"));
  }

  if (
    user.role === UserRole.SELLER &&
    needsSellerOnboarding({ role: user.role, phone: user.phone })
  ) {
    redirect(buildSellerOnboardingUrl("/seller/listings"));
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
    return (
      <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
        <Container size="lg" className="max-w-[1280px]">
          <PageHeader className="pb-0">
            <PageHeaderContent>
              <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Мои объявления</PageTitle>
            </PageHeaderContent>
          </PageHeader>
          <ListingAccessMessage
            title="Управление объявлениями доступно только продавцам"
            description="Станьте продавцом в текущем аккаунте, чтобы публиковать товары и управлять объявлениями."
            actionHref={buildSellerUpgradeUrl("/seller/listings")}
            actionLabel="Стать продавцом"
          />
        </Container>
      </main>
    );
  }

  const rawParams = await searchParams;
  const filters = parseSellerListingsParams(rawParams);

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { user_id: user.id },
    select: { id: true },
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
            price: true,
            currency: true,
            moq: true,
            unit: true,
            created_at: true,
            published_at: true,
            expires_at: true,
            view_count: true,
            city: { select: { name: true } },
            category: { select: { name: true } },
            images: {
              orderBy: { sort_order: "asc" },
              take: 1,
              select: { url: true, thumbnail_url: true },
            },
            _count: { select: { images: true } },
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

    return {
      id: listing.id,
      title: listing.title,
      status: listing.status,
      vertical: listing.vertical,
      priceLabel: hasPrice
        ? formatListingPrice(listing.price, listing.currency)
        : "Цена не указана",
      categoryName: listing.category.name,
      cityName: listing.city?.name ?? null,
      created_at: listing.created_at.toISOString(),
      published_at: listing.published_at?.toISOString() ?? null,
      expires_at: listing.expires_at?.toISOString() ?? null,
      view_count: listing.view_count,
      image_url: listing.images[0]?.thumbnail_url ?? listing.images[0]?.url ?? null,
      qualityLevel: quality.level,
      qualityWarnings: quality.warnings.slice(0, 2),
    };
  });

  const restrictionLabels = getUserRestrictionLabels(user);
  const hasRestrictions = restrictionLabels.some((label) => label !== "Активен");
  const hasFilters = hasActiveSellerListingsFilters(filters);

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container size="lg" className="max-w-[1280px] min-w-0">
        <PageHeader className="pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Мои объявления</PageTitle>
            <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
              Управляйте публикацией, архивом и сроком размещения объявлений.
            </PageSubtitle>
          </PageHeaderContent>
          <PageHeaderActions className="w-full sm:w-auto">
            <Button
              asChild
              variant="outline"
              className="h-11 w-full rounded-xl border-[rgba(148,163,184,0.25)] bg-white sm:w-auto"
            >
              <Link href="/seller/dashboard">Кабинет продавца</Link>
            </Button>
            <Button
              asChild
              className="h-11 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:w-auto"
            >
              <Link href="/listings/new">Добавить объявление</Link>
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <div className="mt-6 space-y-4">
          {hasRestrictions ? (
            <div className="flex items-start gap-3 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E]">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p>Аккаунт ограничен. Некоторые действия недоступны.</p>
            </div>
          ) : null}

          <SellerListingsFilters filters={filters} />

          {serializedListings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-12 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                <Package className="size-6" aria-hidden="true" />
              </div>
              {hasFilters ? (
                <>
                  <p className="mt-5 text-base font-semibold text-[#0F172A]">
                    По этому фильтру объявлений нет.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 h-11 rounded-xl border-[rgba(148,163,184,0.25)]"
                  >
                    <Link href="/seller/listings">Сбросить фильтры</Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="mt-5 text-base font-semibold text-[#0F172A]">
                    У вас пока нет объявлений.
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
                    Создайте первое объявление, чтобы начать получать заявки от покупателей.
                  </p>
                  <Button asChild className="mt-6 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]">
                    <Link href="/listings/new">Добавить первое объявление</Link>
                  </Button>
                </>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-[#64748B]">
                Найдено: <span className="font-medium text-[#0F172A]">{totalCount}</span>
              </p>
              <div className="space-y-3">
                {serializedListings.map((listing) => (
                  <SellerListingManageCard
                    key={listing.id}
                    listing={listing}
                    statusFilter={filters.status}
                  />
                ))}
              </div>
              <SellerListingsPagination filters={filters} totalCount={totalCount} />
            </>
          )}
        </div>
      </Container>
    </main>
  );
}
