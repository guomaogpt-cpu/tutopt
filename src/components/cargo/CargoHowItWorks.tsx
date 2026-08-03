"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

const STEPS = [
  "cargo.howItWorks.step1.title",
  "cargo.howItWorks.step2.title",
  "cargo.howItWorks.step3.title",
  "cargo.howItWorks.step4.title",
] as const;

export function CargoHowItWorks() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="cargo-how-it-works-heading" className="mt-8 sm:mt-10">
      <h2
        id="cargo-how-it-works-heading"
        className="text-base font-bold text-slate-900 sm:text-lg dark:text-slate-100"
      >
        {t("cargo.howItWorksTitle")}
      </h2>
      <ol className="mt-3 space-y-2 sm:mt-4">
        {STEPS.map((titleKey, index) => (
          <li
            key={titleKey}
            className="flex gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xs font-bold text-orange-800 dark:bg-slate-800 dark:text-orange-300">
              {index + 1}
            </span>
            <span className="min-w-0 leading-snug text-slate-700 dark:text-slate-200">
              {t(titleKey)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
