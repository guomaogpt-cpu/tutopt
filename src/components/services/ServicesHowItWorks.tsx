"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

const STEPS = [
  "services.howItWorks.step1",
  "services.howItWorks.step2",
  "services.howItWorks.step3",
] as const;

export function ServicesHowItWorks() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="services-how-it-works-heading" className="mt-2">
      <h2
        id="services-how-it-works-heading"
        className="text-base font-bold text-slate-900 sm:text-lg dark:text-slate-100"
      >
        {t("services.howItWorksTitle")}
      </h2>
      <ol className="mt-3 space-y-2 sm:mt-4">
        {STEPS.map((key, index) => (
          <li
            key={key}
            className="flex gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-green-100 text-xs font-bold text-green-800 dark:bg-slate-800 dark:text-green-300">
              {index + 1}
            </span>
            <span className="min-w-0 leading-snug text-slate-700 dark:text-slate-200">
              {t(key)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
