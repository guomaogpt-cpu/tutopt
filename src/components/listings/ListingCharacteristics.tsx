"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export type ListingCharacteristicItem = {
  label?: string;
  labelKey?: DictionaryKey;
  value: string;
};

type ListingCharacteristicsProps = {
  items: ListingCharacteristicItem[];
};

export function ListingCharacteristics({ items }: ListingCharacteristicsProps) {
  const { t } = useTranslation();
  const visibleItems = items.filter((item) => item.value.trim().length > 0);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="listing-characteristics-title">
      <h2
        id="listing-characteristics-title"
        className="mb-4 text-lg font-bold text-[#0F172A] sm:text-xl dark:text-slate-100"
      >
        {t("listing.characteristics")}
      </h2>

      <div
        className={cn(
          "rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
        )}
      >
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {visibleItems.map((item) => (
            <div
              key={item.labelKey ?? item.label}
              className="min-w-0 rounded-xl border border-slate-200/70 bg-slate-50 px-3.5 py-3 dark:border-slate-800 dark:bg-slate-950"
            >
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {item.labelKey ? t(item.labelKey) : item.label}
              </dt>
              <dd className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
