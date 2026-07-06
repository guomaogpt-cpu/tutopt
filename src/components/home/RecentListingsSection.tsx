import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ListingCard } from "@/components/listings/ListingCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";

type RecentListingsSectionProps = {
  listings: ListingCardData[];
  isAuthenticated?: boolean;
  favoriteListingIds?: string[];
  createListingHref: string;
};

const focusRingClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

export function RecentListingsSection({
  listings,
  isAuthenticated = false,
  favoriteListingIds = [],
  createListingHref,
}: RecentListingsSectionProps) {
  const favoriteIds = new Set(favoriteListingIds);
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-12 sm:py-16">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="Новые объявления"
            description="Свежие опубликованные предложения от поставщиков."
          />
          {listings.length > 0 ? (
            <Link
              href="/listings"
              className={`shrink-0 text-sm font-medium text-blue-600 transition hover:text-blue-700 ${focusRingClassName}`}
            >
              Весь каталог →
            </Link>
          ) : null}
        </div>

        {listings.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
            <p className="text-base font-medium text-slate-900">
              Пока нет опубликованных объявлений
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
              Станьте первым поставщиком на площадке — разместите предложение и дождитесь модерации.
            </p>
            <Link
              href={createListingHref}
              className={`mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 ${focusRingClassName}`}
            >
              Подать объявление
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      </Container>
    </section>
  );
}
