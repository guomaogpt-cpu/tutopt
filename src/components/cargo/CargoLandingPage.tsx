import { ListingCard } from "@/components/listings/ListingCard";
import {
  CargoCompactHero,
  type CargoCategoryItem,
} from "@/components/cargo/CargoCompactHero";
import { Container } from "@/components/ui/container";
import {
  VerticalEmptyState,
  VerticalLatestHeading,
} from "@/components/verticals/VerticalLatestSectionLabels";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { VERTICAL_LATEST_LISTINGS_GRID_CLASS } from "@/features/verticals/vertical-landing-ui";
import { VERTICALS } from "@/features/verticals/verticals";

type CargoLandingPageProps = {
  categories: CargoCategoryItem[];
  listings: ListingCardData[];
};

export function CargoLandingPage({
  categories,
  listings,
}: CargoLandingPageProps) {
  const config = VERTICALS.CARGO;

  return (
    <main className="min-w-0 overflow-x-clip bg-gradient-to-b from-rose-50/60 to-slate-50 dark:from-slate-950 dark:to-slate-950">
      <CargoCompactHero categories={categories} />

      <Container size="lg" className="py-8 sm:py-10">
        <section aria-labelledby="cargo-listings-heading">
          <VerticalLatestHeading
            headingId="cargo-listings-heading"
            listingsHref={config.listingsHref}
            showAllLink={listings.length > 0}
            linkClassName="shrink-0 text-sm font-medium text-rose-700 hover:underline"
          />

          {listings.length === 0 ? (
            <VerticalEmptyState emptyKey="vertical.emptyCargo" />
          ) : (
            <div className={VERTICAL_LATEST_LISTINGS_GRID_CLASS}>
              {listings.map((listing) => (
                <div key={listing.id} className="min-w-0 w-full">
                  <ListingCard listing={listing} variant="catalog" />
                </div>
              ))}
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
