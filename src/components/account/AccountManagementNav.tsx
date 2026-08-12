"use client";

import Link from "next/link";
import { ChevronRight, Heart, LifeBuoy, Megaphone, MessageSquare, Building2, Bell } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  labelKey:
    | "account.myListings"
    | "account.myRequests"
    | "account.company"
    | "account.favorites"
    | "account.notifications"
    | "account.serviceSupport";
  icon: typeof Megaphone;
};

const ITEMS: NavItem[] = [
  { href: "/account/listings", labelKey: "account.myListings", icon: Megaphone },
  { href: "/account/requests", labelKey: "account.myRequests", icon: MessageSquare },
  { href: "/account/company", labelKey: "account.company", icon: Building2 },
  { href: "/favorites", labelKey: "account.favorites", icon: Heart },
  { href: "/notifications", labelKey: "account.notifications", icon: Bell },
  { href: "/support", labelKey: "account.serviceSupport", icon: LifeBuoy },
];

export function AccountManagementNav() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="account-management-nav">
      <h2
        id="account-management-nav"
        className="text-base font-bold text-slate-900 dark:text-slate-100"
      >
        {t("account.management")}
      </h2>
      <ul className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <li
              key={item.href}
              className={cn(index > 0 && "border-t border-slate-100 dark:border-slate-800")}
            >
              <Link
                href={item.href}
                className="flex min-h-[3.25rem] items-center gap-3 px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/60"
              >
                <Icon className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                <span className="flex-1">{t(item.labelKey)}</span>
                <ChevronRight className="size-4 shrink-0 text-slate-300 dark:text-slate-600" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
