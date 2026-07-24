"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ListingVertical } from "@prisma/client";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { SearchWithSuggest } from "@/components/search/SearchWithSuggest";
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

export const MARKET_HERO_BACKGROUND_IMAGE = "/images/tutoby.png";

export type MarketCategoryItem = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
};

type MarketCompactHeroProps = {
  categories: MarketCategoryItem[];
  listingCount: number;
};

export function MarketCompactHero({
  categories,
  listingCount,
}: MarketCompactHeroProps) {
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

  const listingCountLabel = new Intl.NumberFormat("ru-RU").format(listingCount);

  return (
    <section className="relative min-h-[300px] overflow-hidden border-b border-indigo-200/40 shadow-sm md:h-[300px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("${MARKET_HERO_BACKGROUND_IMAGE}")`,
          backgroundPosition: "center right",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-transparent"
      />

      <div className="relative flex min-h-[300px] items-center py-6 md:h-full md:py-0 px-4 md:px-0">
        <Container size="lg" className="min-w-0 px-0 sm:px-6 lg:px-8">
          <div className="flex w-full min-w-0 items-center justify-between gap-6 lg:gap-8">
            <div className="min-w-0 w-full max-w-[45rem]">
              <div className="flex w-full min-w-0 flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <h1 className="shrink-0 text-lg font-medium leading-tight text-white drop-shadow-sm md:text-xl">
                  Ищите{" "}
                  <span className="font-bold text-white">объявления</span>
                </h1>

                <SearchWithSuggest
                  variant="phrase"
                  placeholder="Найти товар или объявление..."
                  buttonLabel="Найти"
                  className="min-w-0 flex-1"
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
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/45 bg-white/15 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25 active:scale-[0.98] md:w-auto"
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
                                        className={cn(
                                          "size-4",
                                          visual.iconClassName,
                                        )}
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
            </div>

            <div
              className="hidden shrink-0 gap-3 md:flex"
              aria-label="Статистика раздела"
            >
              <div className="flex size-[104px] flex-col items-center justify-center rounded-2xl border border-white/25 bg-white/15 px-2 text-center text-white shadow-sm backdrop-blur-md">
                <span className="text-2xl font-bold leading-none tracking-tight">
                  {listingCountLabel}
                </span>
                <span className="mt-1.5 text-xs font-medium leading-tight text-white/90">
                  объявлений
                </span>
              </div>
              <div className="flex size-[104px] flex-col items-center justify-center rounded-2xl border border-white/25 bg-white/15 px-2 text-center text-white shadow-sm backdrop-blur-md">
                <span className="text-2xl font-bold leading-none tracking-tight">
                  24/7
                </span>
                <span className="mt-1.5 text-xs font-medium leading-tight text-white/90">
                  просмотры объявлений
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
