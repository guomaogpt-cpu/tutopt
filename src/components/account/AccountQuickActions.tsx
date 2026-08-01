"use client";

import Link from "next/link";
import {
  Bell,
  Building2,
  Heart,
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
};

const ACTIONS: QuickAction[] = [
  { href: "/listings/new", labelKey: "account.postListing", icon: PlusCircle },
  { href: "/cargo", labelKey: "account.submitCargoRequest", icon: Truck },
  { href: "/seller/listings", labelKey: "account.myListings", icon: ListChecks },
  { href: "/favorites", labelKey: "account.favorites", icon: Heart },
  { href: "/notifications", labelKey: "account.notifications", icon: Bell },
  { href: "/account/company", labelKey: "account.company", icon: Building2 },
  { href: "/seller/cargo-settings", labelKey: "account.cargoSettings", icon: Settings2 },
];

const cardClassName = cn(
  "flex min-h-[4.5rem] flex-col items-start justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-3.5",
  "shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40",
  "sm:min-h-[5rem] sm:p-4",
);

export function AccountQuickActions() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="account-quick-actions">
      <h2
        id="account-quick-actions"
        className="mb-3 text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg"
      >
        {t("account.quickActions")}
      </h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className={cardClassName}>
              <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
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
