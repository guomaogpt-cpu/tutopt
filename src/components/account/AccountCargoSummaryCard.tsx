"use client";

import Link from "next/link";
import type { AccountCargoSummary } from "@/features/account/lib/account-dashboard-data";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";

type AccountCargoSummaryCardProps = {
  cargo: AccountCargoSummary;
};

export function AccountCargoSummaryCard({ cargo }: AccountCargoSummaryCardProps) {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
        {t("account.cargo")}
      </h2>

      {!cargo.hasCargoActivity ? (
        <div className="mt-3 space-y-3">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {t("account.cargoCompanyQuestion")}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("account.cargoCompanyDescription")}
          </p>
          <Button
            asChild
            className="h-11 w-full rounded-xl bg-rose-600 text-white hover:bg-rose-700 sm:w-auto"
          >
            <Link href="/listings/new?vertical=cargo">{t("account.addCargoCompany")}</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li>
              {cargo.telegramConnected
                ? t("account.telegramConnected")
                : t("account.telegramNotConnected")}
            </li>
            <li>
              {cargo.notificationsEnabled
                ? t("account.cargoNotificationsOn")
                : t("account.cargoNotificationsOff")}
            </li>
            <li>
              {t("post.cargoCompany")}: {cargo.cargoListingCount}
            </li>
          </ul>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button asChild variant="outline" className="h-11 rounded-xl dark:border-slate-700">
              <Link href="/seller/cargo-requests">{t("account.cargoRequests")}</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-xl dark:border-slate-700">
              <Link href="/account/cargo-settings">{t("account.cargoSettings")}</Link>
            </Button>
            <Button asChild className="h-11 rounded-xl bg-rose-600 text-white hover:bg-rose-700">
              <Link href="/listings/new?vertical=cargo">{t("account.addCargoCompany")}</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
