import Link from "next/link";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ListingAccessMessage } from "@/components/listings/NewListingForm";
import { SellerCargoRequestsList } from "@/components/seller/SellerCargoRequestsList";
import { getCurrentUser } from "@/features/auth/lib/session";
import { needsSellerOnboarding } from "@/features/auth/lib/seller-onboarding";
import { buildLoginUrl, buildSellerUpgradeUrl } from "@/features/auth/lib/login-redirect";
import { buildSellerOnboardingUrl } from "@/features/auth/validators/seller-onboarding.validators";
import { getSellerCargoRequests } from "@/features/cargo/lib/cargo-requests-data";
import { parseCargoRequestStatusFilter } from "@/features/cargo/lib/cargo-request-status";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
} from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { prisma } from "@/shared/lib/prisma";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Карго-заявки",
  "Заявки на перевозку для карго-компаний на ВсеТут.",
);

export const dynamic = "force-dynamic";

type SellerCargoRequestsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SellerCargoRequestsPage({
  searchParams,
}: SellerCargoRequestsPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/seller/cargo-requests"));
  }

  if (user.role === UserRole.BUYER) {
    redirect(buildSellerUpgradeUrl("/seller/cargo-requests"));
  }

  if (user.role === UserRole.SELLER && needsSellerOnboarding({ role: user.role, phone: user.phone })) {
    redirect(buildSellerOnboardingUrl("/seller/cargo-requests"));
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
    return (
      <main className="min-w-0 bg-[#F5F7FA] py-6 dark:bg-slate-950 sm:py-8">
        <Container size="lg" className="max-w-[1280px]">
          <PageHeader className="pb-0">
            <PageHeaderContent>
              <PageTitle className="text-2xl text-slate-900 sm:text-3xl dark:text-slate-100">
                Карго-заявки
              </PageTitle>
            </PageHeaderContent>
          </PageHeader>
          <ListingAccessMessage
            title="Раздел доступен только продавцам"
            description="Станьте продавцом, чтобы видеть карго-заявки клиентов."
            actionHref={buildSellerUpgradeUrl("/seller/cargo-requests")}
            actionLabel="Стать продавцом"
          />
        </Container>
      </main>
    );
  }

  const rawParams = await searchParams;
  const statusParam = typeof rawParams.status === "string" ? rawParams.status : null;
  const statusFilter = parseCargoRequestStatusFilter(statusParam);

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { user_id: user.id },
    select: { id: true },
  });

  const requests = await getSellerCargoRequests({
    statusFilter,
    sellerProfileId: sellerProfile?.id ?? null,
  });

  // Client phone only for admin until contact-sharing policy is ready.
  const showContacts = user.role === UserRole.ADMIN;
  const canRespond = Boolean(sellerProfile);

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 dark:bg-slate-950 sm:py-8">
      <Container size="lg" className="max-w-[1280px] min-w-0">
        <PageHeader className="pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-slate-900 sm:text-3xl dark:text-slate-100">
              Карго-заявки
            </PageTitle>
            <PageSubtitle className="text-sm text-slate-500 sm:text-base dark:text-slate-400">
              Доска заявок на перевозку — откликайтесь через систему
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
          <SellerCargoRequestsList
            requests={requests}
            showContacts={showContacts}
            canRespond={canRespond}
          />
        </div>
      </Container>
    </main>
  );
}
