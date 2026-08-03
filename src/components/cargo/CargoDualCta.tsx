"use client";

import Link from "next/link";
import { Building2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VERTICALS } from "@/features/verticals/verticals";
import { useTranslation } from "@/lib/i18n/useTranslation";

type CargoDualCtaProps = {
  onCreateRequest: () => void;
};

export function CargoDualCta({ onCreateRequest }: CargoDualCtaProps) {
  const { t } = useTranslation();

  return (
    <section className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 lg:grid-cols-2 lg:gap-4">
      <div className="rounded-2xl border border-orange-200/80 bg-orange-50/60 p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="flex gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-slate-800 dark:text-orange-300">
            <Package className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {t("cargo.needShippingTitle")}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t("cargo.needShippingDescription")}
            </p>
            <Button
              type="button"
              onClick={onCreateRequest}
              className="mt-4 h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600 sm:w-auto"
            >
              {t("cargo.createRequest")}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="flex gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {t("cargo.areYouCargoCompanyTitle")}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t("cargo.areYouCargoCompanyDescription")}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                asChild
                className="h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600 sm:w-auto"
              >
                <Link href={VERTICALS.CARGO.createListingHref}>
                  {t("cargo.addCompanyButton")}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-xl dark:border-slate-700 sm:w-auto"
              >
                <Link href="/account/cargo-settings">{t("cargo.setupNotifications")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
