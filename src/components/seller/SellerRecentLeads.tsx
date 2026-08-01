"use client";

import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { Inbox } from "lucide-react";
import { LeadStatusBadge } from "@/components/seller/LeadStatusBadge";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { useTranslation } from "@/lib/i18n/useTranslation";

export type SellerRecentLead = {
  id: string;
  status: "NEW" | "VIEWED" | "CLOSED";
  created_at: Date;
  buyerName: string;
  listingId: string;
  listingTitle: string;
  listingVertical: ListingVertical;
};

type SellerRecentLeadsProps = {
  leads: SellerRecentLead[];
  newLeadsCount?: number;
};

export function SellerRecentLeads({ leads, newLeadsCount = 0 }: SellerRecentLeadsProps) {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="seller-recent-leads-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2
            id="seller-recent-leads-title"
            className="text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100"
          >
            {t("sellerLeads.latestRequests")}
          </h2>
          {newLeadsCount > 0 ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t("sellerLeads.newCount")}:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {newLeadsCount}
              </span>
            </p>
          ) : null}
        </div>
        <Link
          href="/account/requests"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {t("sellerLeads.allRequests")} →
        </Link>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-950 dark:text-blue-400">
            <Inbox className="size-5" aria-hidden="true" />
          </div>
          <p className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
            {t("sellerLeads.emptyTitle")}
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {t("sellerLeads.emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {leads.map((lead) => (
              <li
                key={lead.id}
                className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <VerticalListingBadge vertical={lead.listingVertical} />
                    <LeadStatusBadge status={lead.status} />
                  </div>
                  <Link
                    href="/account/requests"
                    className="mt-1 block truncate text-sm font-semibold text-slate-900 transition hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
                  >
                    {lead.listingTitle}
                  </Link>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {lead.buyerName}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                  {formatListingDate(lead.created_at)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
