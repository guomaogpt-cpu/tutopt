"use client";

import Image from "next/image";
import Link from "next/link";
import { ListingStatus } from "@prisma/client";
import { Inbox, Package } from "lucide-react";
import { LeadStatusBadge } from "@/components/seller/LeadStatusBadge";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import type { SellerLeadItem } from "@/features/leads/lib/leads-data";
import { getLeadFormConfig } from "@/features/leads/lib/lead-form-config";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type SellerLeadsTableProps = {
  leads: SellerLeadItem[];
};

export function SellerLeadsTable({ leads }: SellerLeadsTableProps) {
  const { t } = useTranslation();

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-950 dark:text-blue-400">
          <Inbox className="size-6" aria-hidden="true" />
        </div>
        <p className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-100">
          Пока нет заявок
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Когда клиенты будут писать по вашим объявлениям, они появятся здесь.
        </p>
        <Button
          variant="outline"
          asChild
          className="mt-6 h-11 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          <Link href="/seller/dashboard">К моим объявлениям</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => {
        const imageUrl = lead.listing.image_url
          ? normalizeListingImageUrl(lead.listing.image_url)
          : null;
        const leadConfig = getLeadFormConfig(lead.listing.vertical);
        const listingTitle = lead.listing.title?.trim() || t("lead.listingUnavailable");
        const listingAvailable = lead.listing.status === ListingStatus.PUBLISHED;

        return (
          <article
            key={lead.id}
            className={cn(
              "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
            )}
          >
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
              {listingAvailable ? (
                <Link
                  href={`/listings/${lead.listing.id}`}
                  className="relative mx-auto size-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:mx-0 sm:size-24 dark:border-slate-800 dark:bg-slate-950"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={listingTitle}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 text-[11px] text-slate-400">
                      <Package className="size-5" aria-hidden="true" />
                      Нет фото
                    </div>
                  )}
                </Link>
              ) : (
                <div className="relative mx-auto size-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:mx-0 sm:size-24 dark:border-slate-800 dark:bg-slate-950">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={listingTitle}
                      fill
                      unoptimized
                      className="object-cover opacity-70"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 text-[11px] text-slate-400">
                      <Package className="size-5" aria-hidden="true" />
                      Нет фото
                    </div>
                  )}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <VerticalListingBadge vertical={lead.listing.vertical} />
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {leadConfig.sellerLeadTypeLabel}
                      </p>
                      {!listingAvailable ? (
                        <Badge variant="secondary" className="rounded-full text-[11px]">
                          {t("lead.listingUnavailable")}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {leadConfig.listingLabel}
                    </p>
                    <h3 className="mt-1 break-words text-base font-semibold text-slate-900 dark:text-slate-100">
                      {listingAvailable ? (
                        <Link
                          href={`/listings/${lead.listing.id}`}
                          className="transition hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {listingTitle}
                        </Link>
                      ) : (
                        listingTitle
                      )}
                    </h3>
                  </div>
                  <LeadStatusBadge status={lead.status} />
                </div>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {formatListingDate(lead.created_at)}
                </p>

                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Покупатель
                    </dt>
                    <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                      {lead.buyer.name?.trim() || "—"}
                    </dd>
                    {lead.buyer.phone ? (
                      <dd className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                        {lead.buyer.phone}
                      </dd>
                    ) : null}
                    {lead.buyer.email ? (
                      <dd className="break-all text-sm text-slate-500 dark:text-slate-400">
                        {lead.buyer.email}
                      </dd>
                    ) : null}
                  </div>

                  {leadConfig.showQuantity ? (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {leadConfig.quantityLabel}
                      </dt>
                      <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                        {lead.quantity}
                      </dd>
                    </div>
                  ) : null}

                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {leadConfig.messageLabel}
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {lead.message ?? "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {listingAvailable ? (
              <div className="border-t border-slate-200 p-4 sm:px-5 sm:py-4 dark:border-slate-800">
                <Button
                  variant="outline"
                  asChild
                  className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-auto"
                >
                  <Link href={`/listings/${lead.listing.id}`}>Открыть объявление</Link>
                </Button>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
