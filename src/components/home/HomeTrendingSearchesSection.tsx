"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const TRENDING_TAGS: DictionaryKey[] = [
  "home.trend.equipment",
  "home.trend.furniture",
  "home.trend.chinaDelivery",
  "home.trend.wholesaleClothing",
  "home.trend.repair",
  "home.trend.electronics",
  "home.trend.packaging",
];

type HomeTrendingSearchesSectionProps = {
  /** Dense strip under home entry tiles (first screen). */
  compact?: boolean;
};

export function HomeTrendingSearchesSection({
  compact = false,
}: HomeTrendingSearchesSectionProps) {
  const { t } = useTranslation();

  return (
    <section
      className={cn(
        "dark:bg-slate-950",
        compact
          ? "bg-[#F8FAFC] pb-2 pt-0 sm:bg-[#F8FAFC] sm:py-5 dark:sm:bg-slate-950"
          : "bg-[#F8FAFC] py-7 sm:py-9",
      )}
      aria-labelledby="home-trending-heading"
    >
      <Container size="lg">
        <h2
          id="home-trending-heading"
          className={cn(
            "font-bold tracking-tight text-slate-900 dark:text-slate-100",
            compact ? "text-sm sm:text-lg" : "text-lg sm:text-xl",
          )}
        >
          {t("home.trendingSearches")}
        </h2>
        <ul
          className={cn(
            "mt-2.5 flex gap-2 sm:mt-3.5 sm:flex-wrap",
            // Mobile: single-row horizontal scroll so the strip stays short
            "overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:overflow-visible",
          )}
        >
          {TRENDING_TAGS.map((key) => {
            const label = t(key);
            return (
              <li key={key} className="shrink-0">
                <Link
                  href={`/listings?q=${encodeURIComponent(label)}`}
                  className={cn(
                    "inline-flex items-center rounded-full border border-slate-200 bg-white font-medium text-slate-700 transition",
                    "hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700",
                    "dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200",
                    "dark:hover:border-blue-700 dark:hover:bg-slate-800 dark:hover:text-blue-300",
                    compact
                      ? "h-8 px-3 text-xs sm:h-9 sm:px-3.5 sm:text-sm"
                      : "h-9 px-3.5 text-sm",
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
