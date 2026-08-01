"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VERTICALS } from "@/features/verticals/verticals";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function CargoAddCompanyCta() {
  const { t } = useTranslation();
  const href = VERTICALS.CARGO.createListingHref;

  return (
    <section
      aria-labelledby="cargo-add-company-heading"
      className="mt-10 space-y-4 sm:mt-12"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-6">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-slate-100">
          {t("cargo.requestVsCompanyTitle")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {t("cargo.requestVsCompanyDescription")}
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
          <li>{t("cargo.needShipping")}</li>
          <li>{t("cargo.addCargoCompany")}</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-rose-200/80 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700 dark:bg-slate-800 dark:text-rose-300">
              <Building2 className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2
                id="cargo-add-company-heading"
                className="text-base font-bold text-slate-900 sm:text-lg dark:text-slate-100"
              >
                {t("cargo.addCompanyTitle")}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {t("cargo.addCompanyDescription")}
              </p>
            </div>
          </div>

          <Button
            asChild
            className="h-12 w-full shrink-0 rounded-xl bg-rose-600 text-white hover:bg-rose-700 sm:h-11 sm:w-auto"
          >
            <Link href={href}>{t("cargo.addCompanyButton")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
