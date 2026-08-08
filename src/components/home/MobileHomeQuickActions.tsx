"use client";

import Link from "next/link";
import { Megaphone, PlusCircle, Search, Truck } from "lucide-react";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type QuickAction = {
  href: string;
  labelKey: DictionaryKey;
  icon: typeof PlusCircle;
  accent: string;
  iconBg: string;
  primary?: boolean;
};

const ACTIONS: QuickAction[] = [
  {
    href: "/listings/new",
    labelKey: "home.quickPostListing",
    icon: PlusCircle,
    accent: "text-blue-700 dark:text-blue-300",
    iconBg: "bg-blue-100 dark:bg-blue-950/60",
    primary: true,
  },
  {
    href: "/market",
    labelKey: "home.quickFindGoods",
    icon: Search,
    accent: "text-purple-700 dark:text-purple-300",
    iconBg: "bg-purple-100 dark:bg-purple-950/60",
  },
  {
    href: "/services",
    labelKey: "home.quickFindService",
    icon: Megaphone,
    accent: "text-green-700 dark:text-green-300",
    iconBg: "bg-green-100 dark:bg-green-950/60",
  },
  {
    href: "/cargo",
    labelKey: "home.quickCargoRequest",
    icon: Truck,
    accent: "text-orange-700 dark:text-orange-300",
    iconBg: "bg-orange-100 dark:bg-orange-950/60",
  },
];

/** Compact 2×2 quick actions for mobile home first screen. */
export function MobileHomeQuickActions() {
  const { t } = useTranslation();

  return (
    <div className="sm:hidden">
      <h2 className="sr-only">{t("home.quickActions")}</h2>
      <ul className="grid grid-cols-2 gap-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <li key={action.href}>
              <Link
                href={action.href}
                className={cn(
                  "flex min-h-[4.25rem] items-center gap-2.5 rounded-xl border px-3 py-2.5 transition active:scale-[0.98]",
                  action.primary
                    ? "border-blue-200 bg-blue-50/90 dark:border-blue-800/60 dark:bg-blue-950/40"
                    : "border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    action.iconBg,
                    action.accent,
                  )}
                >
                  <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="text-[13px] font-semibold leading-snug text-slate-900 dark:text-slate-100">
                  {t(action.labelKey)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
