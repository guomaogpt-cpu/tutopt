"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { ExpandableText } from "@/components/account/ExpandableText";
import { LeadStatusBadge } from "@/components/seller/LeadStatusBadge";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import type { BuyerLeadItem } from "@/features/leads/lib/leads-data";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";

type AccountSentLeadCardProps = {
  lead: BuyerLeadItem;
};

export function AccountSentLeadCard({ lead }: AccountSentLeadCardProps) {
  const { t } = useTranslation();

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
        <Link
          href={`/listings/${lead.listing.id}`}
          className="relative mx-auto size-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:mx-0 sm:size-24"
        >
          {lead.listing.image_url ? (
            <Image
              src={normalizeListingImageUrl(lead.listing.image_url)}
              alt={lead.listing.title}
              fill
              unoptimized
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              <Package className="size-5" aria-hidden="true" />
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <VerticalListingBadge vertical={lead.listing.vertical} />
                <LeadStatusBadge status={lead.status} />
              </div>
              <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                <Link
                  href={`/listings/${lead.listing.id}`}
                  className="transition hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {lead.listing.title}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t("accountRequests.createdAt")}: {formatListingDate(lead.created_at)}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {t("lead.sellerLabel")}: {lead.sellerProfile.company_name}
              </p>
            </div>
          </div>

          {lead.message ? (
            <ExpandableText label={t("accountRequests.message")} text={lead.message} />
          ) : null}
        </div>
      </div>

      <div className="border-t border-slate-100 p-4 dark:border-slate-800 sm:px-5">
        <Button
          asChild
          variant="outline"
          className="h-11 w-full rounded-xl dark:border-slate-700 sm:w-auto"
        >
          <Link href={`/listings/${lead.listing.id}`}>{t("accountRequests.openListing")}</Link>
        </Button>
      </div>
    </article>
  );
}
