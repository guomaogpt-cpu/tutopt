"use client";

import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";

type ListingFormDraftBannerProps = {
  onRestore: () => void;
  onDismiss: () => void;
};

export function ListingFormDraftBanner({
  onRestore,
  onDismiss,
}: ListingFormDraftBannerProps) {
  const { t } = useTranslation();

  return (
    <div
      className="rounded-2xl border border-blue-200 bg-blue-50/90 p-4 dark:border-blue-500/30 dark:bg-blue-950/30"
      role="region"
      aria-labelledby="listing-draft-banner-title"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id="listing-draft-banner-title"
            className="text-sm font-bold text-slate-900 dark:text-slate-100"
          >
            {t("listingForm.draft.found")}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t("listingForm.draft.description")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" size="sm" className="h-10 rounded-xl" onClick={onRestore}>
              {t("listingForm.draft.restore")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={onDismiss}
            >
              <Trash2 className="mr-1.5 size-4" aria-hidden="true" />
              {t("listingForm.draft.dismiss")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
