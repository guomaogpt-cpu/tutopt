"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";

export function AccountRequestsPageHeader() {
  const { t } = useTranslation();

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <Link href="/account" className="hover:text-blue-600 dark:hover:text-blue-400">
            {t("account.title")}
          </Link>
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          {t("accountRequests.title")}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          {t("accountRequests.description")}
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <Button asChild variant="outline" className="h-11 w-full rounded-xl dark:border-slate-700 sm:w-auto">
          <Link href="/listings">{t("accountRequests.browseListings")}</Link>
        </Button>
        <Button asChild className="h-11 w-full rounded-xl sm:w-auto">
          <Link href="/cargo">{t("accountRequests.submitCargoRequest")}</Link>
        </Button>
      </div>
    </header>
  );
}
