"use client";

import type { ListingVertical } from "@prisma/client";
import { ReportDialog } from "@/components/reports/ReportDialog";
import { cn } from "@/lib/utils";

type ListingReportSectionProps = {
  listingId: string;
  vertical: ListingVertical;
  isAuthenticated: boolean;
  isOwnListing: boolean;
  className?: string;
};

export function ListingReportSection({
  listingId,
  vertical,
  isAuthenticated,
  isOwnListing,
  className,
}: ListingReportSectionProps) {
  if (isOwnListing) {
    return null;
  }

  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900 sm:px-5 sm:py-4",
        className,
      )}
      aria-label="Пожаловаться на объявление"
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Заметили нарушение правил или подозрительное объявление?
      </p>
      <div className="mt-2">
        <ReportDialog
          targetType="listing"
          listingId={listingId}
          vertical={vertical}
          isAuthenticated={isAuthenticated}
          triggerLabel="Пожаловаться"
        />
      </div>
    </section>
  );
}
