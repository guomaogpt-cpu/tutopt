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

// Legacy HeroSection intentionally kept in codebase but not rendered.

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
