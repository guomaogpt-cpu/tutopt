import {
  CargoCompactHero,
  type CargoCategoryItem,
} from "@/components/cargo/CargoCompactHero";
import { CargoCompaniesSection } from "@/components/cargo/CargoCompaniesSection";
import { CargoPublicRequests } from "@/components/cargo/CargoPublicRequests";
import { CargoRequestForm } from "@/components/cargo/CargoRequestForm";
import { Container } from "@/components/ui/container";
import type { PublicCargoRequestCard } from "@/features/cargo/lib/cargo-requests-data";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";

type CargoLandingPageProps = {
  categories: CargoCategoryItem[];
  listings: ListingCardData[];
  recentRequests: PublicCargoRequestCard[];
};

export function CargoLandingPage({
  categories,
  listings,
  recentRequests,
}: CargoLandingPageProps) {
  return (
    <main className="min-w-0 overflow-x-clip bg-gradient-to-b from-rose-50/60 to-slate-50 dark:from-slate-950 dark:to-slate-950">
      <CargoCompactHero categories={categories} />

      <Container size="lg" className="py-8 sm:py-10">
        <section aria-labelledby="cargo-request-heading" className="max-w-3xl">
          <h2 id="cargo-request-heading" className="sr-only">
            Cargo request
          </h2>
          <CargoRequestForm />
        </section>

        <CargoPublicRequests requests={recentRequests} />

        <CargoCompaniesSection listings={listings} />
      </Container>
    </main>
  );
}
