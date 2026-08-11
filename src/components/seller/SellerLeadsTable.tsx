"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LeadStatus, ListingStatus } from "@prisma/client";
import { Check, Copy, Inbox, MessageCircle, Package } from "lucide-react";
import { LeadStatusBadge } from "@/components/seller/LeadStatusBadge";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import type { SellerLeadItem } from "@/features/leads/lib/leads-data";
import { getLeadFormConfig } from "@/features/leads/lib/lead-form-config";
import { isLeadStatusTerminal } from "@/features/leads/lib/lead-status";
import { updateSellerLeadStatus } from "@/features/leads/lib/leads-client";
import {
  parseSellerLeadStatusFilter,
  type SellerLeadStatusFilter,
} from "@/features/leads/lib/lead-status";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type SellerLeadsTableProps = {
  leads: SellerLeadItem[];
  statusFilter?: SellerLeadStatusFilter;
};

const MESSAGE_COLLAPSE_LENGTH = 180;

const FILTERS: Array<{ id: SellerLeadStatusFilter; labelKey: DictionaryKey }> = [
  { id: "all", labelKey: "sellerLeads.filters.all" },
  { id: "new", labelKey: "sellerLeads.filters.new" },
  { id: "viewed", labelKey: "sellerLeads.filters.inProgress" },
  { id: "closed", labelKey: "sellerLeads.filters.closed" },
];

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function buildWhatsAppHref(phone: string): string {
  return `https://wa.me/${digitsOnly(phone)}`;
}

function formatLeadPrice(price: string, currency: string): string {
  const amount = Number(price);
  if (!Number.isFinite(amount)) {
    return `${price} ${currency}`;
  }
  const formatted = new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
  return `${formatted} ${currency}`;
}

function LeadMessage({ message }: { message: string | null }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const text = message?.trim() || "—";
  const isLong = text.length > MESSAGE_COLLAPSE_LENGTH;
  const display =
    !isLong || expanded ? text : `${text.slice(0, MESSAGE_COLLAPSE_LENGTH).trimEnd()}…`;

  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {t("sellerLeads.message")}
      </dt>
      <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {display}
      </dd>
      {isLong ? (
        <button
          type="button"
          className="mt-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? t("sellerLeads.showLess") : t("sellerLeads.showMore")}
        </button>
      ) : null}
    </div>
  );
}

function LeadCard({
  lead,
  onStatusChange,
}: {
  lead: SellerLeadItem;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
}) {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageUrl = lead.listing.image_url
    ? normalizeListingImageUrl(lead.listing.image_url)
    : null;
  const leadConfig = getLeadFormConfig(lead.listing.vertical);
  const listingTitle = lead.listing.title?.trim() || t("sellerLeads.unavailableListing");
  const listingAvailable = lead.listing.status === ListingStatus.PUBLISHED;
  const buyerPhone = lead.buyer.phone?.trim() || null;
  const priceLabel =
    lead.listing.price && lead.listing.currency
      ? formatLeadPrice(lead.listing.price, lead.listing.currency)
      : null;

  async function handleMarkDone() {
    if (pending || isLeadStatusTerminal(lead.status)) {
      return;
    }

    setPending(true);
    setError(null);

    try {
      const result = await updateSellerLeadStatus(lead.id, LeadStatus.CLOSED);
      onStatusChange(lead.id, result.lead.status);
    } catch {
      setError(t("sellerLeads.updateError"));
    } finally {
      setPending(false);
    }
  }

  async function handleCopyPhone() {
    if (!buyerPhone || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(buyerPhone);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handleMarkViewedIfNew() {
    if (lead.status !== LeadStatus.NEW || pending) {
      return;
    }

    try {
      const result = await updateSellerLeadStatus(lead.id, LeadStatus.VIEWED);
      onStatusChange(lead.id, result.lead.status);
    } catch {
      // Soft transition — keep UI usable if mark-viewed fails.
    }
  }

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
        lead.status === LeadStatus.NEW && "ring-1 ring-blue-200 dark:ring-blue-900/50",
      )}
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
        {listingAvailable ? (
          <Link
            href={`/listings/${lead.listing.id}`}
            className="relative mx-auto size-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:mx-0 sm:size-24 dark:border-slate-800 dark:bg-slate-950"
            onClick={() => void handleMarkViewedIfNew()}
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
              </div>
            )}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <VerticalListingBadge vertical={lead.listing.vertical} />
                <LeadStatusBadge status={lead.status} />
                {!listingAvailable ? (
                  <Badge variant="secondary" className="rounded-full text-[11px]">
                    {t("sellerLeads.unavailableListing")}
                  </Badge>
                ) : null}
              </div>
              <h3 className="mt-2 break-words text-base font-semibold text-slate-900 dark:text-slate-100">
                {listingAvailable ? (
                  <Link
                    href={`/listings/${lead.listing.id}`}
                    className="transition hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => void handleMarkViewedIfNew()}
                  >
                    {listingTitle}
                  </Link>
                ) : (
                  listingTitle
                )}
              </h3>
              <p className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                <span>
                  {t("sellerLeads.createdAt")}: {formatListingDate(lead.created_at)}
                </span>
                {lead.listing.city ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{lead.listing.city}</span>
                  </>
                ) : null}
                {priceLabel ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{priceLabel}</span>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t("sellerLeads.buyer")}
              </dt>
              <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                {lead.buyer.name?.trim() || "—"}
              </dd>
              {buyerPhone ? (
                <dd className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                  {buyerPhone}
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
                  {t("sellerLeads.quantity")}
                </dt>
                <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                  {lead.quantity}
                </dd>
              </div>
            ) : null}

            <div className="sm:col-span-2">
              <LeadMessage message={lead.message} />
            </div>
          </dl>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:px-5 sm:py-4 dark:border-slate-800">
        {listingAvailable ? (
          <Button
            variant="outline"
            asChild
            className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-auto"
          >
            <Link href={`/listings/${lead.listing.id}`} onClick={() => void handleMarkViewedIfNew()}>
              {t("sellerLeads.openListing")}
            </Link>
          </Button>
        ) : null}

        {buyerPhone ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full gap-2 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-auto"
              onClick={() => void handleCopyPhone()}
            >
              {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
              {copied ? t("sellerLeads.phoneCopied") : t("sellerLeads.copyPhone")}
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-11 w-full gap-2 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-auto"
            >
              <a href={buildWhatsAppHref(buyerPhone)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden="true" />
                {t("sellerLeads.whatsapp")}
              </a>
            </Button>
          </>
        ) : null}

        {!isLeadStatusTerminal(lead.status) ? (
          <Button
            type="button"
            className="h-11 w-full rounded-xl bg-blue-600 hover:bg-blue-700 sm:ml-auto sm:w-auto"
            disabled={pending}
            onClick={() => void handleMarkDone()}
          >
            {pending ? t("sellerLeads.marking") : t("sellerLeads.markDone")}
          </Button>
        ) : null}

        {error ? <p className="w-full text-sm text-destructive">{error}</p> : null}
      </div>
    </article>
  );
}

export function SellerLeadsTable({
  leads,
  statusFilter = "all",
}: SellerLeadsTableProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [items, setItems] = useState(leads);
  const activeFilter = parseSellerLeadStatusFilter(statusFilter);

  useEffect(() => {
    setItems(leads);
  }, [leads]);

  function handleFilterChange(next: SellerLeadStatusFilter) {
    const params = new URLSearchParams();
    if (next !== "all") {
      params.set("status", next);
    }
    const query = params.toString();
    router.push(query ? `/seller/leads?${query}` : "/seller/leads");
  }

  function handleStatusChange(leadId: string, status: LeadStatus) {
    setItems((current) => {
      const next = current.map((lead) =>
        lead.id === leadId ? { ...lead, status } : lead,
      );

      if (activeFilter === "all") {
        return next;
      }

      const expected =
        activeFilter === "new"
          ? LeadStatus.NEW
          : activeFilter === "viewed"
            ? LeadStatus.VIEWED
            : LeadStatus.CLOSED;

      return next.filter((lead) => lead.status === expected);
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label={t("sellerLeads.status")}
      >
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleFilterChange(filter.id)}
              className={cn(
                "h-9 shrink-0 rounded-full px-3.5 text-sm font-medium transition",
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800",
              )}
            >
              {t(filter.labelKey)}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-950 dark:text-blue-400">
            <Inbox className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-100">
            {t("sellerLeads.emptyTitle")}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {t("sellerLeads.emptyDescription")}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Button
              variant="outline"
              asChild
              className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-auto"
            >
              <Link href="/seller/listings">{t("sellerLeads.myListings")}</Link>
            </Button>
            <Button
              asChild
              className="h-11 w-full rounded-xl bg-blue-600 hover:bg-blue-700 sm:w-auto"
            >
              <Link href="/listings/new">{t("sellerLeads.addListing")}</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
