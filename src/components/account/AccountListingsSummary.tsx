"use client";

import Link from "next/link";
import type { ListingStatus } from "@prisma/client";
import type { AccountListingStats, AccountRecentListing } from "@/features/account/lib/account-dashboard-data";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";

type AccountListingsSummaryProps = {
  stats: AccountListingStats;
  recentListings: AccountRecentListing[];
};

function statusLabel(
  status: ListingStatus,
  t: (key: DictionaryKey) => string,
): string {
  switch (status) {
    case "PUBLISHED":
      return t("status.published");
    case "PENDING_MODERATION":
      return t("status.pendingModeration");
    case "REJECTED":
      return t("status.rejected");
    case "ARCHIVED":
      return t("status.archived");
    default:
      return t("status.draft");
  }
}

export function AccountListingsSummary({
  stats,
  recentListings,
}: AccountListingsSummaryProps) {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          {t("account.myListings")}
        </h2>
        <Button asChild variant="outline" size="sm" className="rounded-xl dark:border-slate-700">
          <Link href="/account/listings">{t("account.viewAll")}</Link>
        </Button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          { label: t("account.listingsTotal"), value: stats.total },
          { label: t("account.listingsActive"), value: stats.active },
          { label: t("account.listingsPending"), value: stats.pending },
          { label: t("account.listingsRejected"), value: stats.rejected },
          { label: t("account.listingsArchived"), value: stats.archived },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950"
          >
            <dt className="text-[11px] text-slate-500 dark:text-slate-400">{item.label}</dt>
            <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {recentListings.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t("accountListings.emptyTitle")}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("accountListings.emptyDescription")}
          </p>
          <Button asChild className="mt-4 h-10 w-full rounded-xl sm:w-auto">
            <Link href="/listings/new">{t("accountListings.postListing")}</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {recentListings.map((listing) => (
            <li key={listing.id}>
              <Link
                href={`/listings/${listing.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2.5 text-sm transition hover:border-blue-200 dark:border-slate-800 dark:hover:border-blue-500/40"
              >
                <span className="min-w-0 truncate font-medium text-slate-800 dark:text-slate-100">
                  {listing.title}
                </span>
                <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                  {statusLabel(listing.status, t)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
