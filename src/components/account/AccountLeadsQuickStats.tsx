"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type AccountLeadsQuickStatsProps = {
  newReceivedCount: number;
  receivedCount: number;
  sentCount: number;
};

export function AccountLeadsQuickStats({
  newReceivedCount,
  receivedCount,
  sentCount,
}: AccountLeadsQuickStatsProps) {
  const { t } = useTranslation();

  const items = [
    {
      key: "new",
      label: t("accountActivity.newLeadsShort"),
      count: newReceivedCount,
      href: "/account/requests?tab=received",
    },
    {
      key: "received",
      label: t("accountActivity.receivedLeadsShort"),
      count: receivedCount,
      href: "/account/requests?tab=received",
    },
    {
      key: "sent",
      label: t("accountActivity.sentLeadsShort"),
      count: sentCount,
      href: "/account/requests?tab=sent",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
        {t("accountActivity.leadsStatsTitle")}
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 transition",
              "hover:border-blue-200 hover:bg-blue-50/60 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-900 dark:hover:bg-slate-900",
            )}
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{item.count}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
