import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";

type HomeListingsGridProps = {
  listings: ListingCardData[];
  isAuthenticated?: boolean;
  favoriteListingIds?: string[];
};

export function HomeListingsGrid({
  listings,
  isAuthenticated = false,
  favoriteListingIds = [],
}: HomeListingsGridProps) {
  const favoriteIds = new Set(favoriteListingIds);

  return (
    <div className="grid w-full min-w-0 grid-cols-2 gap-3.5 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {listings.map((listing) => (
        <div key={listing.id} className="min-w-0 w-full">
          <ListingCard
            listing={listing}
            isAuthenticated={isAuthenticated}
            isFavorited={favoriteIds.has(listing.id)}
            variant="home"
          />
        </div>
      ))}
    </div>
  );
}

type RecentListingsSectionProps = {
  listings: ListingCardData[];
  isAuthenticated?: boolean;
  favoriteListingIds?: string[];
  createListingHref: string;
};

export function RecentListingsSection({
  listings,
  isAuthenticated = false,
  favoriteListingIds = [],
  createListingHref,
}: RecentListingsSectionProps) {
  return (
    <section data-home-section="listings" className="bg-white pb-5 pt-2 sm:pt-3">
      <Container size="lg">
        <div className="mb-3 flex items-end justify-between gap-3 sm:mb-3.5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
              Витрина
            </p>
            <h2 className="mt-0.5 text-lg font-bold tracking-tight text-[#0F172A] sm:text-xl">
              Новые объявления
            </h2>
          </div>
          {listings.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl border-[rgba(148,163,184,0.22)] bg-white font-semibold text-[#2563EB] hover:bg-[#EFF6FF]"
              asChild
            >
              <Link href="/listings">
                Смотреть все
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>

        {listings.length === 0 ? (
          <EmptyState
            title="Пока нет опубликованных объявлений"
            description="Разместите объявление бесплатно и дождитесь модерации — оно появится в каталоге."
            className="border-[#E5E7EB] bg-white"
            action={
              <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]" asChild>
                <Link href={createListingHref}>Подать объявление</Link>
              </Button>
            }
          />
        ) : (
          <HomeListingsGrid
            listings={listings}
            isAuthenticated={isAuthenticated}
            favoriteListingIds={favoriteListingIds}
          />
        )}
      </Container>
    </section>
  );
}

type HomeMoreListingsSectionProps = {
  listings: ListingCardData[];
  isAuthenticated?: boolean;
  favoriteListingIds?: string[];
};

export function HomeMoreListingsSection({
  listings,
  isAuthenticated = false,
  favoriteListingIds = [],
}: HomeMoreListingsSectionProps) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <section className="bg-white pb-8 pt-0">
      <Container size="lg">
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight text-[#0F172A] sm:text-xl">
            Последние добавленные
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-[rgba(148,163,184,0.22)] bg-white font-semibold text-[#2563EB] hover:bg-[#EFF6FF]"
            asChild
          >
            <Link href="/listings">
              Смотреть все
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <HomeListingsGrid
          listings={listings}
          isAuthenticated={isAuthenticated}
          favoriteListingIds={favoriteListingIds}
        />
      </Container>
    </section>
  );
}
