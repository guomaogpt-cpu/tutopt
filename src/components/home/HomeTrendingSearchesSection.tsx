"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";

const TRENDING_TAGS: DictionaryKey[] = [
  "home.trend.equipment",
  "home.trend.furniture",
  "home.trend.chinaDelivery",
  "home.trend.wholesaleClothing",
  "home.trend.repair",
  "home.trend.electronics",
  "home.trend.buildingMaterials",
  "home.trend.packaging",
];

export function HomeTrendingSearchesSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#F8FAFC] py-7 sm:py-9 dark:bg-slate-950">
      <Container size="lg">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-100">
          {t("home.trendingSearches")}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {TRENDING_TAGS.map((key) => {
            const label = t(key);
            return (
              <li key={key}>
                <Link
                  href={`/listings?q=${encodeURIComponent(label)}`}
                  className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-slate-800 dark:hover:text-blue-300"
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
