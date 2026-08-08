"use client";

import { Loader2, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type GenerateListingDescriptionButtonProps = {
  aiEnabled: boolean;
  canGenerate: boolean;
  isGenerating: boolean;
  onGenerate: () => void;
  className?: string;
};

export function GenerateListingDescriptionButton({
  aiEnabled,
  canGenerate,
  isGenerating,
  onGenerate,
  className,
}: GenerateListingDescriptionButtonProps) {
  const { t } = useTranslation();

  if (!aiEnabled) {
    return null;
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <Button
        type="button"
        variant="outline"
        disabled={isGenerating || !canGenerate}
        onClick={onGenerate}
        className="h-12 w-full rounded-xl border-slate-200 text-sm font-semibold dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      >
        {isGenerating ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            {t("listingForm.composingDescription")}
          </>
        ) : (
          <>
            <PenLine className="size-4" aria-hidden="true" />
            {t("listingForm.composeDescription")}
          </>
        )}
      </Button>
      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {canGenerate
          ? t("listingForm.composeDescriptionHint")
          : t("listingForm.composeDescriptionNeedData")}
      </p>
    </div>
  );
}
