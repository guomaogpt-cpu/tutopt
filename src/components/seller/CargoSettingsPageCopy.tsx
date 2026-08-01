"use client";

import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function CargoSettingsPageCopy() {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle className="text-2xl text-slate-900 sm:text-3xl dark:text-slate-100">
        {t("cargo.settings.title")}
      </PageTitle>
      <PageSubtitle className="text-sm text-slate-500 sm:text-base dark:text-slate-400">
        {t("cargo.settings.description")}
      </PageSubtitle>
    </>
  );
}
