import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { Section, SectionHeader, SectionTitle } from "@/components/ui/section";

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
    <Section spacing="none" className="mt-12 lg:mt-16" aria-labelledby="similar-listings-title">
      <SectionHeader className="mb-6">
        <SectionTitle id="similar-listings-title">Похожие товары</SectionTitle>
      </SectionHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            isAuthenticated={isAuthenticated}
            isFavorited={favoriteIds.has(listing.id)}
          />
        ))}
      </div>
    </Section>
  );
}
