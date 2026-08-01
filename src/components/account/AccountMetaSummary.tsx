"use client";

import Link from "next/link";
import { Bell, Heart } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

type AccountMetaSummaryProps = {
  favoritesCount: number;
  unreadNotifications: number;
};

export function AccountMetaSummary({
  favoritesCount,
  unreadNotifications,
}: AccountMetaSummaryProps) {
  const { t } = useTranslation();

  return (
    <section className="grid grid-cols-2 gap-2.5">
      <Link
        href="/favorites"
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40"
      >
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Heart className="size-4" aria-hidden="true" />
          <span className="text-xs font-medium">{t("account.favorites")}</span>
        </div>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {favoritesCount}
        </p>
      </Link>
      <Link
        href="/notifications"
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40"
      >
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Bell className="size-4" aria-hidden="true" />
          <span className="text-xs font-medium">{t("account.notifications")}</span>
        </div>
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {unreadNotifications}
        </p>
      </Link>
    </section>
  );
}
