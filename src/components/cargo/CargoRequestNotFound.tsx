"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function CargoRequestNotFound() {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        {t("cargoRequest.notFoundTitle")}
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {t("cargoRequest.notFoundDescription")}
      </p>
      <Button asChild className="mt-5 h-11 rounded-xl bg-orange-500 hover:bg-orange-600">
        <Link href="/cargo">{t("cargoRequest.backToCargo")}</Link>
      </Button>
    </div>
  );
}
