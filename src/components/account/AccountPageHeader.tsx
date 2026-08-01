"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

type AccountPageHeaderProps = {
  userName: string;
};

export function AccountPageHeader({ userName }: AccountPageHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="mb-5 sm:mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
        {t("account.title")}
      </h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        {userName} · {t("account.subtitle")}
      </p>
    </header>
  );
}
