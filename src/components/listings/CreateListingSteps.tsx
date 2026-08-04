"use client";

import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const STEPS: Array<{ id: string; labelKey: DictionaryKey }> = [
  { id: "type", labelKey: "listingForm.steps.type" },
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
  const activeIndex = STEPS.findIndex((step) => step.id === activeStep);

  return (
    <nav
      aria-label={t("listingForm.steps.type")}
      className="mb-4 overflow-x-auto pb-1 sm:mb-5"
    >
      <ol className="flex w-max min-w-full gap-2 sm:flex-wrap sm:w-auto">
        {STEPS.map((step, index) => {
          const isActive = step.id === activeStep;
          const isDone = index < activeIndex;
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
              {t(step.labelKey)}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
