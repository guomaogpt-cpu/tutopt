import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { RecentListingsSection } from "@/components/home/RecentListingsSection";
import { SellerCtaSection } from "@/components/home/SellerCtaSection";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getCreateListingHref } from "@/features/auth/lib/login-redirect";
import { getUserFavoriteListingIds } from "@/features/favorites/lib/favorites-data";
import { getHomePageData } from "@/features/home/lib/home-data";

export default async function HomePage() {
  const user = await getCurrentUser();
  const { categories, listings } = await getHomePageData();
  const favoriteListingIds = user ? await getUserFavoriteListingIds(user.id) : [];
  const headerUser = user ? { id: user.id, name: user.name, role: user.role } : null;
  const createListingHref = getCreateListingHref(headerUser);

  return (
    <main className="bg-white">
      <HeroSection createListingHref={createListingHref} />
      <CategoryGrid categories={categories} />
      <RecentListingsSection
        listings={listings}
        isAuthenticated={user !== null}
        favoriteListingIds={favoriteListingIds}
        createListingHref={createListingHref}
      />
      <SellerCtaSection createListingHref={createListingHref} />
      <HowItWorksSection />
    </main>
  );
}
