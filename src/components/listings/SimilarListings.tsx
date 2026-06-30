import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";

type SimilarListingsProps = {
  listings: ListingCardData[];
};

export function SimilarListings({ listings }: SimilarListingsProps) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 lg:mt-16">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Похожие товары</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
