"use client";

import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { Package } from "lucide-react";
import type { SellerListingsStatusFilter } from "@/features/sellers/lib/seller-listings";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { getVerticalTheme } from "@/lib/vertical-theme";
import { cn } from "@/lib/utils";

type AccountListingsEmptyStateProps = {
  hasFilters: boolean;
  vertical?: ListingVertical | null;
  statusFilter?: SellerListingsStatusFilter;
};

function getFilterEmptyKey(
  statusFilter: SellerListingsStatusFilter,
): "accountListings.emptyActive" | "accountListings.emptyPending" | "accountListings.emptyRejected" | "accountListings.emptyArchived" | "accountListings.emptyDraft" | null {
  switch (statusFilter) {
    case "active":
      return "accountListings.emptyActive";
    case "pending":
      return "accountListings.emptyPending";
    case "rejected":
      return "accountListings.emptyRejected";
    case "archived":
      return "accountListings.emptyArchived";
    case "draft":
      return "accountListings.emptyDraft";
    default:
      return null;
  }
}

export function AccountListingsEmptyState({
  hasFilters,
  vertical = null,
  statusFilter = "all",
}: AccountListingsEmptyStateProps) {
  const { t } = useTranslation();
  const theme = getVerticalTheme(vertical);
  const isServicesFilter = hasFilters && vertical === "SERVICES";
  const isOptFilter = hasFilters && vertical === "OPT";
  const filterEmptyKey = hasFilters ? getFilterEmptyKey(statusFilter) : null;

  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center dark:border-slate-800 dark:bg-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <Package className="size-6" aria-hidden="true" />
      </div>
      {isServicesFilter ? (
        <>
          <p className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-100">
            {t("accountListings.emptyServicesTitle")}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {t("accountListings.emptyServicesDescription")}
          </p>
          <Button
            asChild
            className={cn("mt-6 h-11 w-full rounded-xl sm:w-auto", theme.primaryButton)}
          >
            <Link href="/listings/new?vertical=SERVICES">{t("services.postService")}</Link>
          </Button>
        </>
      ) : isOptFilter ? (
        <>
          <p className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-100">
            {t("accountListings.emptyOptTitle")}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {t("accountListings.emptyOptDescription")}
          </p>
          <Button
            asChild
            className={cn("mt-6 h-11 w-full rounded-xl sm:w-auto", theme.primaryButton)}
          >
            <Link href="/listings/new?vertical=OPT">{t("opt.postOffer")}</Link>
          </Button>
        </>
      ) : filterEmptyKey ? (
        <>
          <p className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-100">
            {t(filterEmptyKey)}
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-6 h-11 rounded-xl dark:border-slate-700"
          >
            <Link href="/account/listings">{t("accountListings.filters.all")}</Link>
          </Button>
        </>
      ) : hasFilters ? (
        <>
          <p className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-100">
            {t("account.noData")}
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-6 h-11 rounded-xl dark:border-slate-700"
          >
            <Link href="/account/listings">{t("accountListings.filters.all")}</Link>
          </Button>
        </>
      ) : (
        <>
          <p className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-100">
            {t("accountListings.emptyTitle")}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {t("accountListings.emptyDescription")}
          </p>
          <Button asChild className="mt-6 h-11 w-full rounded-xl sm:w-auto">
            <Link href="/listings/new">{t("accountListings.postListing")}</Link>
          </Button>
        </>
      )}
    </div>
  );
}
