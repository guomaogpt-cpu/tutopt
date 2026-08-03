import { ListingCard } from "@/components/listings/ListingCard";
import {
  MarketCompactHero,
  type MarketCategoryItem,
} from "@/components/market/MarketCompactHero";
import { Container } from "@/components/ui/container";
import { VerticalCategoryHighlights } from "@/components/verticals/VerticalCategoryHighlights";
import {
  VerticalEmptyState,
  VerticalLatestHeading,
} from "@/components/verticals/VerticalLatestSectionLabels";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { getMarketCategoryVisual } from "@/features/market/market-category-visuals";
import { VERTICAL_LATEST_LISTINGS_GRID_CLASS } from "@/features/verticals/vertical-landing-ui";
import { VERTICALS } from "@/features/verticals/verticals";
import { getVerticalTheme } from "@/lib/vertical-theme";
import { cn } from "@/lib/utils";

type MarketLandingPageProps = {
  categories: MarketCategoryItem[];
  listings: ListingCardData[];
  publishedCount: number;
};

export function MarketLandingPage({
  categories,
  listings,
  publishedCount,
}: MarketLandingPageProps) {
  const config = VERTICALS.MARKET;
  const theme = getVerticalTheme("MARKET");

  return (
    <main
      className={cn(
        "min-w-0 overflow-x-clip bg-gradient-to-b dark:from-slate-950 dark:to-slate-950",
        theme.pageWash,
      )}
    >
      <MarketCompactHero
        categories={categories}
        listingCount={publishedCount}
      />

      <Container size="lg" className="space-y-8 py-6 sm:space-y-10 sm:py-10">
        <VerticalCategoryHighlights
          vertical="MARKET"
          categories={categories}
          accent="violet"
          getVisual={getMarketCategoryVisual}
          headingId="market-categories-heading"
          drawerDescription="Выберите категорию объявлений"
        />

        <section aria-labelledby="market-listings-heading">
          <VerticalLatestHeading
            headingId="market-listings-heading"
            listingsHref={config.listingsHref}
            showAllLink={listings.length > 0}
            linkClassName={cn("shrink-0 text-sm font-medium hover:underline", theme.softLink)}
          />

          {listings.length === 0 ? (
            <VerticalEmptyState emptyKey="vertical.emptyMarket" />
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
