"use client";

import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";

const steps = [
  {
    step: 1,
    titleKey: "howItWorks.step1Title" as DictionaryKey,
    descriptionKey: "howItWorks.step1Description" as DictionaryKey,
  },
  {
    step: 2,
    titleKey: "howItWorks.step2Title" as DictionaryKey,
    descriptionKey: "howItWorks.step2Description" as DictionaryKey,
  },
  {
    step: 3,
    titleKey: "howItWorks.step3Title" as DictionaryKey,
    descriptionKey: "howItWorks.step3Description" as DictionaryKey,
  },
] as const;

export function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section className="border-t border-slate-200 bg-white py-12 sm:py-16 dark:border-slate-800 dark:bg-slate-950">
      <Container>
        <SectionHeading align="center" title={t("howItWorks.title")} />

        <ol className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-3">
          {steps.map((item) => (
            <li
              key={item.step}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {t(item.titleKey)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {t(item.descriptionKey)}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
