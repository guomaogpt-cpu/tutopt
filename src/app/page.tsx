import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { RecentListingsSection } from "@/components/home/RecentListingsSection";
import { SellerCtaSection } from "@/components/home/SellerCtaSection";
import { getHomePageData } from "@/features/home/lib/home-data";

export default async function HomePage() {
  const { categories, listings } = await getHomePageData();

  return (
    <main className="bg-white">
      <HeroSection />
      <CategoryGrid categories={categories} />
      <RecentListingsSection listings={listings} />
      <SellerCtaSection />
      <HowItWorksSection />
    </main>
  );
}
