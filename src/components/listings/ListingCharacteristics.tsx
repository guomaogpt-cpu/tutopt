"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export type ListingCharacteristicItem = {
  label?: string;
  labelKey?: DictionaryKey;
  value?: string;
  valueKey?: DictionaryKey;
};

type ListingCharacteristicsProps = {
  items: ListingCharacteristicItem[];
  title?: string;
  titleKey?: DictionaryKey;
  headingId?: string;
  /** Collapse long lists on mobile by default. */
  collapsibleOnMobile?: boolean;
  mobileCollapseThreshold?: number;
};

export function ListingCharacteristics({
  items,
  title,
  titleKey,
  headingId = "listing-characteristics-title",
  collapsibleOnMobile = true,
  mobileCollapseThreshold = 4,
}: ListingCharacteristicsProps) {
  const { t } = useTranslation();
  const visibleItems = items.filter((item) => {
    if (item.valueKey) {
      return true;
    }
    return Boolean(item.value?.trim());
  });
  const [expanded, setExpanded] = useState(false);

  if (visibleItems.length === 0) {
    return null;
  }

  const shouldCollapse =
    collapsibleOnMobile && visibleItems.length > mobileCollapseThreshold;
  const mobileItems =
    shouldCollapse && !expanded
      ? visibleItems.slice(0, mobileCollapseThreshold)
      : visibleItems;
  const heading =
    title?.trim() || (titleKey ? t(titleKey) : t("listingCharacteristics.detailTitle"));

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
        <h2
          id={headingId}
          className="text-lg font-bold text-[#0F172A] sm:text-xl dark:text-slate-100"
        >
          {heading}
        </h2>

        {shouldCollapse ? (
          <button
            type="button"
            className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-blue-600 lg:hidden dark:text-blue-400"
            aria-expanded={expanded}
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? t("listing.showLess") : t("listing.showMore")}
            <ChevronDown
              className={cn("size-4 transition", expanded && "rotate-180")}
              aria-hidden="true"
            />
          </button>
        ) : null}
      </div>

      <div
        className={cn(
          "rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
        )}
      >
        <dl className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-2">
          {visibleItems.map((item) => {
            const key = item.labelKey ?? item.label ?? item.valueKey ?? item.value;
            const isHiddenOnMobile =
              shouldCollapse &&
              !expanded &&
              !mobileItems.some(
                (visible) =>
                  (visible.labelKey ?? visible.label) === (item.labelKey ?? item.label),
              );

            return (
              <div
                key={key}
                className={cn(
                  "min-w-0 rounded-xl border border-slate-200/70 bg-slate-50 px-3 py-2.5 sm:px-3.5 sm:py-3 dark:border-slate-800 dark:bg-slate-950",
                  isHiddenOnMobile && "hidden lg:block",
                )}
              >
                <dt className="text-[11px] font-medium text-slate-500 sm:text-xs dark:text-slate-400">
                  {item.labelKey ? t(item.labelKey) : item.label}
                </dt>
                <dd className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.valueKey ? t(item.valueKey) : item.value}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
