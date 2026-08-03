"use client";

import Link from "next/link";
import { ListingCard } from "@/components/listings/ListingCard";
import {
  ServicesCompactHero,
  type ServicesCategoryItem,
} from "@/components/services/ServicesCompactHero";
import { ServicesHowItWorks } from "@/components/services/ServicesHowItWorks";
import { ServicesProfessionsGrid } from "@/components/services/ServicesProfessionsGrid";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { VerticalLatestHeading } from "@/components/verticals/VerticalLatestSectionLabels";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { VERTICAL_LATEST_LISTINGS_GRID_CLASS } from "@/features/verticals/vertical-landing-ui";
import { VERTICALS } from "@/features/verticals/verticals";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getVerticalTheme } from "@/lib/vertical-theme";
import { cn } from "@/lib/utils";

type ServicesLandingPageProps = {
  categories: ServicesCategoryItem[];
  listings: ListingCardData[];
};

export function ServicesLandingPage({
  categories,
  listings,
}: ServicesLandingPageProps) {
  const { t } = useTranslation();
  const config = VERTICALS.SERVICES;
  const theme = getVerticalTheme("SERVICES");

  return (
    <main
      className={cn(
        "min-w-0 overflow-x-clip bg-gradient-to-b dark:from-slate-950 dark:to-slate-950",
        theme.pageWash,
      )}
    >
      <ServicesCompactHero categories={categories} />
      <ServicesProfessionsGrid categories={categories} />

      <Container size="lg" className="space-y-8 py-5 sm:space-y-10 sm:py-10">
        <section aria-labelledby="services-listings-heading">
          <VerticalLatestHeading
            headingId="services-listings-heading"
            listingsHref={config.listingsHref}
            showAllLink={listings.length > 0}
            linkClassName={cn("shrink-0 text-sm font-medium hover:underline", theme.softLink)}
          />

          {listings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {t("services.emptyTitle")}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {t("services.emptyDescription")}
              </p>
              <div className="mt-5 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
                <Button
                  className={cn("h-11 w-full rounded-xl sm:w-auto", theme.primaryButton)}
                  asChild
                >
                  <Link href={config.createListingHref}>{t("services.postService")}</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className={VERTICAL_LATEST_LISTINGS_GRID_CLASS}>
              {listings.map((listing) => (
                <div key={listing.id} className="min-w-0 w-full">
                  <ListingCard listing={listing} variant="catalog" />
                </div>
              ))}
            </div>
          )}
        </section>

        <ServicesHowItWorks />
      </Container>
    </main>
  );
}
