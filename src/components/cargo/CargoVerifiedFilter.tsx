"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

export function CargoVerifiedFilter() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const verifiedOnly = searchParams.get("verified") === "1";

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Link
        href="/cargo"
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-medium transition",
          !verifiedOnly
            ? "bg-orange-500 text-white"
            : "border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
        )}
      >
        {t("cargo.companiesTitle")}
      </Link>
      <Link
        href="/cargo?verified=1"
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-medium transition",
          verifiedOnly
            ? "bg-emerald-600 text-white"
            : "border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
        )}
      >
        {t("company.verification.verifiedOnly")}
      </Link>
    </div>
  );
}
