"use client";

import type { MouseEvent } from "react";
import type { ListingVertical } from "@prisma/client";
import Link from "next/link";
import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { buildSellerProfileHref } from "@/features/sellers/lib/seller-vertical-profile";
import { trackSellerOtherListingClick } from "@/lib/analytics/events";

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
            className="text-lg font-bold text-[#0F172A] sm:text-xl"
          >
            Другие объявления продавца
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Посмотрите ещё предложения этого продавца
          </p>
        </div>

        <Link
          href={buildSellerProfileHref(sellerId)}
          className="w-fit text-sm font-semibold text-[#2563EB] underline-offset-2 hover:underline"
        >
          Все объявления продавца
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
