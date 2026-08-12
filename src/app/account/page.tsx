import { redirect } from "next/navigation";
import { AccountManagementNav } from "@/components/account/AccountManagementNav";
import { AccountMyActivityStats } from "@/components/account/AccountMyActivityStats";
import { AccountCargoSummaryCard } from "@/components/account/AccountCargoSummaryCard";
import { AccountCompanySummaryCard } from "@/components/account/AccountCompanySummaryCard";
import { AccountListingsSummary } from "@/components/account/AccountListingsSummary";
import { AccountMetaSummary } from "@/components/account/AccountMetaSummary";
import { AccountProfileCard } from "@/components/account/AccountProfileCard";
import { AccountQuickStart } from "@/components/account/AccountQuickStart";
import { PushNotificationsSettings } from "@/components/account/PushNotificationsSettings";
import { AccountRequestsSummary } from "@/components/account/AccountRequestsSummary";
import { AccountServiceLinks } from "@/components/account/AccountServiceLinks";
import { PwaInstallCard } from "@/components/pwa/PwaInstallCard";
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
        <div className="space-y-4 sm:space-y-5">
          <AccountProfileCard
            userName={data.userName}
            phone={user.phone}
            hasCompany={Boolean(data.company)}
          />
          <AccountManagementNav />
          <AccountMyActivityStats
            activeListings={data.listingStats.active}
            pendingListings={data.listingStats.pending}
            receivedLeads={data.totalReceivedLeadsCount}
            newLeads={data.receivedLeadsCount}
            sentLeads={data.sentLeadsCount}
          />

          <div className="hidden lg:block">
            <AccountQuickStart
              hasListings={data.listingStats.total > 0}
              hasCompany={Boolean(data.company)}
            />
          </div>

          <PushNotificationsSettings />

          <div className="hidden sm:grid">
            <AccountMetaSummary
              favoritesCount={data.favoritesCount}
              unreadNotifications={data.unreadNotifications}
            />
          </div>

          <div className="hidden gap-4 lg:grid lg:grid-cols-2 lg:gap-5">
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

          <div className="grid gap-4 lg:hidden">
            <AccountCompanySummaryCard company={data.company} />
            <AccountCargoSummaryCard cargo={data.cargo} />
          </div>

          <div className="hidden md:block">
            <PwaInstallCard />
          </div>
          <AccountServiceLinks />
        </div>
      </Container>
    </main>
  );
}
