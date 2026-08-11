"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  buildAccountRequestsHref,
  type AccountRequestsTab,
} from "@/features/account/lib/account-requests-tabs";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const TABS: Array<{ value: AccountRequestsTab; labelKey: DictionaryKey }> = [
  { value: "all", labelKey: "accountRequests.tabs.all" },
  { value: "sent", labelKey: "accountRequests.tabs.sent" },
  { value: "received", labelKey: "accountRequests.tabs.received" },
  { value: "cargoRequests", labelKey: "accountRequests.tabs.cargoRequests" },
  { value: "cargoResponses", labelKey: "accountRequests.tabs.cargoResponses" },
];

type AccountRequestsTabsProps = {
  activeTab: AccountRequestsTab;
  counts: {
    all: number;
    sent: number;
    received: number;
    cargoRequests: number;
    cargoResponses: number;
  };
};

function ChipRow({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-horizontal-scroll -mx-1 flex gap-2 px-1 pb-1">
      {children}
    </div>
  );
}

export function AccountRequestsTabs({ activeTab, counts }: AccountRequestsTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      <ChipRow>
        {TABS.map((tab) => {
          const active = activeTab === tab.value;
          const count = counts[tab.value];
          return (
            <Link
              key={tab.value}
              href={buildAccountRequestsHref(tab.value)}
              className={cn(
                "shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition",
                active
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300",
              )}
            >
              {t(tab.labelKey)}
              {count > 0 ? ` · ${count}` : ""}
            </Link>
          );
        })}
      </ChipRow>
    </div>
  );
}
