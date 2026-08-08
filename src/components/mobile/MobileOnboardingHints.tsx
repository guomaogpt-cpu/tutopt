"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "vsetut_onboarding_hints_dismissed_v1";

type HintItem = {
  id: string;
  textKey: DictionaryKey;
};

const HINTS: HintItem[] = [
  { id: "post", textKey: "onboarding.hintPost" },
  { id: "photos", textKey: "onboarding.hintPhotos" },
  { id: "description", textKey: "onboarding.hintDescription" },
];

type MobileOnboardingHintsProps = {
  className?: string;
};

/** Dismissible hint cards for first-time mobile users. */
export function MobileOnboardingHints({ className }: MobileOnboardingHintsProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(STORAGE_KEY);
      setVisible(dismissed !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <section
      aria-labelledby="onboarding-hints-title"
      className={cn(
        "rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/90 to-white p-4 dark:border-blue-900/50 dark:from-blue-950/30 dark:to-slate-900",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2
              id="onboarding-hints-title"
              className="text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              {t("onboarding.title")}
            </h2>
            <ul className="mt-2 space-y-1.5">
              {HINTS.map((hint) => (
                <li
                  key={hint.id}
                  className="text-xs leading-relaxed text-slate-600 dark:text-slate-400"
                >
                  {t(hint.textKey)}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label={t("onboarding.dismiss")}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
