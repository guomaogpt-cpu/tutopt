"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import type { HomeCategoryCard } from "@/features/home/lib/home-data";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type HomeListingsGridProps = {
  listings: ListingCardData[];
  isAuthenticated?: boolean;
  favoriteListingIds?: string[];
  compact?: boolean;
};

export function HomeListingsGrid({
  listings,
  isAuthenticated = false,
  favoriteListingIds = [],
  compact = false,
}: HomeListingsGridProps) {
  const favoriteIds = new Set(favoriteListingIds);

  return (
    <div
      className={cn(
        "grid w-full min-w-0 grid-cols-2 gap-3.5 max-[339px]:grid-cols-1 md:gap-4",
        compact
          ? "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          : "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
      )}
    >
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

type HomeDiscoverySectionProps = {
  titleKey: DictionaryKey;
  descriptionKey?: DictionaryKey;
  viewAllHref: string;
  listings: ListingCardData[];
  emptyCategories?: HomeCategoryCard[];
  isAuthenticated?: boolean;
  favoriteListingIds?: string[];
  createListingHref: string;
  eyebrow?: DictionaryKey;
  tone?: "white" | "muted";
};

export function HomeDiscoverySection({
  titleKey,
  descriptionKey,
  viewAllHref,
  listings,
  emptyCategories = [],
  isAuthenticated = false,
  favoriteListingIds = [],
  createListingHref,
  eyebrow,
  tone = "white",
}: HomeDiscoverySectionProps) {
  const { t } = useTranslation();

  return (
    <section
      className={cn(
        "pb-8 pt-6 sm:pb-10 sm:pt-8",
        tone === "muted" ? "bg-[#F8FAFC] dark:bg-slate-950" : "bg-white dark:bg-slate-950",
      )}
    >
      <Container size="lg">
        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {t(eyebrow)}
              </p>
            ) : null}
            <h2 className="mt-0.5 text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-100">
              {t(titleKey)}
            </h2>
            {descriptionKey ? (
              <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                {t(descriptionKey)}
              </p>
            ) : null}
          </div>
          {listings.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              className="h-10 shrink-0 rounded-xl border-slate-200 bg-white font-semibold text-blue-600 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800"
              asChild
            >
              <Link href={viewAllHref}>
                {t("home.viewAll")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <EmptyState
              title={t("home.emptySectionTitle")}
              description={t("home.emptySectionDescription")}
              className="border-0 bg-transparent p-0 shadow-none"
              action={
                <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href={createListingHref}>{t("home.postListing")}</Link>
                </Button>
              }
            />
            {emptyCategories.length > 0 ? (
              <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {emptyCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/listings?vertical=${category.vertical}&category=${category.id}`}
                      className="flex min-h-[72px] items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-blue-700"
                    >
                      <span className="line-clamp-2">{category.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <HomeListingsGrid
            listings={listings}
            isAuthenticated={isAuthenticated}
            favoriteListingIds={favoriteListingIds}
            compact
          />
        )}
      </Container>
    </section>
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
    <HomeDiscoverySection
      eyebrow="home.showcase"
      titleKey="home.latestListings"
      viewAllHref="/listings"
      listings={listings}
      isAuthenticated={isAuthenticated}
      favoriteListingIds={favoriteListingIds}
      createListingHref={createListingHref}
      tone="white"
    />
  );
}

type HomeMoreListingsSectionProps = {
  listings: ListingCardData[];
  isAuthenticated?: boolean;
  favoriteListingIds?: string[];
};

/** @deprecated Prefer HomeDiscoverySection vertical blocks. */
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
          <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-100">
            {t("home.moreListings")}
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-slate-200 bg-white font-semibold text-blue-600 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800"
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
