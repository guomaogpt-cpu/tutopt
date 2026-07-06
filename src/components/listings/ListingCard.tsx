import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { listingUnitOptions } from "@/features/listings/constants";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";

type ListingCardProps = {
  listing: ListingCardData;
  isAuthenticated?: boolean;
  isFavorited?: boolean;
};

function formatPublishedDate(listing: ListingCardData): string {
  const date = listing.published_at ?? listing.created_at;
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ListingCard({
  listing,
  isAuthenticated = false,
  isFavorited = false,
}: ListingCardProps) {
  const mainImage = listing.images[0]?.url;
  const unitLabel =
    listingUnitOptions.find((option) => option.value === listing.unit)?.label ??
    listing.unit.toLowerCase();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="relative">
        <Link href={`/listings/${listing.id}`} className="relative block">
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={listing.title}
                fill
                unoptimized
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Нет фото
              </div>
            )}
          </div>
        </Link>

        <FavoriteButton
          listingId={listing.id}
          isAuthenticated={isAuthenticated}
          initialIsFavorited={isFavorited}
          variant="icon"
          className="absolute right-3 top-3 z-10"
        />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
          {listing.category.name}
        </p>

        <h2 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-slate-900">
          <Link
            href={`/listings/${listing.id}`}
            className="transition hover:text-blue-600"
          >
            {listing.title}
          </Link>
        </h2>

        <p className="mt-3 text-lg font-bold text-slate-900">
          {listing.price.toString()} {listing.currency}
        </p>

        <dl className="mt-3 space-y-1.5 text-sm text-slate-600">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Мин. партия</dt>
            <dd className="font-medium text-slate-800">
              {listing.moq} {unitLabel.toLowerCase()}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Город</dt>
            <dd className="font-medium text-slate-800">{listing.city?.name ?? "—"}</dd>
          </div>
          {listing.brand ? (
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Бренд</dt>
              <dd className="font-medium text-slate-800">{listing.brand.name}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-auto border-t border-slate-100 pt-4">
          <p className="truncate text-sm font-medium text-slate-800">
            {listing.sellerProfile.company_name}
          </p>
          <p className="mt-1 text-xs text-slate-500">{formatPublishedDate(listing)}</p>
        </div>
      </div>
    </article>
  );
}
