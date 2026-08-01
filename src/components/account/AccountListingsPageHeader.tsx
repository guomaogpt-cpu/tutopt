"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";

export function AccountListingsPageHeader() {
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
          {t("accountListings.title")}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          {t("accountListings.description")}
        </p>
      </div>
      <Button asChild className="h-12 w-full rounded-xl sm:h-11 sm:w-auto">
        <Link href="/listings/new">{t("accountListings.postListing")}</Link>
      </Button>
    </header>
  );
}
