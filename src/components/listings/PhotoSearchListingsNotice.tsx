"use client";

import type { ListingVertical } from "@prisma/client";
import { Camera } from "lucide-react";
import { PhotoSearchButton } from "@/components/search/PhotoSearchButton";
import { useTranslation } from "@/lib/i18n/useTranslation";

type PhotoSearchListingsNoticeProps = {
  vertical?: ListingVertical | null;
  categoryId?: string | null;
  initialQueryHint?: string;
};

export function PhotoSearchListingsNotice({
  vertical = null,
  categoryId = null,
  initialQueryHint = "",
}: PhotoSearchListingsNoticeProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-0 gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-950 dark:text-blue-400">
          <Camera className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t("listings.photoSearch.title")}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:text-sm">
            {t("listings.photoSearch.description")}
          </p>
        </div>
      </div>
      <PhotoSearchButton
        vertical={vertical}
        categoryId={categoryId}
        initialQueryHint={initialQueryHint}
        triggerVariant="button"
        triggerLabelKey="listings.photoSearch.newSearch"
        className="w-full shrink-0 sm:w-auto"
      />
    </div>
  );
}
