import Link from "next/link";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ListingAccessMessage } from "@/components/listings/NewListingForm";
import { SellerLeadsTable } from "@/components/seller/SellerLeadsTable";
import { getCurrentUser } from "@/features/auth/lib/session";
import { needsSellerOnboarding } from "@/features/auth/lib/seller-onboarding";
import { buildLoginUrl, buildSellerUpgradeUrl } from "@/features/auth/lib/login-redirect";
import { buildSellerOnboardingUrl } from "@/features/auth/validators/seller-onboarding.validators";
import { getSellerLeads } from "@/features/leads/lib/leads-data";
import { parseSellerLeadStatusFilter } from "@/features/leads/lib/lead-status";
import { prisma } from "@/shared/lib/prisma";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
} from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Заявки",
  "Заявки покупателей для продавца на ВсеТут.",
);

export const dynamic = "force-dynamic";

type SellerLeadsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SellerLeadsPage({ searchParams }: SellerLeadsPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/seller/leads"));
  }

  if (user.role === UserRole.BUYER) {
    redirect(buildSellerUpgradeUrl("/seller/leads"));
  }

  if (user.role === UserRole.SELLER && needsSellerOnboarding({ role: user.role, phone: user.phone })) {
    redirect(buildSellerOnboardingUrl("/seller/leads"));
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
    return (
      <main className="min-w-0 bg-[#F5F7FA] dark:bg-slate-950 py-6 sm:py-8">
        <Container size="lg" className="max-w-[1280px]">
          <PageHeader className="pb-0">
            <PageHeaderContent>
              <PageTitle className="text-2xl text-slate-900 sm:text-3xl dark:text-slate-100">
                Заявки
              </PageTitle>
            </PageHeaderContent>
          </PageHeader>
          <ListingAccessMessage
            title="Раздел доступен только продавцам"
            description="Станьте продавцом в текущем аккаунте, чтобы получать заявки от покупателей."
            actionHref={buildSellerUpgradeUrl("/seller/leads")}
            actionLabel="Стать продавцом"
          />
        </Container>
      </main>
    );
  }

  const rawParams = await searchParams;
  const statusParam = typeof rawParams.status === "string" ? rawParams.status : null;
  const statusFilter = parseSellerLeadStatusFilter(statusParam);

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { user_id: user.id },
    select: { id: true, company_name: true },
  });

  const leads = sellerProfile
    ? await getSellerLeads(sellerProfile.id, { statusFilter })
    : [];

  return (
    <main className="min-w-0 bg-[#F5F7FA] dark:bg-slate-950 py-6 sm:py-8">
      <Container size="lg" className="max-w-[1280px] min-w-0">
        <PageHeader className="pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-slate-900 sm:text-3xl dark:text-slate-100">
              Заявки покупателей
            </PageTitle>
            <PageSubtitle className="text-sm text-slate-500 sm:text-base dark:text-slate-400">
              Запросы по вашим объявлениям
            </PageSubtitle>
          </PageHeaderContent>
          <PageHeaderActions className="w-full sm:w-auto">
            <Button
              variant="outline"
              asChild
              className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-auto"
            >
              <Link href="/seller/dashboard">Кабинет продавца</Link>
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <div className="mt-6 lg:mt-8">
          <SellerLeadsTable leads={leads} statusFilter={statusFilter} />
        </div>
      </Container>
    </main>
  );
}
