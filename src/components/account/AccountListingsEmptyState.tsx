"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";

type AccountListingsEmptyStateProps = {
  hasFilters: boolean;
};

export function AccountListingsEmptyState({ hasFilters }: AccountListingsEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center dark:border-slate-800 dark:bg-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
        <Package className="size-6" aria-hidden="true" />
      </div>
      {hasFilters ? (
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
