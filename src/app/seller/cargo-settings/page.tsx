import Link from "next/link";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ListingAccessMessage } from "@/components/listings/NewListingForm";
import { CargoSettingsForm } from "@/components/seller/CargoSettingsForm";
import { getCurrentUser } from "@/features/auth/lib/session";
import { needsSellerOnboarding } from "@/features/auth/lib/seller-onboarding";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { buildSellerOnboardingUrl } from "@/features/auth/validators/seller-onboarding.validators";
import { getCargoSubscriptionForSeller } from "@/features/cargo/lib/cargo-subscription-data";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
} from "@/components/ui/page-header";
import { PageTitle } from "@/components/ui/page-title";
import { prisma } from "@/shared/lib/prisma";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";
import { CargoSettingsPageCopy } from "@/components/seller/CargoSettingsPageCopy";

export const metadata = buildPrivatePageMetadata(
  "Настройки карго-заявок",
  "Выберите, какие заявки на перевозку вы хотите получать.",
);

export const dynamic = "force-dynamic";

export default async function SellerCargoSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/seller/cargo-settings"));
  }

  if (user.role === UserRole.BUYER) {
    // Allowed once a company profile exists; otherwise prompt to create cargo listing.
  } else if (user.role === UserRole.SELLER && needsSellerOnboarding({ role: user.role, phone: user.phone })) {
    redirect(buildSellerOnboardingUrl("/seller/cargo-settings"));
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN && user.role !== UserRole.BUYER) {
    return (
      <main className="min-w-0 bg-[#F5F7FA] py-6 dark:bg-slate-950 sm:py-8">
        <Container size="lg" className="max-w-[800px]">
          <PageHeader className="pb-0">
            <PageHeaderContent>
              <PageTitle className="text-2xl text-slate-900 sm:text-3xl dark:text-slate-100">
                Настройки карго-заявок
              </PageTitle>
            </PageHeaderContent>
          </PageHeader>
          <ListingAccessMessage
            title="Войдите, чтобы настроить карго"
            description="Сначала добавьте карго-компанию, затем подключите уведомления."
            actionHref={buildLoginUrl("/seller/cargo-settings")}
            actionLabel="Войти"
          />
        </Container>
      </main>
    );
  }

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { user_id: user.id },
    select: { id: true },
  });

  if (!sellerProfile) {
    return (
      <main className="min-w-0 bg-[#F5F7FA] py-6 dark:bg-slate-950 sm:py-8">
        <Container size="lg" className="max-w-[800px]">
          <ListingAccessMessage
            title="Сначала добавьте карго-компанию"
            description="Создайте карточку карго-компании, затем настройте заявки и Telegram."
            actionHref="/listings/new?vertical=cargo"
            actionLabel="Добавить карго-компанию"
          />
        </Container>
      </main>
    );
  }

  const settings = await getCargoSubscriptionForSeller(sellerProfile.id);

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 dark:bg-slate-950 sm:py-8">
      <Container size="lg" className="max-w-[800px] min-w-0">
        <PageHeader className="pb-0">
          <PageHeaderContent>
            <CargoSettingsPageCopy />
          </PageHeaderContent>
          <PageHeaderActions className="w-full sm:w-auto">
            <Button
              variant="outline"
              asChild
              className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-auto"
            >
              <Link href="/seller/cargo-requests">Карго-заявки</Link>
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <div className="mt-6">
          <CargoSettingsForm initialSettings={settings} />
        </div>
      </Container>
    </main>
  );
}
