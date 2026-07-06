import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { BuyerFavoritesSection } from "@/components/buyer/BuyerFavoritesSection";
import { BuyerLeadsSection } from "@/components/buyer/BuyerLeadsSection";
import { BuyerProfileSection } from "@/components/buyer/BuyerProfileSection";
import { BuyerRecentViewsSection } from "@/components/buyer/BuyerRecentViewsSection";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { getBuyerDashboardData } from "@/features/buyer/lib/buyer-dashboard-data";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";

export default async function BuyerDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/buyer/dashboard"));
  }

  const data = await getBuyerDashboardData(user);

  return (
    <main className="bg-slate-50 py-8 sm:py-12">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <PublicPageHeader
              eyebrow="Покупатель"
              title="Кабинет покупателя"
              description="Избранное, заявки и недавно просмотренные объявления в одном месте."
            />
            <Link
              href="/listings"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Перейти в каталог
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="space-y-6">
              <BuyerFavoritesSection
                listings={data.favoriteListings}
                favoriteListingIds={data.favoriteListingIds}
              />
              <BuyerLeadsSection leads={data.leads} />
              <BuyerRecentViewsSection
                listings={data.recentViewedListings}
                favoriteListingIds={data.favoriteListingIds}
              />
            </div>

            <aside className="lg:sticky lg:top-24">
              <BuyerProfileSection user={data.profile} />
            </aside>
          </div>
        </div>
      </Container>
    </main>
  );
}
