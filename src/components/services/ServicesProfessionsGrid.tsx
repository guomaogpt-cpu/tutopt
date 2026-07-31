"use client";

import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { getServicesCategoryVisual } from "@/features/services/services-category-visuals";
import { getServicesProfessionBySlug } from "@/features/services/services-professions";
import { getCategorySeoSlug } from "@/features/seo/category-seo-slug";
import { buildVerticalCategoryListingsHref } from "@/features/verticals/vertical-landing-ui";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

export type ServicesProfessionCategory = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
};

type ServicesProfessionsGridProps = {
  categories: ServicesProfessionCategory[];
};

export function ServicesProfessionsGrid({ categories }: ServicesProfessionsGridProps) {
  const { t } = useTranslation();

  const tiles = [...categories]
    .map((category) => {
      const profession = getServicesProfessionBySlug(category.slug);
      const seoSlug = getCategorySeoSlug(category);
      const visual = getServicesCategoryVisual(seoSlug, category.slug);
      return {
        category,
        href: buildVerticalCategoryListingsHref(category.vertical, category.id),
        title: profession ? t(profession.labelKey) : category.name,
        order: profession?.order ?? visual.featuredOrder,
        visual,
      };
    })
    .sort((a, b) => a.order - b.order);

  if (tiles.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="services-professions-heading"
      className="border-b border-teal-100/80 bg-white py-4 dark:border-slate-800 dark:bg-slate-950 sm:py-6"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 sm:mb-4">
          <h2
            id="services-professions-heading"
            className="text-base font-bold tracking-tight text-slate-900 sm:text-lg dark:text-slate-100"
          >
            {t("services.professionsTitle")}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            {t("services.professionsSubtitle")}
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
          {tiles.map(({ category, href, title, visual }) => {
            const Icon = visual.icon;
            return (
              <li key={category.id} className="min-w-0">
                <Link
                  href={href}
                  className={cn(
                    "flex h-full min-h-[88px] flex-col gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 transition",
                    "hover:border-teal-300 hover:bg-teal-50/60",
                    "dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700 dark:hover:bg-slate-800",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg",
                      visual.chipClassName,
                    )}
                  >
                    <Icon className={cn("size-4", visual.iconClassName)} aria-hidden="true" />
                  </span>
                  <span className="line-clamp-2 text-xs font-semibold leading-snug text-slate-900 dark:text-slate-100 sm:text-sm">
                    {title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
