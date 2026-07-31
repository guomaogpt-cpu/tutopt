"use client";

import type { ListingVertical } from "@prisma/client";
import { MapPin } from "lucide-react";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type ListingMobileSummaryProps = {
  title: string;
  priceLabel: string;
  hasPrice: boolean;
  unitLabel: string;
  showUnitSuffix: boolean;
  cityName: string | null;
  categoryName: string;
  vertical: ListingVertical;
  className?: string;
};

export function ListingMobileSummary({
  title,
  priceLabel,
  hasPrice,
  unitLabel,
  showUnitSuffix,
  cityName,
  categoryName,
  vertical,
  className,
}: ListingMobileSummaryProps) {
  const { t } = useTranslation();
  const displayPrice = hasPrice ? priceLabel : t("listing.priceOnRequest");

  return (
    <section className={cn("space-y-2.5", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <VerticalListingBadge vertical={vertical} size="sm" />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {categoryName}
        </span>
      </div>

      <p className="text-[1.625rem] font-extrabold leading-none tracking-tight text-blue-600 dark:text-blue-400">
        {displayPrice}
        {showUnitSuffix ? (
          <span className="ml-1 text-xs font-medium text-slate-400 dark:text-slate-500">
            / {unitLabel.toLowerCase()}
          </span>
        ) : null}
      </p>

      <h1 className="break-words text-xl font-bold leading-snug tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h1>

      {cityName ? (
        <p className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          <span>
            {t("listing.city")}: {cityName}
          </span>
        </p>
      ) : null}
    </section>
  );
}
