"use client";

import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import type { AccountDashboardData } from "@/features/account/lib/account-dashboard-data";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type AccountActivitySummaryProps = {
  data: Pick<
    AccountDashboardData,
    | "unreadNotifications"
    | "listingStats"
    | "receivedLeadsCount"
    | "inProgressLeadsCount"
    | "cargoRequestsCount"
  >;
};

export function AccountActivitySummary({ data }: AccountActivitySummaryProps) {
  const { t } = useTranslation();

  const lines: Array<{ key: string; label: string }> = [];

  if (data.unreadNotifications > 0) {
    lines.push({
      key: "notifications",
      label: t("accountActivity.unreadNotifications").replace(
        "{count}",
        String(data.unreadNotifications),
      ),
    });
  }

  if (data.receivedLeadsCount > 0) {
    lines.push({
      key: "leads",
      label: t("accountActivity.newLeads").replace("{count}", String(data.receivedLeadsCount)),
    });
  }

  if (data.inProgressLeadsCount > 0) {
    lines.push({
      key: "leads-progress",
      label: t("accountActivity.leadsInProgress").replace(
        "{count}",
        String(data.inProgressLeadsCount),
      ),
    });
  }

  const pendingModeration = data.listingStats.pending;
  if (pendingModeration > 0) {
    lines.push({
      key: "pending",
      label: t("accountActivity.pendingListings").replace("{count}", String(pendingModeration)),
    });
  }

  if (data.listingStats.active > 0) {
    lines.push({
      key: "active",
      label: t("accountActivity.activeListings").replace("{count}", String(data.listingStats.active)),
    });
  }

  if (data.cargoRequestsCount > 0) {
    lines.push({
      key: "cargo",
      label: t("accountActivity.cargoRequests").replace("{count}", String(data.cargoRequestsCount)),
    });
  }

  const isQuiet = lines.length === 0;

  return (
    <section
      aria-labelledby="account-activity-heading"
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-slate-800 dark:text-violet-400">
          <Activity className="size-4" aria-hidden="true" />
        </span>
        <h2
          id="account-activity-heading"
          className="text-base font-bold text-slate-900 dark:text-slate-100"
        >
          {t("accountActivity.title")}
        </h2>
      </div>

      {isQuiet ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center dark:border-slate-700">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {t("accountActivity.quietTitle")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {t("accountActivity.quietDescription")}
          </p>
          <Button asChild className="mt-4 h-11 rounded-xl">
            <Link href="/listings/new">{t("account.postListing")}</Link>
          </Button>
        </div>
      ) : (
        <>
          <ul className="mt-4 space-y-2">
            {lines.map((line) => (
              <li
                key={line.key}
                className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                {line.label}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              href="/notifications"
              className={cn(
                "inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-sm font-medium",
                "text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:text-slate-300",
              )}
            >
              {t("accountActivity.openNotifications")}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/account/listings"
              className={cn(
                "inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-sm font-medium",
                "text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:text-slate-300",
              )}
            >
              {t("accountActivity.openListings")}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/account/requests"
              className={cn(
                "inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-sm font-medium",
                "text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:text-slate-300",
              )}
            >
              {t("accountActivity.openRequests")}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
