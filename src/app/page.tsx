import { ForWhomSection } from "@/components/home/ForWhomSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PopularListings } from "@/components/home/PopularListings";
import { QuickCategories } from "@/components/home/QuickCategories";
import { SellerCtaSection } from "@/components/home/SellerCtaSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <QuickCategories />
      <PopularListings />
      <ForWhomSection />
      <HowItWorksSection />
      <SellerCtaSection />
    </main>
  );
}
