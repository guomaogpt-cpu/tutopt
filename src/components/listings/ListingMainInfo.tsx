"use client";

import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

export type ListingMainInfoItem = {
  labelKey: DictionaryKey;
  value: string;
};

type ListingMainInfoProps = {
  items: ListingMainInfoItem[];
  className?: string;
};

export function ListingMainInfo({ items, className }: ListingMainInfoProps) {
  const { t } = useTranslation();
  const visibleItems = items.filter((item) => item.value.trim().length > 0);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="listing-main-info-title"
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 sm:p-4",
        className,
      )}
    >
      <h2
        id="listing-main-info-title"
        className="text-sm font-semibold text-slate-900 dark:text-slate-100"
      >
        {t("listing.mobile.mainInfo")}
      </h2>

      <dl className="mt-3 grid grid-cols-2 gap-2.5">
        {visibleItems.map((item) => (
          <div
            key={item.labelKey}
            className="min-w-0 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-950"
          >
            <dt className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {t(item.labelKey)}
            </dt>
            <dd className="mt-0.5 break-words text-sm font-semibold text-slate-900 dark:text-slate-100">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
