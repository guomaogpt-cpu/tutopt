"use client";

import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { Camera, SearchX } from "lucide-react";
import { PhotoSearchButton } from "@/components/search/PhotoSearchButton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCatalogVerticalCopy } from "@/features/listings/lib/listing-display";
import { VERTICALS } from "@/features/verticals/verticals";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getVerticalTheme } from "@/lib/vertical-theme";
import { cn } from "@/lib/utils";

type ListingsEmptyStateProps = {
  hasActiveFilters: boolean;
  createListingHref: string;
  showCreateListingCTA?: boolean;
  vertical?: ListingVertical | null;
  photoSearch?: boolean;
};

export function ListingsEmptyState({
  hasActiveFilters,
  createListingHref,
  showCreateListingCTA = true,
  vertical = null,
  photoSearch = false,
}: ListingsEmptyStateProps) {
  const { t } = useTranslation();
  const copy = getCatalogVerticalCopy(vertical);
  const theme = getVerticalTheme(vertical);
  const createHref =
    vertical && !createListingHref.includes("vertical=")
      ? VERTICALS[vertical].createListingHref
      : createListingHref;
  const resetHref = vertical ? `/listings?vertical=${vertical}` : "/listings";

  if (photoSearch) {
    return (
      <EmptyState
        icon={Camera}
        title={t("listings.photoSearch.emptyTitle")}
        description={t("listings.photoSearch.emptyDescription")}
        className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.03)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        action={
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <PhotoSearchButton
              vertical={vertical}
              triggerVariant="button"
              triggerLabelKey="listings.photoSearch.newSearch"
            />
            <Button
              variant="outline"
              className="h-11 rounded-xl border-slate-200 dark:border-slate-700"
              asChild
            >
              <Link href="/listings">{t("listings.allListings")}</Link>
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <EmptyState
      icon={SearchX}
      title={
        hasActiveFilters
          ? vertical === "SERVICES"
            ? t("services.emptyFilteredTitle")
            : vertical === "OPT"
              ? t("opt.emptyFilteredTitle")
              : t("listings.emptyFilteredTitle")
          : vertical === "SERVICES"
            ? t("services.emptyTitle")
            : copy.emptyTitle
      }
      description={
        hasActiveFilters
          ? vertical === "SERVICES"
            ? t("services.emptyFilteredDescription")
            : vertical === "OPT"
              ? t("opt.emptyFilteredDescription")
              : t("listings.emptyFilteredDescription")
          : vertical === "SERVICES"
            ? t("services.emptyDescription")
            : copy.emptyDescription
      }
      className="mt-8 rounded-2xl border border-[rgba(148,163,184,0.16)] bg-white shadow-[0_4px_14px_rgba(15,23,42,0.03)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
      action={
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {hasActiveFilters ? (
            <>
              <Button
                variant="outline"
                className="h-11 rounded-xl border-[rgba(148,163,184,0.25)] dark:border-slate-700"
                asChild
              >
                <Link href={resetHref}>
                  {t("filters.reset")}
                </Link>
              </Button>
              <Button
                className={cn("h-11 rounded-xl", theme.primaryButton)}
                asChild
              >
                <Link href={createHref}>
                  {vertical === "SERVICES"
                    ? t("services.postService")
                    : vertical === "MARKET"
                      ? t("vertical.postListing")
                      : vertical === "OPT"
                        ? t("opt.postOffer")
                        : t("listings.allListings")}
                </Link>
              </Button>
            </>
          ) : showCreateListingCTA ? (
            <Button className={cn("h-11 rounded-xl", theme.primaryButton)} asChild>
              <Link href={createHref}>
                {vertical === "SERVICES"
                  ? t("services.postService")
                  : vertical === "OPT"
                    ? t("opt.postOffer")
                    : t("catalog.addListing")}
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="h-11 rounded-xl border-slate-200 dark:border-slate-700"
              asChild
            >
              <Link href="/listings">
                {vertical === "SERVICES"
                  ? t("services.allServices")
                  : t("listings.allListings")}
              </Link>
            </Button>
          )}
        </div>
      }
    />
  );
}
