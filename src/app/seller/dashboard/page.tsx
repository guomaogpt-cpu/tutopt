import Link from "next/link";
import { UserRole, ListingStatus, LeadStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Inbox,
} from "lucide-react";
import { ListingAccessMessage } from "@/components/listings/NewListingForm";
import { SellerDashboardListings } from "@/components/seller/SellerDashboardListings";
import { SellerDashboardStatCards } from "@/components/seller/SellerDashboardStatCards";
import { SellerQuickActions } from "@/components/seller/SellerQuickActions";
import { getCurrentUser } from "@/features/auth/lib/session";
import { needsSellerOnboarding } from "@/features/auth/lib/seller-onboarding";
import { buildLoginUrl, buildRegisterUrl } from "@/features/auth/lib/login-redirect";
import { buildSellerOnboardingUrl } from "@/features/auth/validators/seller-onboarding.validators";
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
            description="Зарегистрируйтесь с типом аккаунта «Продавец» или войдите в аккаунт продавца."
            actionHref={buildRegisterUrl({ role: "SELLER", returnPath: "/seller/dashboard" })}
            actionLabel="Стать продавцом"
          />
        </Container>
      </main>
    );
  }

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { user_id: user.id },
    include: {
      listings: {
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          price: true,
          currency: true,
          created_at: true,
          view_count: true,
          images: {
            orderBy: { sort_order: "asc" },
            take: 1,
            select: {
              url: true,
              thumbnail_url: true,
            },
          },
        },
      },
    },
  });

  const listings = sellerProfile?.listings ?? [];

  const newLeadsCount = sellerProfile
    ? await prisma.lead.count({
        where: {
          seller_profile_id: sellerProfile.id,
          status: LeadStatus.NEW,
        },
      })
    : 0;

  const publishedCount = listings.filter((item) => item.status === ListingStatus.PUBLISHED).length;
  const pendingCount = listings.filter(
    (item) => item.status === ListingStatus.PENDING_MODERATION,
  ).length;
  const rejectedCount = listings.filter((item) => item.status === ListingStatus.REJECTED).length;

  const serializedListings = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    status: listing.status,
    price: listing.price.toString(),
    currency: listing.currency,
    created_at: listing.created_at.toISOString(),
    view_count: listing.view_count,
    image_url: listing.images[0]?.thumbnail_url ?? listing.images[0]?.url ?? null,
  }));

  const stats = [
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
      label: "Новые заявки",
      value: newLeadsCount,
      icon: Inbox,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
  ];

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container size="lg" className="max-w-[1280px] min-w-0">
        <PageHeader className="pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Кабинет продавца</PageTitle>
            <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
              Управляйте объявлениями и заявками покупателей
            </PageSubtitle>
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
          <SellerDashboardStatCards stats={stats} />
          <SellerQuickActions sellerProfileId={sellerProfile?.id ?? null} />
          <SellerDashboardListings listings={serializedListings} />
        </div>
      </Container>
    </main>
  );
}
