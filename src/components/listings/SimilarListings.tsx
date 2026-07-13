import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";

type SimilarListingsProps = {
  listings: ListingCardData[];
  isAuthenticated?: boolean;
  favoriteListingIds?: string[];
};

export function SimilarListings({
  listings,
  isAuthenticated = false,
  favoriteListingIds = [],
}: SimilarListingsProps) {
  const favoriteIds = new Set(favoriteListingIds);

  if (listings.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 lg:mt-14" aria-labelledby="similar-listings-title">
      <h2
        id="similar-listings-title"
        className="mb-5 text-lg font-bold text-[#0F172A] sm:text-xl"
      >
        Похожие объявления
      </h2>

      <div className="grid w-full min-w-0 grid-cols-2 gap-3 max-[339px]:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {listings.map((listing) => (
          <div key={listing.id} className="min-w-0 w-full">
            <ListingCard
              listing={listing}
              isAuthenticated={isAuthenticated}
              isFavorited={favoriteIds.has(listing.id)}
              variant="catalog"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
