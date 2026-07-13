import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, Clock, Heart, Inbox } from "lucide-react";
import { LeadStatus } from "@prisma/client";
import { BuyerFavoritesSection } from "@/components/buyer/BuyerFavoritesSection";
import { BuyerLeadsSection } from "@/components/buyer/BuyerLeadsSection";
import { BuyerQuickActions } from "@/components/buyer/BuyerQuickActions";
import { BuyerRecentViewsSection } from "@/components/buyer/BuyerRecentViewsSection";
import { SellerDashboardStatCards } from "@/components/seller/SellerDashboardStatCards";
import { getBuyerDashboardData } from "@/features/buyer/lib/buyer-dashboard-data";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getUnreadNotificationCount } from "@/features/notifications/lib/notifications-data";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
} from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";

export default async function BuyerDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/buyer/dashboard"));
  }

  const [data, unreadNotificationsCount] = await Promise.all([
    getBuyerDashboardData(user),
    getUnreadNotificationCount(user.id),
  ]);

  const favoritesCount = data.favoriteListingIds.length;
  const leadsCount = data.leads.length;
  const awaitingResponseCount = data.leads.filter((lead) => lead.status === LeadStatus.NEW).length;

  const stats = [
    {
      label: "Отправленные заявки",
      value: leadsCount,
      icon: Inbox,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
    {
      label: "Избранные товары",
      value: favoritesCount,
      icon: Heart,
      iconClassName: "bg-[#FEF2F2] text-[#DC2626]",
    },
    {
      label: "Ожидают ответа",
      value: awaitingResponseCount,
      icon: Clock,
      iconClassName: "bg-[#FFFBEB] text-[#D97706]",
    },
    {
      label: "Новые уведомления",
      value: unreadNotificationsCount,
      icon: Bell,
      iconClassName: "bg-[#ECFDF5] text-[#059669]",
    },
  ];

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container size="lg" className="max-w-[1280px] min-w-0">
        <PageHeader className="pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Кабинет покупателя</PageTitle>
            <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
              Следите за заявками и избранными товарами
            </PageSubtitle>
          </PageHeaderContent>
          <PageHeaderActions className="w-full sm:w-auto">
            <Button
              asChild
              className="h-11 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:w-auto"
            >
              <Link href="/listings">Перейти в каталог</Link>
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <div className="mt-6 space-y-8 lg:mt-8 lg:space-y-10">
          <SellerDashboardStatCards stats={stats} />
          <BuyerLeadsSection leads={data.leads} />
          <BuyerFavoritesSection
            listings={data.favoriteListings}
            favoriteListingIds={data.favoriteListingIds}
          />
          <BuyerRecentViewsSection
            listings={data.recentViewedListings}
            favoriteListingIds={data.favoriteListingIds}
          />
          <BuyerQuickActions />
        </div>
      </Container>
    </main>
  );
}
