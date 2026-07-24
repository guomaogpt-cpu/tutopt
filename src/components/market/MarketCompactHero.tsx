"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ListingVertical } from "@prisma/client";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { HomeHeroSearch } from "@/components/home/HomeHeroSearch";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getMarketCategoryVisual } from "@/features/market/market-category-visuals";
import { getCategorySeoSlug } from "@/features/seo/category-seo-slug";
import { VERTICALS } from "@/features/verticals/verticals";
import { cn } from "@/lib/utils";

export type MarketCategoryItem = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
};

type MarketCompactHeroProps = {
  categories: MarketCategoryItem[];
};

export function MarketCompactHero({ categories }: MarketCompactHeroProps) {
  const [open, setOpen] = useState(false);
  const config = VERTICALS.MARKET;

  const sortedCategories = useMemo(() => {
    return [...categories]
      .map((category) => {
        const seoSlug = getCategorySeoSlug(category);
        return {
          category,
          href: `/market/${seoSlug}`,
          visual: getMarketCategoryVisual(seoSlug, category.slug),
        };
      })
      .sort((a, b) => a.visual.featuredOrder - b.visual.featuredOrder);
  }, [categories]);

  return (
    <section className="border-b border-indigo-200 bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 shadow-sm">
      <div className="px-4 py-8 md:px-0 md:py-10">
        <Container size="lg" className="min-w-0 px-0 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Объявления
          </h1>

          <div className="mt-4 w-full min-w-0">
            <HomeHeroSearch
              placeholder="Найти товар или объявление..."
              buttonLabel="Найти"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:flex md:flex-wrap">
            <Button
              className="h-11 w-full rounded-xl bg-white text-indigo-700 hover:bg-white/95 active:scale-[0.98] md:w-auto"
              asChild
            >
              <Link href={config.createListingHref}>Подать объявление</Link>
            </Button>

            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.98] md:w-auto"
                >
                  <LayoutGrid className="size-4 shrink-0" aria-hidden="true" />
                  Категории
                </button>
              </DrawerTrigger>

              <DrawerContent
                side="left"
                className="w-[min(85vw,22.5rem)] gap-0 p-0 sm:max-w-[26rem]"
              >
                <DrawerHeader className="border-b border-slate-100 pr-12">
                  <DrawerTitle>Категории</DrawerTitle>
                  <DrawerDescription>
                    Выберите раздел объявлений
                  </DrawerDescription>
                </DrawerHeader>

                <nav
                  aria-label="Категории объявлений"
                  className="min-h-0 flex-1 overflow-y-auto px-3 py-3"
                >
                  {sortedCategories.length === 0 ? (
                    <p className="px-3 py-6 text-sm text-slate-500">
                      Категории появятся после запуска раздела
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {sortedCategories.map(({ category, href, visual }) => {
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
                                <span className="min-w-0 flex-1 truncate">
                                  {category.name}
                                </span>
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
                  )}
                </nav>
              </DrawerContent>
            </Drawer>
          </div>
        </Container>
      </div>
    </section>
  );
}
