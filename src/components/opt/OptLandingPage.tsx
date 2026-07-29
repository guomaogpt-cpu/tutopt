import { ListingCard } from "@/components/listings/ListingCard";
import {
  OptCompactHero,
  type OptCategoryItem,
} from "@/components/opt/OptCompactHero";
import { Container } from "@/components/ui/container";
import {
  VerticalEmptyState,
  VerticalLatestHeading,
} from "@/components/verticals/VerticalLatestSectionLabels";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { VERTICAL_LATEST_LISTINGS_GRID_CLASS } from "@/features/verticals/vertical-landing-ui";
import { VERTICALS } from "@/features/verticals/verticals";

type OptLandingPageProps = {
  categories: OptCategoryItem[];
  listings: ListingCardData[];
};

export function OptLandingPage({ categories, listings }: OptLandingPageProps) {
  const config = VERTICALS.OPT;

  return (
    <main className="min-w-0 overflow-x-clip bg-gradient-to-b from-blue-50/50 to-slate-50 dark:from-slate-950 dark:to-slate-950">
      <OptCompactHero categories={categories} />

      <Container size="lg" className="py-8 sm:py-10">
        <section aria-labelledby="opt-listings-heading">
          <VerticalLatestHeading
            headingId="opt-listings-heading"
            listingsHref={config.listingsHref}
            showAllLink={listings.length > 0}
            linkClassName="shrink-0 text-sm font-medium text-blue-700 hover:underline"
          />

          {listings.length === 0 ? (
            <VerticalEmptyState emptyKey="vertical.emptyOpt" />
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
