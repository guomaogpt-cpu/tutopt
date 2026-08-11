"use client";

import { Route } from "lucide-react";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS: DictionaryKey[] = [
  "onboarding.cargoQuickGuideStep1",
  "onboarding.cargoQuickGuideStep2",
  "onboarding.cargoQuickGuideStep3",
];

type CargoQuickGuideProps = {
  onCreateRequest: () => void;
  className?: string;
};

/** Compact cargo how-it-works block — does not replace the full section below. */
export function CargoQuickGuide({ onCreateRequest, className }: CargoQuickGuideProps) {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="cargo-quick-guide-title"
      className={cn(
        "rounded-2xl border border-orange-100/80 bg-orange-50/50 p-3.5 dark:border-orange-900/30 dark:bg-orange-950/15 sm:p-4",
        className,
      )}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
          <Route className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id="cargo-quick-guide-title"
            className="text-sm font-semibold text-slate-900 dark:text-slate-100"
          >
            {t("onboarding.cargoQuickGuideTitle")}
          </h2>
          <ol className="mt-2 space-y-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {STEPS.map((key, index) => (
              <li key={key} className="flex gap-2">
                <span className="font-semibold text-orange-700 dark:text-orange-300">{index + 1}.</span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ol>
          <Button
            type="button"
            size="sm"
            onClick={onCreateRequest}
            className="mt-3 h-9 rounded-xl bg-orange-600 px-4 text-xs font-semibold hover:bg-orange-700"
          >
            {t("onboarding.cargoCreateRequest")}
          </Button>
        </div>
      </div>
    </section>
  );
}
