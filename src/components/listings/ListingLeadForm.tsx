"use client";

import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { useListingLeadContact } from "@/components/listings/ListingLeadContactProvider";
import { ListingLeadFormContent } from "@/components/listings/ListingLeadFormContent";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getVerticalTheme } from "@/lib/vertical-theme";
import { cn } from "@/lib/utils";

type ListingLeadFormProps = {
  listingId: string;
  listingTitle: string;
  sellerName: string;
  moq: number;
  unitLabel: string;
  vertical: ListingVertical;
  isAuthenticated: boolean;
  isOwner: boolean;
  restrictionMessage?: string | null;
  defaultName?: string | null;
  defaultPhone?: string | null;
  defaultEmail?: string | null;
};

export function ListingLeadForm({
  listingId,
  listingTitle,
  sellerName,
  moq,
  unitLabel,
  vertical,
  isAuthenticated,
  isOwner,
  restrictionMessage = null,
  defaultName = "",
  defaultPhone = "",
  defaultEmail = "",
}: ListingLeadFormProps) {
  const { t } = useTranslation();
  const theme = getVerticalTheme(vertical);
  const { openLeadDrawer } = useListingLeadContact();

  if (isOwner) {
    return (
      <Section spacing="none" id="listing-seller-message" className="scroll-mt-28">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t("lead.title")}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t("form.ownListingLeadNotice")}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="h-11 rounded-xl" asChild>
              <Link href={`/listings/${listingId}/edit`}>{t("listing.editListing")}</Link>
            </Button>
            <Button className={cn("h-11 rounded-xl", theme.primaryButton)} asChild>
              <Link href="/account/requests?tab=received">{t("form.goToLeads")}</Link>
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section spacing="none" id="listing-seller-message" className="scroll-mt-28">
      <div className="lg:hidden">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t("lead.title")}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t("lead.description")}</p>
          <Button
            type="button"
            className={cn("mt-4 h-11 w-full rounded-xl", theme.primaryButton)}
            onClick={openLeadDrawer}
          >
            {t("lead.submitRequest")}
          </Button>
        </div>
      </div>

      <div className="hidden lg:block">
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">{t("lead.title")}</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <ListingLeadFormContent
            listingId={listingId}
            listingTitle={listingTitle}
            sellerName={sellerName}
            moq={moq}
            unitLabel={unitLabel}
            vertical={vertical}
            isAuthenticated={isAuthenticated}
            isOwner={isOwner}
            restrictionMessage={restrictionMessage}
            defaultName={defaultName}
            defaultPhone={defaultPhone}
            defaultEmail={defaultEmail}
          />
        </div>
      </div>
    </Section>
  );
}
