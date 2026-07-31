"use client";

import { ClipboardList, MapPinned, MessagesSquare, Package } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const STEPS = [
  {
    icon: Package,
    titleKey: "cargo.howItWorks.step1.title" as const,
    descriptionKey: "cargo.howItWorks.step1.description" as const,
  },
  {
    icon: MapPinned,
    titleKey: "cargo.howItWorks.step2.title" as const,
    descriptionKey: "cargo.howItWorks.step2.description" as const,
  },
  {
    icon: ClipboardList,
    titleKey: "cargo.howItWorks.step3.title" as const,
    descriptionKey: "cargo.howItWorks.step3.description" as const,
  },
  {
    icon: MessagesSquare,
    titleKey: "cargo.howItWorks.step4.title" as const,
    descriptionKey: "cargo.howItWorks.step4.description" as const,
  },
] as const;

export function CargoHowItWorks() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="cargo-how-it-works-heading" className="mt-10 sm:mt-12">
      <h2
        id="cargo-how-it-works-heading"
        className="text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100"
      >
        {t("cargo.howItWorksTitle")}
      </h2>

      <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.titleKey}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-2">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700 dark:bg-slate-800 dark:text-rose-300">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t(step.titleKey)}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {t(step.descriptionKey)}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
