import Link from "next/link";
import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";

type SellerProfileListingsProps = {
  listings: ListingCardData[];
  isAuthenticated?: boolean;
  favoriteListingIds?: string[];
};

export function SellerProfileListings({
  listings,
  isAuthenticated = false,
  favoriteListingIds = [],
}: SellerProfileListingsProps) {
  const favoriteIds = new Set(favoriteListingIds);

  return (
    <section className="mt-8 lg:mt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Объявления поставщика
        </h2>
        {listings.length > 0 ? (
          <p className="text-sm text-slate-500">
            Опубликовано: <span className="font-medium text-slate-800">{listings.length}</span>
          </p>
        ) : null}
      </div>

      {listings.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-base font-medium text-slate-900">
            У поставщика пока нет опубликованных объявлений
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            Загляните позже или посмотрите предложения других продавцов в каталоге.
          </p>
          <Link
            href="/listings"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <div key={listing.id} className="h-full min-w-0">
              <ListingCard
                listing={listing}
                isAuthenticated={isAuthenticated}
                isFavorited={favoriteIds.has(listing.id)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
