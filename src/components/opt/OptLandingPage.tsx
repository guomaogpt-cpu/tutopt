"use client";

import { ListingCard } from "@/components/listings/ListingCard";
import { OptCategoryHighlights } from "@/components/opt/OptCategoryHighlights";
import {
  OptCompactHero,
  type OptCategoryItem,
} from "@/components/opt/OptCompactHero";
import { OptForBusiness } from "@/components/opt/OptForBusiness";
import { Container } from "@/components/ui/container";
import {
  VerticalEmptyState,
  VerticalLatestHeading,
} from "@/components/verticals/VerticalLatestSectionLabels";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { VERTICAL_LATEST_LISTINGS_GRID_CLASS } from "@/features/verticals/vertical-landing-ui";
import { VERTICALS } from "@/features/verticals/verticals";
import { getVerticalTheme } from "@/lib/vertical-theme";
import { cn } from "@/lib/utils";

type OptLandingPageProps = {
  categories: OptCategoryItem[];
  listings: ListingCardData[];
};

export function OptLandingPage({ categories, listings }: OptLandingPageProps) {
  const config = VERTICALS.OPT;
  const theme = getVerticalTheme("OPT");

  return (
    <main
      className={cn(
        "min-w-0 overflow-x-clip bg-gradient-to-b dark:from-slate-950 dark:to-slate-950",
        theme.pageWash,
      )}
    >
      <OptCompactHero categories={categories} />

      <Container size="lg" className="space-y-8 py-6 sm:space-y-10 sm:py-10">
        <OptCategoryHighlights categories={categories} />

        <section aria-labelledby="opt-listings-heading">
          <VerticalLatestHeading
            headingId="opt-listings-heading"
            listingsHref={config.listingsHref}
            showAllLink={listings.length > 0}
            linkClassName={cn("shrink-0 text-sm font-medium hover:underline", theme.softLink)}
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

        <OptForBusiness />
      </Container>
    </main>
  );
}
