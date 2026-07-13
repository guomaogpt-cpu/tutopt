import Link from "next/link";
import { Heart } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { Button } from "@/components/ui/button";

type BuyerFavoritesSectionProps = {
  listings: ListingCardData[];
  favoriteListingIds: string[];
};

export function BuyerFavoritesSection({
  listings,
  favoriteListingIds,
}: BuyerFavoritesSectionProps) {
  const favoriteIds = new Set(favoriteListingIds);

  return (
    <section aria-labelledby="buyer-favorites-title" className="mt-8 lg:mt-10">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="buyer-favorites-title" className="text-lg font-bold text-[#0F172A] sm:text-xl">
          Избранные товары
        </h2>
        {listings.length > 0 ? (
          <Link
            href="/favorites"
            className="text-sm font-medium text-[#2563EB] transition hover:text-[#1D4ED8]"
          >
            Смотреть всё
          </Link>
        ) : null}
      </div>

      {listings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
            <Heart className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-5 text-base font-semibold text-[#0F172A]">В избранном пока пусто</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
            Сохраняйте интересные объявления, чтобы быстро вернуться к ним.
          </p>
          <Button asChild className="mt-6 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Link href="/listings">Открыть каталог</Link>
          </Button>
        </div>
      ) : (
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
      )}
    </section>
  );
}
