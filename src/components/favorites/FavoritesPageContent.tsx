"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, LayoutGrid } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type FavoritesPageContentProps = {
  initialListings: ListingCardData[];
  initialLastAddedAt: string | null;
};

function formatLastAddedDate(value: string): string {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function FavoritesPageContent({
  initialListings,
  initialLastAddedAt,
}: FavoritesPageContentProps) {
  const { t } = useTranslation();
  const [listings, setListings] = useState(initialListings);

  function handleFavoriteChange(listingId: string, isFavorited: boolean) {
    if (!isFavorited) {
      setListings((current) => current.filter((listing) => listing.id !== listingId));
    }
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white px-6 py-12 text-center shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB] dark:bg-slate-800 dark:text-blue-400">
          <Heart className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-base font-semibold text-[#0F172A] sm:text-lg dark:text-slate-100">
          {t("favorites.emptyTitle")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B] dark:text-slate-400">
          {t("favorites.emptyDescription")}
        </p>
        <Button asChild className="mt-6 h-11 rounded-xl">
          <Link href="/listings">{t("favorites.findListings")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "flex flex-col gap-4 rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
          "dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
          "sm:flex-row sm:items-center sm:justify-between sm:p-5",
        )}
      >
        <div className="min-w-0">
          <p className="text-sm text-[#64748B] dark:text-slate-400">{t("favorites.total")}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-slate-100">
            {listings.length}
          </p>
          {initialLastAddedAt ? (
            <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">
              {t("favorites.lastAdded")} {formatLastAddedDate(initialLastAddedAt)}
            </p>
          ) : null}
        </div>

        <Button
          asChild
          variant="outline"
          className="h-11 w-full shrink-0 rounded-xl border-[rgba(148,163,184,0.25)] sm:w-auto"
        >
          <Link href="/listings">
            <LayoutGrid className="size-4" aria-hidden="true" />
            {t("catalog.openCatalog")}
          </Link>
        </Button>
      </div>

      <div className="grid w-full min-w-0 grid-cols-2 gap-3.5 max-[339px]:grid-cols-1 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {listings.map((listing) => (
          <div key={listing.id} className="min-w-0 w-full">
            <ListingCard
              listing={listing}
              isAuthenticated
              isFavorited
              variant="catalog"
              onFavoriteChange={(isFavorited) => handleFavoriteChange(listing.id, isFavorited)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
