import Link from "next/link";
import { UserRole, ListingStatus, LeadStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Inbox,
  LayoutGrid,
  MailPlus,
  MapPin,
  Package,
} from "lucide-react";
import { ListingAccessMessage } from "@/components/listings/NewListingForm";
import { SellerAccountStatusCard } from "@/components/seller/SellerAccountStatusCard";
import { SellerDashboardListings } from "@/components/seller/SellerDashboardListings";
import { SellerDashboardStatCards } from "@/components/seller/SellerDashboardStatCards";
import { SellerProfileCompletenessCard } from "@/components/seller/SellerProfileCompletenessCard";
import { SellerQuickActions } from "@/components/seller/SellerQuickActions";
import {
  SellerRecentLeads,
  type SellerRecentLead,
} from "@/components/seller/SellerRecentLeads";
import { getCurrentUser } from "@/features/auth/lib/session";
import { needsSellerOnboarding } from "@/features/auth/lib/seller-onboarding";
import { buildLoginUrl, buildSellerUpgradeUrl } from "@/features/auth/lib/login-redirect";
import { buildSellerOnboardingUrl } from "@/features/auth/validators/seller-onboarding.validators";
import { countSellerVerticals } from "@/features/sellers/lib/seller-vertical-profile";
import { VERTICAL_LIST } from "@/features/verticals/verticals";
import { calculateListingQuality } from "@/lib/moderation/listing-quality";
import { getUserRestrictionLabels } from "@/lib/security/user-restrictions";
import { calculateSellerTrust } from "@/lib/trust/seller-trust";
import { prisma } from "@/shared/lib/prisma";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
} from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";

export default async function SellerDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/seller/dashboard"));
  }

  if (user.role === UserRole.BUYER) {
    redirect(buildSellerUpgradeUrl("/seller/dashboard"));
  }

  if (user.role === UserRole.SELLER && needsSellerOnboarding({ role: user.role, phone: user.phone })) {
    redirect(buildSellerOnboardingUrl("/seller/dashboard"));
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
    return (
      <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
        <Container size="lg" className="max-w-[1280px]">
          <PageHeader className="pb-0">
            <PageHeaderContent>
              <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Кабинет продавца</PageTitle>
            </PageHeaderContent>
          </PageHeader>
          <ListingAccessMessage
            title="Создание объявлений доступно только продавцам"
            description="Станьте продавцом в текущем аккаунте, чтобы публиковать товары и получать заявки."
            actionHref={buildSellerUpgradeUrl("/seller/dashboard")}
            actionLabel="Стать продавцом"
          />
        </Container>
      </main>
    );
  }

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { user_id: user.id },
    include: {
      city: { select: { name: true } },
      listings: {
        orderBy: { created_at: "desc" },
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
          expires_at: true,
          view_count: true,
          city: { select: { name: true } },
          category: { select: { name: true } },
          images: {
            orderBy: { sort_order: "asc" },
            take: 1,
            select: {
              url: true,
              thumbnail_url: true,
            },
          },
          _count: {
            select: { images: true },
          },
        },
      },
    },
  });

  const listings = sellerProfile?.listings ?? [];

  const [newLeadsCount, totalLeadsCount, recentLeads] = sellerProfile
    ? await Promise.all([
        prisma.lead.count({
          where: {
            seller_profile_id: sellerProfile.id,
            status: LeadStatus.NEW,
          },
        }),
        prisma.lead.count({
          where: { seller_profile_id: sellerProfile.id },
        }),
        prisma.lead.findMany({
          where: { seller_profile_id: sellerProfile.id },
          orderBy: { created_at: "desc" },
          take: 5,
          select: {
            id: true,
            status: true,
            created_at: true,
            buyer: { select: { name: true } },
            listing: { select: { id: true, title: true, vertical: true } },
          },
        }),
      ])
    : [0, 0, []];

  const publishedCount = listings.filter((item) => item.status === ListingStatus.PUBLISHED).length;
  const pendingCount = listings.filter(
    (item) => item.status === ListingStatus.PENDING_MODERATION,
  ).length;
  const rejectedCount = listings.filter((item) => item.status === ListingStatus.REJECTED).length;

  const verticalCounts = countSellerVerticals(listings);
  const activeVerticals = VERTICAL_LIST.filter((item) => verticalCounts[item.id] > 0).map(
    (item) => item.id,
  );

  const sellerTrust = calculateSellerTrust({
    hasSellerProfile: Boolean(sellerProfile),
    companyName: sellerProfile?.company_name ?? null,
    userName: user.name,
    description: sellerProfile?.description ?? null,
    cityName: sellerProfile?.city?.name ?? user.city,
    phone: user.phone ?? sellerProfile?.contact_phone ?? null,
    phoneVerifiedAt: user.phone_verified_at,
    logoUrl: sellerProfile?.logo_url ?? null,
    avatarUrl: user.avatar_url,
    accountCreatedAt: user.created_at,
    publishedListingCount: publishedCount,
    activeVerticals,
    hasCompletedOnboarding: !needsSellerOnboarding({
      role: user.role,
      phone: user.phone,
    }),
  });

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

    return {
      id: listing.id,
      title: listing.title,
      status: listing.status,
      vertical: listing.vertical,
      price: listing.price.toString(),
      currency: listing.currency,
      created_at: listing.created_at.toISOString(),
      expires_at: listing.expires_at?.toISOString() ?? null,
      view_count: listing.view_count,
      image_url: listing.images[0]?.thumbnail_url ?? listing.images[0]?.url ?? null,
      qualityLevel: quality.level,
      qualityWarnings: quality.warnings.slice(0, 2),
    };
  });

  const restrictionLabels = getUserRestrictionLabels(user);
  const hasRestrictions = restrictionLabels.some((label) => label !== "Активен");

  const serializedRecentLeads: SellerRecentLead[] = recentLeads.map((lead) => ({
    id: lead.id,
    status: lead.status,
    created_at: lead.created_at,
    buyerName: lead.buyer.name,
    listingId: lead.listing.id,
    listingTitle: lead.listing.title,
    listingVertical: lead.listing.vertical,
  }));

  const activeVerticalsCount = VERTICAL_LIST.filter(
    (item) => verticalCounts[item.id] > 0,
  ).length;

  const stats = [
    {
      label: "Всего объявлений",
      value: listings.length,
      icon: Package,
      iconClassName: "bg-[#F1F5F9] text-[#64748B]",
    },
    {
      label: "Активные объявления",
      value: publishedCount,
      icon: CheckCircle2,
      iconClassName: "bg-[#ECFDF5] text-[#059669]",
    },
    {
      label: "На модерации",
      value: pendingCount,
      icon: Clock,
      iconClassName: "bg-[#FFFBEB] text-[#D97706]",
    },
    {
      label: "Отклонённые",
      value: rejectedCount,
      icon: AlertCircle,
      iconClassName: "bg-[#FEF2F2] text-[#DC2626]",
    },
    {
      label: "Заявки всего",
      value: totalLeadsCount,
      icon: MailPlus,
      iconClassName: "bg-[#F1F5F9] text-[#64748B]",
    },
    {
      label: "Новые заявки",
      value: newLeadsCount,
      icon: Inbox,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
    {
      label: "Направления с объявлениями",
      value: activeVerticalsCount,
      icon: LayoutGrid,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
  ];

  const hasVerticalActivity = VERTICAL_LIST.some((item) => verticalCounts[item.id] > 0);
  const publicProfileHref = sellerProfile
    ? `/seller/${sellerProfile.slug ?? sellerProfile.id}`
    : null;

  const sellerCityName = sellerProfile?.city?.name ?? user.city;
  const memberSinceLabel = user.created_at.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const profileIncomplete = sellerTrust.level === "incomplete";

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container size="lg" className="max-w-[1280px] min-w-0">
        <PageHeader className="pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">
              {sellerProfile?.company_name ?? user.name}
            </PageTitle>
            <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
              Кабинет продавца — объявления и заявки покупателей
            </PageSubtitle>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[#64748B]">
              <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-medium text-[#2563EB]">
                Продавец
              </span>
              {sellerCityName ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {sellerCityName}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                На платформе с {memberSinceLabel}
              </span>
            </div>
            {profileIncomplete ? (
              <p className="mt-2 text-sm font-medium text-[#D97706]">
                Профиль продавца заполнен не полностью.
              </p>
            ) : null}
          </PageHeaderContent>
          <PageHeaderActions className="w-full sm:w-auto">
            <Button
              asChild
              className="h-11 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:w-auto"
            >
              <Link href="/listings/new">Подать объявление</Link>
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <div className="mt-6 space-y-8 lg:mt-8 lg:space-y-10">
          <SellerAccountStatusCard
            labels={restrictionLabels}
            hasRestrictions={hasRestrictions}
          />

          <SellerDashboardStatCards stats={stats} />

          <SellerProfileCompletenessCard
            score={sellerTrust.score}
            level={sellerTrust.level}
            levelLabel={sellerTrust.levelLabel}
            improvements={sellerTrust.improvements}
            publicProfileHref={publicProfileHref}
          />

          {hasVerticalActivity ? (
            <section aria-labelledby="seller-vertical-stats-title">
              <h2
                id="seller-vertical-stats-title"
                className="mb-3 text-lg font-bold text-[#0F172A] sm:text-xl"
              >
                По направлениям
              </h2>
              <ul className="flex flex-wrap gap-2">
                {VERTICAL_LIST.map((item) => {
                  const count = verticalCounts[item.id];
                  if (count === 0) {
                    return null;
                  }
                  return (
                    <li key={item.id}>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-[#334155] ring-1 ring-slate-200">
                        {item.label}
                        <span className="rounded-full bg-[#EFF6FF] px-1.5 py-0.5 text-xs font-semibold text-[#2563EB]">
                          {count}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <SellerQuickActions
            sellerProfileId={sellerProfile?.id ?? null}
            verticalCounts={verticalCounts}
          />
          <SellerRecentLeads leads={serializedRecentLeads} />
          <SellerDashboardListings listings={serializedListings} />
        </div>
      </Container>
    </main>
  );
}
