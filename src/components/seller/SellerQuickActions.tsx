"use client";

import Link from "next/link";
import { ExternalLink, Inbox, LayoutGrid, ListChecks, PlusCircle, Settings2, Truck } from "lucide-react";
import type { ListingVertical } from "@prisma/client";
import { VERTICALS } from "@/features/verticals/verticals";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type SellerQuickActionsProps = {
  sellerProfileId: string | null;
  verticalCounts?: Partial<Record<ListingVertical, number>>;
};

const cardClassName = cn(
  "flex min-w-0 items-center gap-3 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-4",
  "shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition hover:border-[rgba(37,99,235,0.22)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
  "dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/30 dark:shadow-none",
  "sm:p-5",
);

const iconWrapClassName =
  "flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB] dark:bg-slate-800 dark:text-blue-400";

const CREATE_LINKS: Array<{ vertical: ListingVertical; labelKey: DictionaryKey }> = [
  { vertical: "OPT", labelKey: "seller.createOptListing" },
  { vertical: "MARKET", labelKey: "seller.createMarketListing" },
  { vertical: "SERVICES", labelKey: "seller.createServicesListing" },
  { vertical: "CARGO", labelKey: "seller.createCargoListing" },
];

export function SellerQuickActions({
  sellerProfileId,
  verticalCounts,
}: SellerQuickActionsProps) {
  const { t } = useTranslation();
  const hasAnyListings =
    verticalCounts != null &&
    Object.values(verticalCounts).some((count) => (count ?? 0) > 0);

  return (
    <section aria-labelledby="seller-quick-actions-title">
      <h2 id="seller-quick-actions-title" className="mb-4 text-lg font-bold text-[#0F172A] sm:text-xl dark:text-slate-100">
        {t("quickActions.title")}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/listings/new" className={cardClassName}>
          <div className={iconWrapClassName}>
            <PlusCircle className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A] dark:text-slate-100">
              {t("vertical.postListing")}
            </p>
            <p className="mt-0.5 text-xs text-[#64748B]">{t("seller.createNewOfferHint")}</p>
          </div>
        </Link>

        <Link href="/seller/listings" className={cardClassName}>
          <div className={iconWrapClassName}>
            <ListChecks className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A] dark:text-slate-100">{t("seller.myListings")}</p>
            <p className="mt-0.5 text-xs text-[#64748B]">{t("seller.myListingsHint")}</p>
          </div>
        </Link>

        <Link href="/seller/leads" className={cardClassName}>
          <div className={iconWrapClassName}>
            <Inbox className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A] dark:text-slate-100">{t("seller.viewLeads")}</p>
            <p className="mt-0.5 text-xs text-[#64748B]">{t("seller.viewLeadsHint")}</p>
          </div>
        </Link>

        <Link href="/seller/cargo-requests" className={cardClassName}>
          <div className={iconWrapClassName}>
            <Truck className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A] dark:text-slate-100">
              {t("seller.viewCargoRequests")}
            </p>
            <p className="mt-0.5 text-xs text-[#64748B]">{t("seller.viewCargoRequestsHint")}</p>
          </div>
        </Link>

        {(verticalCounts?.CARGO ?? 0) > 0 || sellerProfileId ? (
          <Link href="/seller/cargo-settings" className={cardClassName}>
            <div className={iconWrapClassName}>
              <Settings2 className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#0F172A] dark:text-slate-100">
                {t("cargo.settings.title")}
              </p>
              <p className="mt-0.5 text-xs text-[#64748B] dark:text-slate-400">
                {t("seller.cargoSettingsHint")}
              </p>
            </div>
          </Link>
        ) : null}

        {sellerProfileId ? (
          <Link href={`/seller/${sellerProfileId}`} className={cardClassName}>
            <div className={iconWrapClassName}>
              <ExternalLink className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#0F172A] dark:text-slate-100">
                {t("seller.publicProfile")}
              </p>
              <p className="mt-0.5 text-xs text-[#64748B]">{t("seller.publicProfileHint")}</p>
            </div>
          </Link>
        ) : (
          <div
            className={cn(cardClassName, "cursor-not-allowed opacity-60")}
            aria-disabled="true"
          >
            <div className={cn(iconWrapClassName, "bg-[#F1F5F9] text-[#94A3B8]")}>
              <ExternalLink className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#0F172A] dark:text-slate-100">
                {t("seller.publicProfile")}
              </p>
              <p className="mt-0.5 text-xs text-[#64748B]">{t("seller.publicProfilePending")}</p>
            </div>
          </div>
        )}

        <Link href="/listings" className={cardClassName}>
          <div className={iconWrapClassName}>
            <LayoutGrid className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#0F172A] dark:text-slate-100">
              {t("seller.goToCatalog")}
            </p>
            <p className="mt-0.5 text-xs text-[#64748B]">{t("seller.goToCatalogHint")}</p>
          </div>
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {CREATE_LINKS.map((item) => (
          <Link
            key={item.vertical}
            href={VERTICALS[item.vertical].createListingHref}
            className="rounded-xl border border-dashed border-[rgba(148,163,184,0.35)] bg-white/70 px-3 py-2.5 text-sm transition hover:border-[#2563EB]/40 hover:bg-white dark:border-slate-700 dark:bg-slate-950/70 dark:hover:bg-slate-900"
          >
            <p className="font-medium text-[#0F172A] dark:text-slate-100">{t(item.labelKey)}</p>
            <p className="mt-0.5 text-xs text-[#64748B]">
              {VERTICALS[item.vertical].label}
              {hasAnyListings && verticalCounts?.[item.vertical]
                ? ` · ${verticalCounts[item.vertical]} ${t("seller.inDashboardSuffix")}`
                : null}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
