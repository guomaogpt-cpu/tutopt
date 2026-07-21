import { HomepagePaperEntry } from "@/components/home/HomepagePaperEntry";
import {
  HomeMoreListingsSection,
  RecentListingsSection,
} from "@/components/home/HomeListingsSection";
import { SellerCtaSection } from "@/components/home/SellerCtaSection";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getCreateListingHref } from "@/features/auth/lib/login-redirect";
import { getUserFavoriteListingIds } from "@/features/favorites/lib/favorites-data";
import { getHomePageData } from "@/features/home/lib/home-data";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  buildPageMetadata,
} from "@/shared/seo/seo.config";

// Old homepage hero hidden after paper banner entry design
// import { HeroSection } from "@/components/home/HeroSection";

// PNG paper banner kept as reference, active layout is HTML/CSS for responsiveness
// public/images/homepage-paper-banner.png — not rendered on homepage

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default async function HomePage() {
  const user = await getCurrentUser();
  const { listings, moreListings } = await getHomePageData();
  const favoriteListingIds = user ? await getUserFavoriteListingIds(user.id) : [];
  const headerUser = user ? { id: user.id, name: user.name, role: user.role } : null;
  const createListingHref = getCreateListingHref(headerUser);

  return (
    <main className="min-w-0 overflow-x-clip bg-[#F8FAFC]">
      {/* Old homepage hero hidden — paperBoard experiment disabled
      <HeroSection stats={stats} />
      */}
      {/* PNG / paperBoard not used as active layout */}
      <HomepagePaperEntry />
      <RecentListingsSection
        listings={listings}
        isAuthenticated={user !== null}
        favoriteListingIds={favoriteListingIds}
        createListingHref={createListingHref}
      />
      <HomeMoreListingsSection
        listings={moreListings}
        isAuthenticated={user !== null}
        favoriteListingIds={favoriteListingIds}
      />
      <SellerCtaSection createListingHref={createListingHref} />
    </main>
  );
}
