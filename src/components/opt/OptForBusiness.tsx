"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

const STEPS = [
  "opt.forBusiness.step1",
  "opt.forBusiness.step2",
  "opt.forBusiness.step3",
] as const;

export function OptForBusiness() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="opt-for-business-heading" className="mt-2">
      <h2
        id="opt-for-business-heading"
        className="text-base font-bold text-slate-900 sm:text-lg dark:text-slate-100"
      >
        {t("opt.forBusinessTitle")}
      </h2>
      <ol className="mt-3 space-y-2 sm:mt-4">
        {STEPS.map((key, index) => (
          <li
            key={key}
            className="flex gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-800 dark:bg-slate-800 dark:text-blue-300">
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
