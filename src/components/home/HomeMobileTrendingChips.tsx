"use client";

import Link from "next/link";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type TrendChip = {
  labelKey: DictionaryKey;
  href: string;
};

const MOBILE_TREND_CHIPS: TrendChip[] = [
  {
    labelKey: "home.trendChip.equipment",
    href: "/listings?vertical=MARKET&category=oborudovanie-i-stanki",
  },
  { labelKey: "nav.cargo", href: "/cargo" },
  {
    labelKey: "home.trendChip.electronics",
    href: "/listings?vertical=MARKET&category=telefony-i-elektronika",
  },
  { labelKey: "nav.services", href: "/services" },
  { labelKey: "nav.opt", href: "/opt" },
];

/** Compact horizontal chips below home sections (mobile only). */
export function HomeMobileTrendingChips() {
  const { t } = useTranslation();

  return (
    <div className="sm:hidden">
      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
        {t("home.trendingShortLabel")}
      </p>
      <ul
        className="mt-1.5 flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={t("home.trendingSearches")}
      >
        {MOBILE_TREND_CHIPS.map((chip) => (
          <li key={chip.href} className="shrink-0">
            <Link
              href={chip.href}
              className={cn(
                "inline-flex h-7 items-center rounded-full border border-slate-200 bg-white px-2.5",
                "text-[11px] font-medium text-slate-700",
                "dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200",
              )}
            >
              {t(chip.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
