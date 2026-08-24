"use client";

import type { ListingVertical } from "@prisma/client";
import { ListingCard } from "@/components/listings/ListingCard";
import { LISTING_CARD_GRID_CLASS } from "@/components/listings/listing-card-grid";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { trackSimilarListingClick } from "@/lib/analytics/events";
import { useTranslation } from "@/lib/i18n/useTranslation";

type SimilarListingsProps = {
  listings: ListingCardData[];
  isAuthenticated?: boolean;
  favoriteListingIds?: string[];
  sourceVertical?: ListingVertical | null;
  sameCategoryIds?: string[];
};

export function SimilarListings({
  listings,
  isAuthenticated = false,
  favoriteListingIds = [],
  sourceVertical = null,
  sameCategoryIds = [],
}: SimilarListingsProps) {
  const { t } = useTranslation();
  const favoriteIds = new Set(favoriteListingIds);
  const sameCategorySet = new Set(sameCategoryIds);

  if (listings.length === 0) {
    return null;
  }

  function handleCardClick(listing: ListingCardData, event: React.MouseEvent) {
    if (!sourceVertical) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element) || !target.closest('a[href^="/listings/"]')) {
      return;
    }

    trackSimilarListingClick({
      sourceVertical,
      targetVertical: listing.vertical,
      sameCategory: sameCategorySet.has(listing.id),
    });
  }

  return (
    <section className="mt-10 lg:mt-14" aria-labelledby="similar-listings-title">
      <h2
        id="similar-listings-title"
        className="mb-5 text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100"
      >
        {t("listing.similarListings")}
      </h2>

      <div className={LISTING_CARD_GRID_CLASS}>
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="min-w-0 w-full"
            onClickCapture={(event) => handleCardClick(listing, event)}
          >
            <ListingCard
              listing={listing}
              isAuthenticated={isAuthenticated}
              isFavorited={favoriteIds.has(listing.id)}
              variant="home"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
