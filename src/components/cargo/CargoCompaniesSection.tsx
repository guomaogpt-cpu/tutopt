"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import { CargoVerifiedFilter } from "@/components/cargo/CargoVerifiedFilter";
import { CompanyVerificationBadge } from "@/components/company/CompanyVerificationBadge";
import { Button } from "@/components/ui/button";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { VERTICALS } from "@/features/verticals/verticals";
import type { CompanyVerificationStatus } from "@prisma/client";
import { useTranslation } from "@/lib/i18n/useTranslation";

type CargoCompaniesSectionProps = {
  listings: ListingCardData[];
  onCreateRequest: () => void;
};

export function CargoCompaniesSection({
  listings,
  onCreateRequest,
}: CargoCompaniesSectionProps) {
  const { t } = useTranslation();
  const config = VERTICALS.CARGO;

  return (
    <section aria-labelledby="cargo-companies-heading" className="mt-8 sm:mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="cargo-companies-heading"
            className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg"
          >
            {t("cargo.companiesTitle")}
          </h2>
          <CargoVerifiedFilter />
        </div>
        {listings.length > 0 ? (
          <Link
            href={config.listingsHref}
            className="shrink-0 text-sm font-medium text-orange-700 hover:underline dark:text-orange-300"
          >
            {t("vertical.allListings")}
          </Link>
        ) : null}
      </div>

      {listings.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {t("cargo.noCompaniesTitle")}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {t("cargo.noCompaniesDescription")}
          </p>
          <Button
            asChild
            className="mt-4 h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600 sm:w-auto"
          >
            <Link href={config.createListingHref}>{t("cargo.addCompanyButton")}</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => {
            const imageUrl = listing.images[0]?.url
              ? normalizeListingImageUrl(listing.images[0].url)
              : null;
            const isVerified = listing.sellerProfile.verification_status === "VERIFIED";

            return (
              <article
                key={listing.id}
                className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
              >
                <Link
                  href={`/listings/${listing.id}`}
                  className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={listing.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <Building2 className="size-8" aria-hidden="true" />
                    </div>
                  )}
                </Link>

                <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-4">
                  <div className="flex flex-wrap items-start gap-2">
                    <h3 className="min-w-0 flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <Link
                        href={`/listings/${listing.id}`}
                        className="line-clamp-2 transition hover:text-orange-600 dark:hover:text-orange-400"
                      >
                        {listing.title}
                      </Link>
                    </h3>
                    {isVerified ? (
                      <CompanyVerificationBadge
                        status={
                          listing.sellerProfile.verification_status as CompanyVerificationStatus
                        }
                        isCargo
                        compact
                      />
                    ) : null}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {listing.category.name}
                  </p>
                  {listing.city?.name ? (
                    <p className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                      {listing.city.name}
                    </p>
                  ) : null}
                  {isVerified ? (
                    <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
                      {t("cargo.verifiedCargoCompany")}
                    </p>
                  ) : null}

                  <div className="mt-auto grid grid-cols-1 gap-2 pt-2 min-[380px]:grid-cols-2">
                    <Button
                      asChild
                      variant="outline"
                      className="h-11 rounded-xl dark:border-slate-700"
                    >
                      <Link href={`/listings/${listing.id}`}>{t("accountListings.open")}</Link>
                    </Button>
                    <Button
                      type="button"
                      onClick={onCreateRequest}
                      className="h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                    >
                      {t("cargo.createRequest")}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
