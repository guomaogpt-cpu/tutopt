"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { useTranslation } from "@/lib/i18n/useTranslation";

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
    <div className="grid w-full min-w-0 grid-cols-2 gap-3.5 max-[339px]:grid-cols-1 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
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
  const { t } = useTranslation();

  return (
    <section
      data-home-section="listings"
      className="bg-white pb-5 pt-3 sm:pt-4 dark:bg-slate-950"
    >
      <Container size="lg">
        <div className="mb-3.5 flex items-end justify-between gap-3 sm:mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB] dark:text-blue-400">
              {t("home.showcase")}
            </p>
            <h2 className="mt-0.5 text-lg font-bold tracking-tight text-[#0F172A] sm:text-xl dark:text-slate-100">
              {t("home.newListings")}
            </h2>
          </div>
          {listings.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl border-[rgba(148,163,184,0.22)] bg-white font-semibold text-[#2563EB] hover:bg-[#EFF6FF] dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800"
              asChild
            >
              <Link href="/listings">
                {t("home.viewAll")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>

        {listings.length === 0 ? (
          <EmptyState
            title={t("home.emptyTitle")}
            description={t("home.emptyDescription")}
            className="border-[#E5E7EB] bg-white dark:border-slate-800 dark:bg-slate-900"
            action={
              <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]" asChild>
                <Link href={createListingHref}>{t("vertical.postListing")}</Link>
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
  const { t } = useTranslation();

  if (listings.length === 0) {
    return null;
  }

  return (
    <section className="bg-white pb-8 pt-0 dark:bg-slate-950">
      <Container size="lg">
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight text-[#0F172A] sm:text-xl dark:text-slate-100">
            {t("home.moreListings")}
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-[rgba(148,163,184,0.22)] bg-white font-semibold text-[#2563EB] hover:bg-[#EFF6FF] dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800"
            asChild
          >
            <Link href="/listings">
              {t("home.viewAll")}
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
