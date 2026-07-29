"use client";

import { Info } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function ListingRequestHint() {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2.5 rounded-xl border border-blue-200/80 bg-blue-50 px-3.5 py-3 text-sm leading-relaxed text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>{t("listing.requestHint")}</p>
    </div>
  );
}
