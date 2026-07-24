"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ListingVertical } from "@prisma/client";
import { ArrowRight, ChevronRight, LayoutGrid } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getCategorySeoSlug } from "@/features/seo/category-seo-slug";
import { getMarketCategoryVisual } from "@/features/market/market-category-visuals";
import { cn } from "@/lib/utils";

export type MarketCategoryItem = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
};

type MarketCategoryHighlightsProps = {
  categories: MarketCategoryItem[];
};

function categoryHref(category: MarketCategoryItem): string {
  return `/market/${getCategorySeoSlug(category)}`;
}

export function MarketCategoryHighlights({
  categories,
}: MarketCategoryHighlightsProps) {
  const [open, setOpen] = useState(false);

  const enriched = useMemo(() => {
    return categories
      .map((category) => {
        const seoSlug = getCategorySeoSlug(category);
        const visual = getMarketCategoryVisual(seoSlug);
        return { category, seoSlug, visual, href: categoryHref(category) };
      })
      .sort((a, b) => a.visual.featuredOrder - b.visual.featuredOrder);
  }, [categories]);

  const featured = enriched.filter((item) => item.visual.featured).slice(0, 8);
  const allCategories = enriched;

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white px-5 py-7 text-sm text-[#64748B]">
        Категории появятся после запуска раздела
      </div>
    );
  }

  return (
    <section aria-labelledby="market-categories-heading" className="min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="market-categories-heading"
          className="text-lg font-semibold tracking-tight text-[#0F172A]"
        >
          Категории
        </h2>

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button
              type="button"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 text-sm font-semibold text-violet-800 shadow-[0_4px_12px_rgba(15,23,42,0.03)] transition hover:border-violet-300 hover:bg-violet-50 sm:h-10 sm:w-auto"
            >
              <LayoutGrid className="size-4 shrink-0" aria-hidden="true" />
              Все категории
            </button>
          </DrawerTrigger>

          <DrawerContent side="right" className="w-[min(100%,22rem)] gap-0 p-0 sm:max-w-sm">
            <DrawerHeader className="border-b border-slate-100 pr-12">
              <DrawerTitle>Все категории</DrawerTitle>
              <DrawerDescription>
                Раздел «Объявления» — выберите категорию
              </DrawerDescription>
            </DrawerHeader>

            <nav
              aria-label="Все категории объявлений"
              className="min-h-0 flex-1 overflow-y-auto px-3 py-3"
            >
              <ul className="space-y-1">
                {allCategories.map(({ category, visual, href }) => {
                  const Icon = visual.icon;
                  return (
                    <li key={category.id}>
                      <DrawerClose asChild>
                        <Link
                          href={href}
                          className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-violet-50"
                        >
                          <span
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-xl",
                              visual.chipClassName,
                            )}
                          >
                            <Icon
                              className={cn("size-4", visual.iconClassName)}
                              aria-hidden="true"
                            />
                          </span>
                          <span className="min-w-0 flex-1 truncate">{category.name}</span>
                          <ChevronRight
                            className="size-4 shrink-0 text-slate-400"
                            aria-hidden="true"
                          />
                        </Link>
                      </DrawerClose>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </DrawerContent>
        </Drawer>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
        {featured.map(({ category, visual, href }) => {
          const Icon = visual.icon;
          return (
            <li key={category.id} className="min-w-0">
              <Link
                href={href}
                className="group flex h-full min-h-[108px] flex-col justify-between rounded-2xl border border-violet-100/80 bg-white p-3.5 shadow-[0_4px_14px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_10px_24px_rgba(91,33,182,0.08)] sm:min-h-[120px] sm:p-4"
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-2xl sm:size-11",
                    visual.chipClassName,
                  )}
                >
                  <Icon
                    className={cn("size-5", visual.iconClassName)}
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-3 flex items-end justify-between gap-2">
                  <span className="line-clamp-2 text-sm font-semibold leading-snug text-slate-800">
                    {category.name}
                  </span>
                  <ArrowRight
                    className="mb-0.5 size-4 shrink-0 text-violet-400 transition group-hover:translate-x-0.5 group-hover:text-violet-600"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
