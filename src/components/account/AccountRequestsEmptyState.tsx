"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";

type AccountRequestsEmptyStateProps = {
  variant?: "global" | "section" | "received" | "noListings";
};

export function AccountRequestsEmptyState({
  variant = "global",
}: AccountRequestsEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center dark:border-slate-800 dark:bg-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
        <Inbox className="size-6" aria-hidden="true" />
      </div>
      <p className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-100">
        {variant === "noListings"
          ? t("accountRequests.noListingsTitle")
          : variant === "received" || variant === "global"
            ? t("accountRequests.emptyTitle")
            : t("account.noData")}
      </p>
      {variant === "global" || variant === "received" ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {t("accountRequests.emptyDescription")}
        </p>
      ) : variant === "noListings" ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {t("accountRequests.noListingsDescription")}
        </p>
      ) : null}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        {variant === "noListings" ? (
          <Button asChild className="h-11 w-full rounded-xl sm:w-auto">
            <Link href="/listings/new">{t("account.postListing")}</Link>
          </Button>
        ) : variant === "received" ? (
          <Button asChild className="h-11 w-full rounded-xl sm:w-auto">
            <Link href="/account/listings">{t("accountRequests.myListings")}</Link>
          </Button>
        ) : (
          <Button asChild className="h-11 w-full rounded-xl sm:w-auto">
            <Link href="/listings">{t("accountRequests.browseListings")}</Link>
          </Button>
        )}
        {variant !== "received" ? (
          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-xl dark:border-slate-700 sm:w-auto"
          >
            <Link href="/cargo">{t("accountRequests.submitCargoRequest")}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
