"use client";

import Link from "next/link";
import { ReportDialog } from "@/components/reports/ReportDialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";

type CompanyPublicProfileActionsProps = {
  sellerProfileId: string;
  isAuthenticated: boolean;
  hasListings: boolean;
  contactListingId: string | null;
};

export function CompanyPublicProfileActions({
  sellerProfileId,
  isAuthenticated,
  hasListings,
  contactListingId,
}: CompanyPublicProfileActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full shrink-0 flex-col gap-2 sm:mt-1 sm:w-auto">
      {hasListings ? (
        <Button
          asChild
          variant="outline"
          className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          <Link href="#company-listings">{t("company.public.viewListings")}</Link>
        </Button>
      ) : null}
      {contactListingId ? (
        <Button asChild className="h-11 w-full rounded-xl">
          <Link href={`/listings/${contactListingId}`}>{t("company.public.contact")}</Link>
        </Button>
      ) : null}
      <ReportDialog
        targetType="seller"
        sellerId={sellerProfileId}
        isAuthenticated={isAuthenticated}
        triggerLabel={t("company.public.reportProfile")}
        triggerClassName="h-10 w-full rounded-xl text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      />
    </div>
  );
}
