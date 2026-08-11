"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb, X } from "lucide-react";
import {
  LISTING_FORM_HINT_DISMISSED_KEY,
  readOnboardingDismissed,
  writeOnboardingDismissed,
} from "@/lib/onboarding/onboarding-storage";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const HINT_ITEMS: DictionaryKey[] = [
  "onboarding.listingFormHintCategory",
  "onboarding.listingFormHintPhotos",
  "onboarding.listingFormHintPrice",
  "onboarding.listingFormHintCompose",
];

type ListingFormFirstHintProps = {
  className?: string;
};

/** Collapsible hint for the first listing only — dismiss persists in localStorage. */
export function ListingFormFirstHint({ className }: ListingFormFirstHintProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setVisible(!readOnboardingDismissed(LISTING_FORM_HINT_DISMISSED_KEY));
  }, []);

  function dismiss() {
    writeOnboardingDismissed(LISTING_FORM_HINT_DISMISSED_KEY);
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-amber-100 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/20",
        className,
      )}
    >
      <div className="flex items-start gap-2.5 p-3.5 sm:p-4">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          <Lightbulb className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {t("onboarding.listingFormHintIntro")}
            </p>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-amber-100/80 hover:text-slate-600 dark:hover:bg-amber-950/40 dark:hover:text-slate-200"
                aria-expanded={expanded}
                aria-label={expanded ? t("onboarding.collapseHint") : t("onboarding.expandHint")}
              >
                {expanded ? (
                  <ChevronUp className="size-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="size-4" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-amber-100/80 hover:text-slate-600 dark:hover:bg-amber-950/40 dark:hover:text-slate-200"
                aria-label={t("onboarding.hide")}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          {expanded ? (
            <ul className="mt-2 space-y-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {HINT_ITEMS.map((key) => (
                <li key={key} className="flex gap-1.5">
                  <span aria-hidden="true">•</span>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
