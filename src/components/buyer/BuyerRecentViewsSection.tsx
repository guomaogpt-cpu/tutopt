import Link from "next/link";
import { Eye } from "lucide-react";
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
  if (listings.length === 0) {
    return null;
  }

  const favoriteIds = new Set(favoriteListingIds);

  return (
    <section aria-labelledby="buyer-recent-views-title" className="mt-8 lg:mt-10">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="buyer-recent-views-title" className="text-lg font-bold text-[#0F172A] sm:text-xl">
          Недавно просмотренные
        </h2>
        <p className="inline-flex items-center gap-1.5 text-sm text-[#64748B]">
          <Eye className="size-4" aria-hidden="true" />
          Последние просмотры
        </p>
      </div>

      <div className="grid w-full min-w-0 grid-cols-2 gap-3 max-[339px]:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {listings.map((listing) => (
          <div key={listing.id} className="min-w-0 w-full">
            <ListingCard
              listing={listing}
              isAuthenticated
              isFavorited={favoriteIds.has(listing.id)}
              variant="catalog"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 sm:hidden">
        <Link
          href="/listings"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[rgba(148,163,184,0.25)] bg-white text-sm font-semibold text-[#334155]"
        >
          Перейти в каталог
        </Link>
      </div>
    </section>
  );
}
