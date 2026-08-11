"use client";

import Link from "next/link";
import type { LeadStatusCounts } from "@/features/leads/lib/lead-stats";
import type { AccountRequestsStatusFilter } from "@/features/account/lib/account-requests-status";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type AccountRequestsStatusSummaryProps = {
  mode: "received" | "sent";
  counts: LeadStatusCounts;
  activeStatus: AccountRequestsStatusFilter;
  listingId?: string | null;
};

type SummaryItem = {
  key: AccountRequestsStatusFilter;
  labelKey:
    | "analytics.requestsSummary.total"
    | "analytics.requestsSummary.new"
    | "analytics.requestsSummary.inProgress"
    | "analytics.requestsSummary.completed"
    | "analytics.requestsSummary.rejected";
  count: number;
};

export function AccountRequestsStatusSummary({
  mode,
  counts,
  activeStatus,
  listingId = null,
}: AccountRequestsStatusSummaryProps) {
  const { t } = useTranslation();

  const items: SummaryItem[] = [
    { key: "all", labelKey: "analytics.requestsSummary.total", count: counts.total },
    { key: "new", labelKey: "analytics.requestsSummary.new", count: counts.new },
    {
      key: "viewed",
      labelKey: "analytics.requestsSummary.inProgress",
      count: counts.inProgress,
    },
    {
      key: "closed",
      labelKey: "analytics.requestsSummary.completed",
      count: counts.completed,
    },
    {
      key: "rejected",
      labelKey: "analytics.requestsSummary.rejected",
      count: counts.rejected,
    },
  ];

  function buildHref(status: AccountRequestsStatusFilter): string {
    const params = new URLSearchParams();
    params.set("tab", mode);
    if (status !== "all") {
      params.set("status", status);
    }
    if (listingId) {
      params.set("listingId", listingId);
    }
    return `/account/requests?${params.toString()}`;
  }

  return (
    <section
      aria-label={t(
        mode === "received"
          ? "analytics.requestsSummary.receivedTitle"
          : "analytics.requestsSummary.sentTitle",
      )}
      className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4"
    >
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {t(
          mode === "received"
            ? "analytics.requestsSummary.receivedTitle"
            : "analytics.requestsSummary.sentTitle",
        )}
      </p>
      <div className="-mx-1 overflow-x-auto px-1">
        <div className="flex w-max min-w-full gap-2">
          {items.map((item) => {
            const isActive = activeStatus === item.key;
            return (
              <Link
                key={item.key}
                href={buildHref(item.key)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
                )}
              >
                {t(item.labelKey)}
                <span className={cn("opacity-80", isActive ? "" : "text-slate-400")}>
                  {item.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
