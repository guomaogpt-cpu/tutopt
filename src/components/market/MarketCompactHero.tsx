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

export function MarketCompactHero({ listingCount }: MarketCompactHeroProps) {
  const { t } = useTranslation();
  const config = VERTICALS.MARKET;
  const theme = getVerticalTheme("MARKET");
  const listingCountLabel = new Intl.NumberFormat("ru-RU").format(listingCount);

  return (
    <section
      className={cn(
        "relative min-h-[240px] overflow-hidden border-b shadow-sm md:h-[280px] md:min-h-[280px]",
        theme.primaryBorder,
      )}
    >
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
        className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/20 to-transparent"
      />

      <div className="relative flex min-h-[240px] items-center px-4 py-5 md:h-full md:min-h-[280px] md:px-0 md:py-0">
        <Container size="lg" className="min-w-0 px-0 sm:px-6 lg:px-8">
          <div className="flex w-full min-w-0 items-center justify-between gap-6 lg:gap-8">
            <div className="min-w-0 w-full max-w-[45rem]">
              <h1 className="text-2xl font-bold leading-tight text-white drop-shadow-sm md:text-3xl">
                {t("market.heroTitle")}
              </h1>
              <p className="mt-1.5 max-w-lg text-sm text-white/90 md:text-base">
                {t("market.heroSubtitle")}
              </p>

              <div className="mt-4">
                <SearchWithSuggest
                  variant="phrase"
                  placeholder={t("search.marketPlaceholder")}
                  buttonLabel={t("search.find")}
                  className="min-w-0 w-full"
                />
              </div>

              <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:flex md:flex-wrap">
                <Button
                  className={cn(
                    "h-11 w-full rounded-xl active:scale-[0.98] md:w-auto",
                    theme.heroCtaSolid,
                  )}
                  asChild
                >
                  <Link href={config.listingsHref}>{t("buyer.findProduct")}</Link>
                </Button>
                <Button
                  className={cn(
                    "h-11 w-full rounded-xl active:scale-[0.98] md:w-auto",
                    theme.heroCtaGhost,
                  )}
                  asChild
                >
                  <Link href={config.createListingHref}>{t("vertical.postListing")}</Link>
                </Button>
              </div>
            </div>

            <div
              className="hidden shrink-0 gap-3 md:flex"
              aria-label={t("vertical.statsLabel")}
            >
              <div className="flex size-[104px] flex-col items-center justify-center rounded-2xl border border-white/25 bg-white/15 px-2 text-center text-white shadow-sm backdrop-blur-md">
                <span className="text-2xl font-bold leading-none tracking-tight">
                  {listingCountLabel}
                </span>
                <span className="mt-1.5 text-xs font-medium leading-tight text-white/90">
                  {t("vertical.statsListings")}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
