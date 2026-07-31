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
import { getServicesCategoryVisual } from "@/features/services/services-category-visuals";
import { getServicesProfessionBySlug } from "@/features/services/services-professions";
import { getCategorySeoSlug } from "@/features/seo/category-seo-slug";
import { buildVerticalCategoryListingsHref } from "@/features/verticals/vertical-landing-ui";
import { VERTICALS } from "@/features/verticals/verticals";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

export const SERVICES_HERO_BACKGROUND_IMAGE = "/images/tutuslu.png";

export type ServicesCategoryItem = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
};

type ServicesCompactHeroProps = {
  categories: ServicesCategoryItem[];
};

export function ServicesCompactHero({ categories }: ServicesCompactHeroProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const config = VERTICALS.SERVICES;

  const sortedCategories = useMemo(() => {
    return [...categories]
      .map((category) => {
        const seoSlug = getCategorySeoSlug(category);
        const profession = getServicesProfessionBySlug(category.slug);
        return {
          category,
          href: buildVerticalCategoryListingsHref(category.vertical, category.id),
          visual: getServicesCategoryVisual(seoSlug, category.slug),
          title: profession ? t(profession.labelKey) : category.name,
          order: profession?.order ?? getServicesCategoryVisual(seoSlug, category.slug).featuredOrder,
        };
      })
      .sort((a, b) => a.order - b.order);
  }, [categories, t]);

  return (
    <section className="relative min-h-[200px] overflow-hidden border-b border-teal-200/40 shadow-sm md:min-h-[280px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("${SERVICES_HERO_BACKGROUND_IMAGE}")`,
          backgroundPosition: "center right",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/15"
      />

      <div className="relative flex min-h-[200px] items-center px-4 py-4 md:min-h-[280px] md:px-0 md:py-6">
        <Container size="lg" className="min-w-0 px-0 sm:px-6 lg:px-8">
          <div className="flex w-full max-w-3xl min-w-0 flex-col gap-2.5 md:gap-3">
            <div>
              <h1 className="text-lg font-bold leading-snug text-white drop-shadow-sm md:text-2xl">
                {t("services.heroTitle")}
              </h1>
              <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/85 md:text-sm">
                {t("services.heroSubtitle")}
              </p>
            </div>

            <SearchWithSuggest
              variant="phrase"
              placeholder={t("services.searchPlaceholder")}
              buttonLabel={t("search.find")}
              className="min-w-0 w-full"
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button
                className="h-11 w-full rounded-xl bg-white text-teal-800 hover:bg-white/95 active:scale-[0.98] sm:w-auto"
                asChild
              >
                <Link href={config.createListingHref}>{t("services.postService")}</Link>
              </Button>

              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/45 bg-white/15 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25 active:scale-[0.98] sm:w-auto"
                  >
                    <LayoutGrid className="size-4 shrink-0" aria-hidden="true" />
                    {t("services.profession")}
                  </button>
                </DrawerTrigger>

                <DrawerContent
                  side="left"
                  className="w-[min(85vw,22.5rem)] gap-0 p-0 sm:max-w-[26rem]"
                >
                  <DrawerHeader className="border-b border-slate-100 pr-12 dark:border-slate-800">
                    <DrawerTitle>{t("services.professionsTitle")}</DrawerTitle>
                    <DrawerDescription>
                      {t("services.professionsSubtitle")}
                    </DrawerDescription>
                  </DrawerHeader>

                  <nav
                    aria-label={t("services.professionsTitle")}
                    className="min-h-0 flex-1 overflow-y-auto px-3 py-3"
                  >
                    {sortedCategories.length === 0 ? (
                      <p className="px-3 py-6 text-sm text-slate-500 dark:text-slate-400">
                        {t("vertical.categoriesEmpty")}
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {sortedCategories.map(({ category, href, visual, title }) => {
                          const Icon = visual.icon;
                          return (
                            <li key={category.id}>
                              <DrawerClose asChild>
                                <Link
                                  href={href}
                                  className="flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-teal-50 dark:text-slate-100 dark:hover:bg-slate-800"
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
                                  <span className="min-w-0 flex-1 truncate">{title}</span>
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
        </Container>
      </div>
    </section>
  );
}
