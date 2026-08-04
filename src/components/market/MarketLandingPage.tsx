"use client";

import Link from "next/link";
import { ListingCard } from "@/components/listings/ListingCard";
import {
  MarketCompactHero,
  type MarketCategoryItem,
} from "@/components/market/MarketCompactHero";
import { MarketCategoryHighlights } from "@/components/market/MarketCategoryHighlights";
import { Container } from "@/components/ui/container";
import { VerticalLatestHeading } from "@/components/verticals/VerticalLatestSectionLabels";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
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
      <MarketCompactHero listingCount={publishedCount} />

      <Container size="lg" className="space-y-8 py-6 sm:space-y-10 sm:py-10">
        <MarketCategoryHighlights categories={categories} />

        <section aria-labelledby="market-listings-heading">
          <VerticalLatestHeading
            headingId="market-listings-heading"
            listingsHref={config.listingsHref}
            showAllLink={listings.length > 0}
            linkClassName={cn("shrink-0 text-sm font-medium hover:underline", theme.softLink)}
          />

          {listings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Пока нет объявлений. Разместите первое объявление или вернитесь позже.
              </p>
              <div className="mt-5 flex justify-center">
                <Link
                  href={config.createListingHref}
                  className={cn(
                    "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white",
                    theme.primaryButton,
                  )}
                >
                  Подать объявление
                </Link>
              </div>
            </div>
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
