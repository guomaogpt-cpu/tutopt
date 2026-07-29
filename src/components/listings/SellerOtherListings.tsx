"use client";

import type { MouseEvent } from "react";
import type { ListingVertical } from "@prisma/client";
import Link from "next/link";
import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { buildSellerProfileHref } from "@/features/sellers/lib/seller-vertical-profile";
import { trackSellerOtherListingClick } from "@/lib/analytics/events";
import { useTranslation } from "@/lib/i18n/useTranslation";

type SellerOtherListingsProps = {
  listings: ListingCardData[];
  sellerId: string;
  sourceVertical: ListingVertical;
  isAuthenticated?: boolean;
  favoriteListingIds?: string[];
};

export function SellerOtherListings({
  listings,
  sellerId,
  sourceVertical,
  isAuthenticated = false,
  favoriteListingIds = [],
}: SellerOtherListingsProps) {
  const { t } = useTranslation();
  const favoriteIds = new Set(favoriteListingIds);

  if (listings.length === 0) {
    return null;
  }

  function handleCardClick(listing: ListingCardData, event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element) || !target.closest('a[href^="/listings/"]')) {
      return;
    }

    trackSellerOtherListingClick(sourceVertical, listing.vertical);
  }

  return (
    <section className="mt-10 lg:mt-14" aria-labelledby="seller-other-listings-title">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="seller-other-listings-title"
            className="text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100"
          >
            {t("listing.otherSellerListings")}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("listing.otherSellerListingsDescription")}
          </p>
        </div>

        <Link
          href={buildSellerProfileHref(sellerId)}
          className="w-fit text-sm font-semibold text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
        >
          {t("listing.viewSellerListings")}
        </Link>
      </div>

      <div className="grid w-full min-w-0 grid-cols-2 gap-3.5 max-[339px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
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
