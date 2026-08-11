"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AccountMyActivityStatsProps = {
  activeListings: number;
  pendingListings: number;
  receivedLeads: number;
  newLeads: number;
  sentLeads: number;
};

export function AccountMyActivityStats({
  activeListings,
  pendingListings,
  receivedLeads,
  newLeads,
  sentLeads,
}: AccountMyActivityStatsProps) {
  const { t } = useTranslation();

  const hasActivity =
    activeListings > 0 ||
    pendingListings > 0 ||
    receivedLeads > 0 ||
    newLeads > 0 ||
    sentLeads > 0;

  const items = [
    {
      key: "active",
      label: t("analytics.myActivity.activeListings"),
      count: activeListings,
      href: "/account/listings?status=active",
    },
    {
      key: "pending",
      label: t("analytics.myActivity.pendingListings"),
      count: pendingListings,
      href: "/account/listings?status=pending",
    },
    {
      key: "received",
      label: t("analytics.myActivity.receivedLeads"),
      count: receivedLeads,
      href: "/account/requests?tab=received",
    },
    {
      key: "new",
      label: t("analytics.myActivity.newLeads"),
      count: newLeads,
      href: "/account/requests?tab=received&status=new",
    },
    {
      key: "sent",
      label: t("analytics.myActivity.sentLeads"),
      count: sentLeads,
      href: "/account/requests?tab=sent",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
        {t("analytics.myActivity.title")}
      </h2>

      {!hasActivity ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center dark:border-slate-700">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {t("analytics.myActivity.emptyTitle")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {t("analytics.myActivity.emptyDescription")}
          </p>
          <Button asChild className="mt-4 h-11 rounded-xl">
            <Link href="/listings/new">{t("account.postListing")}</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-3 -mx-1 overflow-x-auto px-1">
          <div className="flex w-max min-w-full gap-2 sm:grid sm:w-auto sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "inline-flex min-w-[132px] shrink-0 flex-col rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 transition",
                  "hover:border-blue-200 hover:bg-blue-50/60 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900 dark:hover:bg-slate-900",
                  "sm:min-w-0",
                )}
              >
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                  {item.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
