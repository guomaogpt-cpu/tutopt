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
  parentCategoryName?: string | null;
  vertical: ListingVertical;
  moq?: number;
  showMoq?: boolean;
  publishedDateLabel?: string | null;
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
  parentCategoryName = null,
  vertical,
  moq = 0,
  showMoq = false,
  publishedDateLabel = null,
  className,
}: ListingMobileSummaryProps) {
  const { t } = useTranslation();
  const displayPrice = hasPrice ? priceLabel : t("listing.priceOnRequest");
  const categoryLabel = parentCategoryName
    ? `${parentCategoryName} · ${categoryName}`
    : categoryName;

  return (
    <section className={cn("space-y-2", className)}>
      <p className="text-[1.75rem] font-extrabold leading-none tracking-tight text-[#0F172A] dark:text-slate-50">
        {displayPrice}
        {showUnitSuffix ? (
          <span className="ml-1 text-sm font-medium text-slate-400 dark:text-slate-500">
            / {unitLabel.toLowerCase()}
          </span>
        ) : null}
      </p>

      <h1 className="break-words text-xl font-bold leading-snug tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
        {cityName ? (
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{cityName}</span>
          </span>
        ) : null}
        {cityName ? <span aria-hidden="true">·</span> : null}
        <span className="inline-flex items-center gap-1.5">
          <VerticalListingBadge vertical={vertical} size="sm" />
          <span>{categoryLabel}</span>
        </span>
        {publishedDateLabel ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{publishedDateLabel}</span>
          </>
        ) : null}
      </div>

      {showMoq && moq > 0 ? (
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {t("listing.minOrder")}: {moq} {unitLabel.toLowerCase()}
        </p>
      ) : null}
    </section>
  );
}
