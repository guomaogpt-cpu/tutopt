"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { VerticalCategoryItem } from "@/components/verticals/VerticalCategoryHighlights";
import { getCategorySeoSlug } from "@/features/seo/category-seo-slug";
import { cn } from "@/lib/utils";

const FEATURED_ROOT_SLUGS = [
  "market-oborudovanie-i-stanki",
  "market-avto-i-moto",
  "market-nedvizhimost",
  "market-telefony-i-elektronika",
  "market-dom-i-sad",
  "market-biznes-i-sklad",
  "market-stroitelstvo-i-remont",
] as const;

const EQUIPMENT_SUBCATEGORY_SLUGS = [
  "market-eq-pischevoe",
  "market-eq-upakovochnoe",
  "market-eq-horeca",
  "market-eq-metalloobrabotka",
  "market-eq-skladskoe",
  "market-eq-nasosy",
] as const;

type MarketCatalogShortcutsProps = {
  categories: VerticalCategoryItem[];
};

function buildCatalogHref(params: Record<string, string>): string {
  const search = new URLSearchParams({ vertical: "MARKET", ...params });
  return `/listings?${search.toString()}`;
}

export function MarketCatalogShortcuts({ categories }: MarketCatalogShortcutsProps) {
  const bySlug = new Map(categories.map((category) => [category.slug, category]));

  const featured = FEATURED_ROOT_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (category): category is VerticalCategoryItem => Boolean(category),
  );

  const equipmentRoot = bySlug.get("market-oborudovanie-i-stanki");
  const equipmentChildren = EQUIPMENT_SUBCATEGORY_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (category): category is VerticalCategoryItem => Boolean(category),
  );

  if (featured.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="market-catalog-shortcuts-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="market-catalog-shortcuts-heading"
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100"
        >
          Быстрые категории
        </h2>
        <Link
          href="/listings?vertical=MARKET"
          className="inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:underline dark:text-violet-300"
        >
          Все объявления
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {featured.map((category) => (
          <Link
            key={category.id}
            href={buildCatalogHref({ category: getCategorySeoSlug(category) })}
            className={cn(
              "flex min-h-11 items-center rounded-xl border border-violet-100 bg-white px-3 py-2.5 text-sm font-medium text-slate-800",
              "transition hover:border-violet-200 hover:bg-violet-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-violet-900 dark:hover:bg-slate-800",
            )}
          >
            <span className="line-clamp-2">{category.name}</span>
          </Link>
        ))}
      </div>

      {equipmentRoot && equipmentChildren.length > 0 ? (
        <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {equipmentRoot.name}
            </p>
            <Link
              href={buildCatalogHref({ category: getCategorySeoSlug(equipmentRoot) })}
              className="text-xs font-medium text-violet-700 hover:underline dark:text-violet-300"
            >
              Смотреть всё
            </Link>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {equipmentChildren.map((category) => (
              <Link
                key={category.id}
                href={buildCatalogHref({
                  category: getCategorySeoSlug(equipmentRoot),
                  subcategory: getCategorySeoSlug(category),
                })}
                className="inline-flex shrink-0 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
