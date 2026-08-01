"use client";

import Link from "next/link";
import { Settings2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

type CargoSubscriptionSettingsLinkProps = {
  enabled: boolean | null;
};

export function CargoSubscriptionSettingsLink({
  enabled,
}: CargoSubscriptionSettingsLinkProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-rose-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t("cargo.settings.title")}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {enabled === false
              ? t("cargo.subscription.inactiveDescription")
              : t("cargo.settings.description")}
          </p>
        </div>

        <Link
          href="/seller/cargo-settings"
          className="inline-flex h-11 w-full shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 sm:w-auto"
        >
          <Settings2 className="mr-2 size-4" aria-hidden="true" />
          {t("cargo.settings.title")}
        </Link>
      </div>
    </div>
  );
}
