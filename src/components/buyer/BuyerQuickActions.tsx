"use client";

import Link from "next/link";
import { Bell, Heart, Inbox, PlusCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const cardClassName = cn(
  "flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5",
  "shadow-sm transition hover:border-blue-300",
  "dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/30",
  "sm:p-5",
);

const iconWrapClassName =
  "flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400";

export function BuyerQuickActions() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="buyer-quick-actions-title">
      <h2
        id="buyer-quick-actions-title"
        className="mb-3 text-base font-bold text-slate-900 sm:mb-4 sm:text-xl dark:text-slate-100"
      >
        {t("profile.title")}
      </h2>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
        <Link href="/favorites" className={cardClassName}>
          <div className={iconWrapClassName}>
            <Heart className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t("profile.favorites")}
            </p>
          </div>
        </Link>

        <Link href="/notifications" className={cardClassName}>
          <div className={iconWrapClassName}>
            <Bell className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t("profile.notifications")}
            </p>
          </div>
        </Link>

        <Link href="#buyer-leads" className={cardClassName}>
          <div className={iconWrapClassName}>
            <Inbox className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t("profile.leads")}
            </p>
          </div>
        </Link>

        <Link href="/listings/new" className={cardClassName}>
          <div className={iconWrapClassName}>
            <PlusCircle className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t("profile.postListing")}
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
