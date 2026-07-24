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
import type {
  VerticalCategoryAccent,
  VerticalCategoryAccentTheme,
  VerticalCategoryVisual,
} from "@/features/verticals/vertical-category-visual-types";
import { VERTICALS } from "@/features/verticals/verticals";
import { cn } from "@/lib/utils";

export type VerticalCategoryItem = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
};

const ACCENT_THEMES: Record<VerticalCategoryAccent, VerticalCategoryAccentTheme> = {
  violet: {
    buttonBorder: "border-violet-200",
    buttonText: "text-violet-800",
    buttonHover: "hover:border-violet-300 hover:bg-violet-50",
    cardBorder: "border-violet-100/80",
    cardHoverBorder: "hover:border-violet-200",
    cardHoverShadow: "hover:shadow-[0_10px_24px_rgba(91,33,182,0.08)]",
    arrow: "text-violet-400",
    arrowHover: "group-hover:text-violet-600",
    listHover: "hover:bg-violet-50",
  },
  blue: {
    buttonBorder: "border-blue-200",
    buttonText: "text-blue-800",
    buttonHover: "hover:border-blue-300 hover:bg-blue-50",
    cardBorder: "border-blue-100/80",
    cardHoverBorder: "hover:border-blue-200",
    cardHoverShadow: "hover:shadow-[0_10px_24px_rgba(37,99,235,0.08)]",
    arrow: "text-blue-400",
    arrowHover: "group-hover:text-blue-600",
    listHover: "hover:bg-blue-50",
  },
};

type VerticalCategoryHighlightsProps = {
  vertical: ListingVertical;
  categories: VerticalCategoryItem[];
  accent: VerticalCategoryAccent;
  getVisual: (seoSlug: string, dbSlug: string) => VerticalCategoryVisual;
  headingId?: string;
  drawerDescription?: string;
  drawerNavLabel?: string;
};

export function VerticalCategoryHighlights({
  vertical,
  categories,
  accent,
  getVisual,
  headingId = "vertical-categories-heading",
  drawerDescription,
  drawerNavLabel = "Все категории",
}: VerticalCategoryHighlightsProps) {
  const [open, setOpen] = useState(false);
  const theme = ACCENT_THEMES[accent];
  const config = VERTICALS[vertical];

  const enriched = useMemo(() => {
    return categories
      .map((category) => {
        const seoSlug = getCategorySeoSlug(category);
        const visual = getVisual(seoSlug, category.slug);
        return {
          category,
          seoSlug,
          visual,
          href: `/${config.slug}/${seoSlug}`,
        };
      })
      .sort((a, b) => a.visual.featuredOrder - b.visual.featuredOrder);
  }, [categories, config.slug, getVisual]);

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
    <section aria-labelledby={headingId} className="min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id={headingId}
          className="text-lg font-semibold tracking-tight text-[#0F172A]"
        >
          Категории
        </h2>

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border bg-white px-4 text-sm font-semibold shadow-[0_4px_12px_rgba(15,23,42,0.03)] transition sm:h-10 sm:w-auto",
                theme.buttonBorder,
                theme.buttonText,
                theme.buttonHover,
              )}
            >
              <LayoutGrid className="size-4 shrink-0" aria-hidden="true" />
              Все категории
            </button>
          </DrawerTrigger>

          <DrawerContent side="right" className="w-[min(100%,22rem)] gap-0 p-0 sm:max-w-sm">
            <DrawerHeader className="border-b border-slate-100 pr-12">
              <DrawerTitle>Все категории</DrawerTitle>
              <DrawerDescription>
                {drawerDescription ?? `Раздел «${config.label}» — выберите категорию`}
              </DrawerDescription>
            </DrawerHeader>

            <nav
              aria-label={drawerNavLabel}
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
                          className={cn(
                            "flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 transition",
                            theme.listHover,
                          )}
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
                className={cn(
                  "group flex h-full min-h-[108px] flex-col justify-between rounded-2xl border bg-white p-3.5 shadow-[0_4px_14px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 sm:min-h-[120px] sm:p-4",
                  theme.cardBorder,
                  theme.cardHoverBorder,
                  theme.cardHoverShadow,
                )}
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
                    className={cn(
                      "mb-0.5 size-4 shrink-0 transition group-hover:translate-x-0.5",
                      theme.arrow,
                      theme.arrowHover,
                    )}
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
