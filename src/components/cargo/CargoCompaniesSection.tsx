"use client";

import Link from "next/link";
import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { VERTICAL_LATEST_LISTINGS_GRID_CLASS } from "@/features/verticals/vertical-landing-ui";
import { VERTICALS } from "@/features/verticals/verticals";
import { useTranslation } from "@/lib/i18n/useTranslation";

type CargoCompaniesSectionProps = {
  listings: ListingCardData[];
};

export function CargoCompaniesSection({ listings }: CargoCompaniesSectionProps) {
  const { t } = useTranslation();
  const config = VERTICALS.CARGO;

  return (
    <section aria-labelledby="cargo-companies-heading" className="mt-10 sm:mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="cargo-companies-heading"
          className="text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100"
        >
          {t("cargo.companiesTitle")}
        </h2>
        {listings.length > 0 ? (
          <Link
            href={config.listingsHref}
            className="shrink-0 text-sm font-medium text-rose-700 hover:underline dark:text-rose-300"
          >
            {t("vertical.allListings")}
          </Link>
        ) : null}
      </div>

      {listings.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {t("cargo.companyEmptyTitle")}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {t("cargo.companyEmptyDescription")}
          </p>
          <Button
            asChild
            className="mt-4 h-11 w-full rounded-xl bg-rose-600 text-white hover:bg-rose-700 sm:w-auto"
          >
            <Link href={config.createListingHref}>{t("cargo.addCompanyButton")}</Link>
          </Button>
        </div>
      ) : (
        <div className={`mt-4 ${VERTICAL_LATEST_LISTINGS_GRID_CLASS}`}>
          {listings.map((listing) => (
            <div key={listing.id} className="min-w-0 w-full">
              <ListingCard listing={listing} variant="catalog" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
