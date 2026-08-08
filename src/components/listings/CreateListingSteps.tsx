"use client";

import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const STEPS: Array<{ id: string; labelKey: DictionaryKey }> = [
  { id: "category", labelKey: "listingForm.steps.category" },
  { id: "details", labelKey: "listingForm.steps.details" },
  { id: "description", labelKey: "listingForm.steps.description" },
  { id: "preview", labelKey: "listingForm.steps.preview" },
];

type CreateListingStepsProps = {
  activeStep: "type" | "category" | "details" | "description" | "preview";
};

export function CreateListingSteps({ activeStep }: CreateListingStepsProps) {
  const { t } = useTranslation();
  const normalizedStep = activeStep === "type" ? "category" : activeStep;
  const activeIndex = STEPS.findIndex((step) => step.id === normalizedStep);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <nav aria-label={t("listingForm.stepsProgress")} className="mb-4 sm:mb-5">
      <p className="mb-2 text-xs font-semibold text-slate-500 sm:hidden dark:text-slate-400">
        {t("listingForm.stepProgress")
          .replace("{n}", String(safeIndex + 1))
          .replace("{total}", String(STEPS.length))}
      </p>

      <ol className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:gap-2 sm:overflow-visible">
        {STEPS.map((step, index) => {
          const isActive = step.id === normalizedStep;
          const isDone = index < safeIndex;
          return (
            <li
              key={step.id}
              className={cn(
                "inline-flex h-8 shrink-0 items-center rounded-full px-3 text-xs font-semibold",
                isActive
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : isDone
                    ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    : "bg-white text-slate-500 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:ring-slate-700",
              )}
            >
              <span className="mr-1.5 opacity-70">{index + 1}</span>
              <span className="hidden sm:inline">{t(step.labelKey)}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
