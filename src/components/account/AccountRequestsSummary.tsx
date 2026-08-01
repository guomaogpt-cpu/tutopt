"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";

type AccountRequestsSummaryProps = {
  leadsCount: number;
  recentLeadTitles: string[];
  cargoRequestsCount: number;
  recentCargoRequests: Array<{
    id: string;
    itemName: string;
    status: string;
    responseCount: number;
    fromLocation: string;
    toLocation: string;
  }>;
};

export function AccountRequestsSummary({
  leadsCount,
  recentLeadTitles,
  cargoRequestsCount,
  recentCargoRequests,
}: AccountRequestsSummaryProps) {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          {t("account.myRequests")}
        </h2>
        <Button asChild variant="outline" size="sm" className="rounded-xl dark:border-slate-700">
          <Link href="/account/requests">{t("account.viewAll")}</Link>
        </Button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t("account.myRequests")}
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{leadsCount}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t("account.myCargoRequests")}
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
            {cargoRequestsCount}
          </p>
        </div>
      </div>

      {recentLeadTitles.length > 0 ? (
        <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
          {recentLeadTitles.map((title) => (
            <li key={title} className="truncate">
              · {title}
            </li>
          ))}
        </ul>
      ) : null}

      {recentCargoRequests.length > 0 ? (
        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {t("account.myCargoRequests")}
            </p>
            <Link
              href="/account/requests?tab=cargoRequests"
              className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {t("account.viewAll")}
            </Link>
          </div>
          <ul className="space-y-2">
            {recentCargoRequests.map((request) => (
              <li
                key={request.id}
                className="rounded-xl border border-slate-100 px-3 py-2 text-sm dark:border-slate-800"
              >
                <p className="font-medium text-slate-800 dark:text-slate-100">{request.itemName}</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {request.fromLocation} → {request.toLocation} · {request.status} ·{" "}
                  {request.responseCount}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {leadsCount === 0 && cargoRequestsCount === 0 ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t("account.noData")}</p>
      ) : null}
    </section>
  );
}
