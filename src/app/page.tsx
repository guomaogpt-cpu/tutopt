import {
  HomeDiscoverySection,
  RecentListingsSection,
} from "@/components/home/HomeListingsSection";
import { HomeWhyVsetutSection } from "@/components/home/HomeWhyVsetutSection";
import { SellerCtaSection } from "@/components/home/SellerCtaSection";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getCreateListingHref } from "@/features/auth/lib/login-redirect";
import { getUserFavoriteListingIds } from "@/features/favorites/lib/favorites-data";
import { getHomePageData } from "@/features/home/lib/home-data";
import { isMobileUserAgentRequest } from "@/lib/mobile/is-mobile-request";
import { VERTICALS } from "@/features/verticals/verticals";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  buildPageMetadata,
} from "@/shared/seo/seo.config";

// Legacy HeroSection intentionally kept in codebase but not rendered.

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default async function HomePage() {
  const user = await getCurrentUser();
  const mobile = await isMobileUserAgentRequest();
  const data = await getHomePageData({ mobile });
  const favoriteListingIds = user ? await getUserFavoriteListingIds(user.id) : [];
  const headerUser = user ? { id: user.id, name: user.name, role: user.role } : null;
  const createListingHref = getCreateListingHref(headerUser);
  const isAuthenticated = user !== null;

  return (
    <main className="min-w-0 overflow-x-clip bg-[#F6F8FB] dark:bg-slate-950">
      <RecentListingsSection
        listings={data.latest}
        isAuthenticated={isAuthenticated}
        favoriteListingIds={favoriteListingIds}
        createListingHref={createListingHref}
      />

      <div className="hidden sm:contents">
        <HomeDiscoverySection
          titleKey="home.popularMarket"
          descriptionKey="home.sectionMarketDesc"
          viewAllHref={VERTICALS.MARKET.href}
          listings={data.popularMarket}
          emptyCategories={data.emptyCategories.market}
          isAuthenticated={isAuthenticated}
          favoriteListingIds={favoriteListingIds}
          createListingHref={VERTICALS.MARKET.createListingHref}
          tone="muted"
        />

        <HomeDiscoverySection
          titleKey="home.wholesaleOffers"
          descriptionKey="home.sectionOptDesc"
          viewAllHref={VERTICALS.OPT.href}
          listings={data.opt}
          emptyCategories={data.emptyCategories.opt}
          isAuthenticated={isAuthenticated}
          favoriteListingIds={favoriteListingIds}
          createListingHref={VERTICALS.OPT.createListingHref}
          tone="white"
        />

        <HomeDiscoverySection
          titleKey="home.services"
          descriptionKey="home.sectionServicesDesc"
          viewAllHref={VERTICALS.SERVICES.href}
          listings={data.services}
          emptyCategories={data.emptyCategories.services}
          isAuthenticated={isAuthenticated}
          favoriteListingIds={favoriteListingIds}
          createListingHref={VERTICALS.SERVICES.createListingHref}
          tone="muted"
        />

        <HomeDiscoverySection
          titleKey="home.cargo"
          descriptionKey="home.sectionCargoDesc"
          viewAllHref={VERTICALS.CARGO.href}
          listings={data.cargo}
          emptyCategories={data.emptyCategories.cargo}
          isAuthenticated={isAuthenticated}
          favoriteListingIds={favoriteListingIds}
          createListingHref={VERTICALS.CARGO.createListingHref}
          tone="white"
        />
      </div>

      <div className="hidden sm:block">
        <HomeWhyVsetutSection />
        <SellerCtaSection createListingHref={createListingHref} />
      </div>
    </main>
  );
}
