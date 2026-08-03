import { redirect } from "next/navigation";
import { AccountCargoSummaryCard } from "@/components/account/AccountCargoSummaryCard";
import { AccountCompanySummaryCard } from "@/components/account/AccountCompanySummaryCard";
import { AccountListingsSummary } from "@/components/account/AccountListingsSummary";
import { AccountMetaSummary } from "@/components/account/AccountMetaSummary";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";
import { AccountQuickActions } from "@/components/account/AccountQuickActions";
import { AccountRequestsSummary } from "@/components/account/AccountRequestsSummary";
import { getAccountDashboardData } from "@/features/account/lib/account-dashboard-data";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getCurrentUser } from "@/features/auth/lib/session";
import { Container } from "@/components/ui/container";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Личный кабинет",
  "Единый личный кабинет ВсеТут.",
);

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/account"));
  }

  if (user.role === "ADMIN" || user.role === "MODERATOR") {
    redirect("/admin");
  }

  const data = await getAccountDashboardData(user);

  return (
    <main className="min-w-0 overflow-x-clip bg-[#F5F7FA] pt-4 dark:bg-slate-950 sm:py-8">
      <Container size="lg" className="max-w-[1100px] min-w-0">
        <AccountPageHeader userName={data.userName} />

        <div className="space-y-4 sm:space-y-5">
          <AccountQuickActions />
          <AccountMetaSummary
            favoritesCount={data.favoritesCount}
            unreadNotifications={data.unreadNotifications}
          />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
            <AccountListingsSummary
              stats={data.listingStats}
              recentListings={data.recentListings}
            />
            <AccountRequestsSummary
              leadsCount={data.leadsCount}
              recentLeadTitles={data.recentLeadTitles}
              cargoRequestsCount={data.cargoRequestsCount}
              recentCargoRequests={data.recentCargoRequests}
            />
            <AccountCompanySummaryCard company={data.company} />
            <AccountCargoSummaryCard cargo={data.cargo} />
          </div>
        </div>
      </Container>
    </main>
  );
}
