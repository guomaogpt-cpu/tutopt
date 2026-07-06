import Link from "next/link";
import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";

type BuyerRecentViewsSectionProps = {
  listings: ListingCardData[];
  favoriteListingIds: string[];
};

export function BuyerRecentViewsSection({
  listings,
  favoriteListingIds,
}: BuyerRecentViewsSectionProps) {
  const favoriteIds = new Set(favoriteListingIds);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Недавно просмотренные</h2>

      {listings.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          Вы ещё не просматривали объявления.{" "}
          <Link href="/listings" className="font-medium text-blue-600 hover:text-blue-700">
            Открыть каталог
          </Link>
        </p>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isAuthenticated
              isFavorited={favoriteIds.has(listing.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
