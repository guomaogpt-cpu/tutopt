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
import { getCargoCategoryVisual } from "@/features/cargo/cargo-category-visuals";
import { getCategorySeoSlug } from "@/features/seo/category-seo-slug";
import { buildVerticalCategoryListingsHref } from "@/features/verticals/vertical-landing-ui";
import { VERTICALS } from "@/features/verticals/verticals";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

export const CARGO_HERO_BACKGROUND_IMAGE = "/images/tutkar.png";

export type CargoCategoryItem = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
};

type CargoCompactHeroProps = {
  categories: CargoCategoryItem[];
};

export function CargoCompactHero({ categories }: CargoCompactHeroProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const config = VERTICALS.CARGO;

  const sortedCategories = useMemo(() => {
    return [...categories]
      .map((category) => {
        const seoSlug = getCategorySeoSlug(category);
        return {
          category,
          href: buildVerticalCategoryListingsHref(
            category.vertical,
            category.id,
          ),
          visual: getCargoCategoryVisual(seoSlug, category.slug),
        };
      })
      .sort((a, b) => a.visual.featuredOrder - b.visual.featuredOrder);
  }, [categories]);

  return (
    <section className="relative min-h-[260px] overflow-hidden border-b border-rose-200/40 shadow-sm md:h-[300px] md:min-h-[300px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("${CARGO_HERO_BACKGROUND_IMAGE}")`,
          backgroundPosition: "center right",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/15"
      />

      <div className="relative flex min-h-[260px] items-center px-4 py-5 md:h-full md:min-h-[300px] md:px-0 md:py-0">
        <Container size="lg" className="min-w-0 px-0 sm:px-6 lg:px-8">
          <div className="flex w-full max-w-3xl min-w-0 flex-col gap-2.5 md:gap-3">
            <div>
              <h1 className="text-lg font-bold leading-snug text-white drop-shadow-sm md:text-2xl">
                {t("cargo.heroTitle")}
              </h1>
              <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/85 md:text-sm">
                {t("cargo.heroSubtitle")}
              </p>
            </div>

            <SearchWithSuggest
              variant="phrase"
              placeholder={t("search.cargoPlaceholder")}
              buttonLabel={t("search.find")}
              className="min-w-0 w-full"
            />
          </div>

          <div className="mt-4 grid max-w-5xl grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:flex md:flex-wrap">
            <Button
              className="h-11 w-full rounded-xl bg-white text-rose-700 hover:bg-white/95 active:scale-[0.98] md:w-auto"
              asChild
            >
              <Link href={config.createListingHref}>
                {t("cargo.addCompanyButton")}
              </Link>
            </Button>

            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/45 bg-white/15 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25 active:scale-[0.98] md:w-auto"
                >
                  <LayoutGrid className="size-4 shrink-0" aria-hidden="true" />
                  {t("vertical.categories")}
                </button>
              </DrawerTrigger>

              <DrawerContent
                side="left"
                className="w-[min(85vw,22.5rem)] gap-0 p-0 sm:max-w-[26rem]"
              >
                <DrawerHeader className="border-b border-slate-100 pr-12">
                  <DrawerTitle>{t("vertical.categories")}</DrawerTitle>
                  <DrawerDescription>
                    {t("vertical.categoriesDescCargo")}
                  </DrawerDescription>
                </DrawerHeader>

                <nav
                  aria-label={t("vertical.categories")}
                  className="min-h-0 flex-1 overflow-y-auto px-3 py-3"
                >
                  {sortedCategories.length === 0 ? (
                    <p className="px-3 py-6 text-sm text-slate-500">
                      {t("vertical.categoriesEmpty")}
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
                                className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-rose-50"
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
