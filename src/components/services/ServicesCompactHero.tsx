"use client";

import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { SearchWithSuggest } from "@/components/search/SearchWithSuggest";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { VERTICALS } from "@/features/verticals/verticals";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getVerticalTheme } from "@/lib/vertical-theme";
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

export function ServicesCompactHero(_props: ServicesCompactHeroProps) {
  const { t } = useTranslation();
  const config = VERTICALS.SERVICES;
  const theme = getVerticalTheme("SERVICES");

  return (
    <section
      className={cn(
        "relative min-h-[220px] overflow-hidden border-b shadow-sm md:min-h-[260px]",
        theme.primaryBorder,
      )}
    >
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

      <div className="relative flex min-h-[220px] items-center px-4 py-4 md:min-h-[260px] md:px-0 md:py-6">
        <Container size="lg" className="min-w-0 px-0 sm:px-6 lg:px-8">
          <div className="flex w-full max-w-3xl min-w-0 flex-col gap-2.5 md:gap-3">
            <div>
              <h1 className="text-2xl font-bold leading-snug text-white drop-shadow-sm md:text-3xl">
                {t("services.heroTitle")}
              </h1>
              <p className="mt-1.5 max-w-lg text-sm leading-snug text-white/90 md:text-base">
                {t("services.heroSubtitle")}
              </p>
            </div>

            <SearchWithSuggest
              variant="phrase"
              placeholder={t("services.searchPlaceholder")}
              buttonLabel={t("search.find")}
              className="min-w-0 w-full"
            />

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:flex md:flex-wrap">
              <Button
                className={cn(
                  "h-11 w-full rounded-xl active:scale-[0.98] sm:w-auto",
                  theme.heroCtaSolid,
                )}
                asChild
              >
                <Link href={config.listingsHref}>{t("services.findService")}</Link>
              </Button>
              <Button
                className={cn(
                  "h-11 w-full rounded-xl active:scale-[0.98] sm:w-auto",
                  theme.heroCtaGhost,
                )}
                asChild
              >
                <Link href={config.createListingHref}>{t("services.postService")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
