import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, Heart, Inbox } from "lucide-react";
import { BuyerFavoritesSection } from "@/components/buyer/BuyerFavoritesSection";
import { BuyerLeadsSection } from "@/components/buyer/BuyerLeadsSection";
import { getBuyerDashboardData } from "@/features/buyer/lib/buyer-dashboard-data";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getUnreadNotificationCount } from "@/features/notifications/lib/notifications-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
} from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { StatCard } from "@/components/ui/stat-card";

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

  return (
    <main className="bg-background py-8 sm:py-12">
      <Container size="lg">
        <PageHeader>
          <PageHeaderContent>
            <Badge variant="secondary" className="w-fit">
              Покупатель
            </Badge>
            <PageTitle className="text-2xl sm:text-3xl">Кабинет покупателя</PageTitle>
            <PageSubtitle className="text-sm sm:text-base">
              Здравствуйте, {user.name}! Избранное, заявки и уведомления в одном месте.
            </PageSubtitle>
          </PageHeaderContent>
          <PageHeaderActions className="flex-wrap">
            <Button variant="outline" asChild>
              <Link href="/favorites">Смотреть избранное</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/buyer/dashboard#buyer-leads">Смотреть заявки</Link>
            </Button>
            <Button asChild>
              <Link href="/listings">Перейти в каталог</Link>
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <Section spacing="sm" className="mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Избранное"
              value={favoritesCount}
              icon={Heart}
              description="Сохранённых объявлений"
            />
            <StatCard
              label="Заявки"
              value={leadsCount}
              icon={Inbox}
              description="Отправлено продавцам"
            />
            <StatCard
              label="Уведомления"
              value={unreadNotificationsCount}
              icon={Bell}
              description="Непрочитанных"
            />
          </div>
        </Section>

        <div className="mt-8 space-y-6">
          <BuyerFavoritesSection
            listings={data.favoriteListings}
            favoriteListingIds={data.favoriteListingIds}
          />
          <BuyerLeadsSection leads={data.leads} limit={5} />
        </div>
      </Container>
    </main>
  );
}
