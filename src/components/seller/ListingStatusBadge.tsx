"use client";

import type { ListingStatus } from "@prisma/client";
import {
  getListingStatusLabel,
  listingStatusBadgeClass,
  listingStatusLabelKeys,
} from "@/features/listings/lib/listing-status";
import { listingStatusHintKeys } from "@/features/listings/lib/listing-status-hints";
import { StatusHint } from "@/components/ui/StatusHint";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type ListingStatusBadgeProps = {
  status: ListingStatus;
  className?: string;
  showHint?: boolean;
};

export function ListingStatusBadge({ status, className, showHint = false }: ListingStatusBadgeProps) {
  const { t, locale } = useTranslation();
  const label = getListingStatusLabel(locale, status);
  const hintKey = listingStatusHintKeys[status];

  return (
    <span className={cn("inline-flex flex-col gap-1", className)}>
      <span
        className={cn(
          "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          listingStatusBadgeClass[status],
        )}
      >
        {label || t(listingStatusLabelKeys[status])}
      </span>
      {showHint && hintKey ? <StatusHint hintKey={hintKey} /> : null}
    </span>
  );
}
