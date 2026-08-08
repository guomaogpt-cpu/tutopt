"use client";

import Link from "next/link";
import {
  Bell,
  Heart,
  Inbox,
  ListChecks,
  PlusCircle,
  Settings2,
  Truck,
} from "lucide-react";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type QuickAction = {
  href: string;
  labelKey: DictionaryKey;
  icon: typeof PlusCircle;
  primary?: boolean;
};

const ACTIONS: QuickAction[] = [
  { href: "/listings/new", labelKey: "account.postListing", icon: PlusCircle, primary: true },
  { href: "/account/listings", labelKey: "account.myListings", icon: ListChecks },
  { href: "/account/requests", labelKey: "account.myRequests", icon: Inbox },
  { href: "/account/company", labelKey: "account.company", icon: Settings2 },
  { href: "/favorites", labelKey: "account.favorites", icon: Heart },
  { href: "/notifications", labelKey: "account.notifications", icon: Bell },
  { href: "/cargo", labelKey: "account.submitCargoRequest", icon: Truck },
];

const cardClassName = cn(
  "flex min-h-[4.25rem] flex-col items-start justify-center gap-2 rounded-2xl border p-3.5",
  "shadow-sm transition active:scale-[0.99]",
  "sm:min-h-[5rem] sm:p-4",
);

export function AccountQuickActions() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="account-quick-actions">
      <h2
        id="account-quick-actions"
        className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
      >
        {t("account.quickActions")}
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                cardClassName,
                action.primary
                  ? "border-blue-200 bg-blue-50/80 dark:border-blue-800/60 dark:bg-blue-950/30"
                  : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40",
              )}
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl",
                  action.primary
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
                {t(action.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
