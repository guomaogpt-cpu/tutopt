import Link from "next/link";
import { UserRole, ListingStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Inbox,
} from "lucide-react";
import { ListingAccessMessage } from "@/components/listings/NewListingForm";
import { SellerDashboardListings } from "@/components/seller/SellerDashboardListings";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl, buildRegisterUrl } from "@/features/auth/lib/login-redirect";
import { prisma } from "@/shared/lib/prisma";
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

export default async function SellerDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/seller/dashboard"));
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
    return (
      <main className="bg-background py-10 sm:py-14">
        <Container size="md">
          <PageHeader>
            <PageHeaderContent>
              <PageTitle className="text-2xl sm:text-3xl">Кабинет продавца</PageTitle>
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
        },
      },
    },
  });

  const listings = sellerProfile?.listings ?? [];

  const leadsCount = sellerProfile
    ? await prisma.lead.count({
        where: { seller_profile_id: sellerProfile.id },
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
  }));

  const companyLabel = sellerProfile
    ? sellerProfile.company_name
    : "Создайте первое объявление — профиль компании будет создан автоматически.";

  return (
    <main className="bg-background py-10 sm:py-14">
      <Container size="lg">
        <PageHeader>
          <PageHeaderContent>
            <Badge variant="secondary" className="w-fit">
              Продавец
            </Badge>
            <PageTitle className="text-2xl sm:text-3xl">Кабинет продавца</PageTitle>
            <PageSubtitle className="text-sm sm:text-base">
              Здравствуйте, {user.name}! {companyLabel}
            </PageSubtitle>
          </PageHeaderContent>
          <PageHeaderActions>
            <Button asChild>
              <Link href="/listings/new">Подать объявление</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/seller/leads">Заявки</Link>
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <Section spacing="sm" className="mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Активные объявления"
              value={publishedCount}
              icon={CheckCircle2}
              description="Опубликовано"
            />
            <StatCard
              label="На модерации"
              value={pendingCount}
              icon={Clock}
              description="Ожидают проверки"
            />
            <StatCard
              label="Отклонённые"
              value={rejectedCount}
              icon={AlertCircle}
              description="Требуют правок"
            />
            <StatCard
              label="Входящие заявки"
              value={leadsCount}
              icon={Inbox}
              description="Всего заявок"
            />
          </div>
        </Section>

        <div className="mt-8">
          <SellerDashboardListings listings={serializedListings} />
        </div>
      </Container>
    </main>
  );
}
