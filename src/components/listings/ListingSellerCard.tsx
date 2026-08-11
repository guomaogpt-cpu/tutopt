"use client";

import type { CompanyType, ListingVertical } from "@prisma/client";
import Link from "next/link";
import { BadgeCheck, Building2 } from "lucide-react";
import { SellerTrustCompactBlock } from "@/components/seller/SellerTrustBlock";
import { ReportDialog } from "@/components/reports/ReportDialog";
import { trackListingDetailAction } from "@/lib/analytics/events";
import { CompanyVerificationBadge } from "@/components/company/CompanyVerificationBadge";
import type { CompanyVerificationStatus } from "@prisma/client";
import {
  buildSellerProfileHref,
} from "@/features/sellers/lib/seller-vertical-profile";
import { buildCompanyProfileHref } from "@/features/company/lib/company-profile";
import type { SellerTrustLevel, SellerTrustSignal } from "@/lib/trust/seller-trust";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type ListingSellerCardProps = {
  sellerName: string;
  companyName: string;
  companyType?: CompanyType | null;
  avatarUrl: string | null;
  isVerified: boolean;
  verificationStatus?: CompanyVerificationStatus | null;
  sellerCity: string | null;
  sellerSinceLabel: string;
  publishedListingCount: number;
  sellerId: string;
  sellerSlug?: string | null;
  listingId: string;
  vertical: ListingVertical;
  postedAsCompany?: boolean;
  trustLevel?: SellerTrustLevel;
  trustSignals?: SellerTrustSignal[];
  isAuthenticated?: boolean;
  hasPrice?: boolean;
  isOwnListing?: boolean;
};

const COMPANY_TYPE_LABEL: Record<CompanyType, DictionaryKey> = {
  STORE: "company.types.store",
  SUPPLIER: "company.types.supplier",
  SERVICE: "company.types.service",
  CARGO: "company.types.cargo",
  OTHER: "company.types.other",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function ListingSellerCard({
  sellerName,
  companyName,
  companyType = null,
  avatarUrl,
  isVerified,
  verificationStatus = null,
  sellerCity,
  sellerSinceLabel,
  publishedListingCount,
  sellerId,
  sellerSlug = null,
  listingId,
  vertical,
  postedAsCompany = false,
  trustLevel,
  trustSignals = [],
  isAuthenticated = false,
  hasPrice = false,
  isOwnListing = false,
}: ListingSellerCardProps) {
  const { t } = useTranslation();
  const displayName = postedAsCompany
    ? companyName.trim() || sellerName.trim() || t("listing.listingAuthor")
    : sellerName.trim() || companyName.trim() || t("listing.listingAuthor");
  const roleLabel = postedAsCompany
    ? t("company.badge")
    : vertical === "OPT"
      ? t("listing.supplier")
      : vertical === "SERVICES"
        ? t("listing.executor")
        : t("listing.seller");
  const analyticsParams = { vertical, hasPrice, isOwnListing };
  const profileHref = postedAsCompany
    ? buildCompanyProfileHref(sellerSlug || sellerId, vertical)
    : buildSellerProfileHref(sellerSlug || sellerId, vertical);
  const profileLabel = postedAsCompany
    ? t("company.openCompany")
    : t("listing.sellerProfile");
  const companyTypeLabel =
    postedAsCompany && companyType ? t(COMPANY_TYPE_LABEL[companyType]) : null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.05)] sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-12 shrink-0 sm:size-14">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
          <AvatarFallback className="bg-[#EFF6FF] text-sm font-semibold text-[#2563EB] dark:bg-slate-800 dark:text-blue-400">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full text-[11px]">
              {roleLabel}
            </Badge>
            {postedAsCompany && verificationStatus ? (
              <CompanyVerificationBadge
                status={verificationStatus}
                isCargo={vertical === "CARGO"}
                compact
              />
            ) : isVerified ? (
              <Badge variant="secondary" className="gap-1 rounded-full text-[11px]">
                <BadgeCheck className="size-3.5" aria-hidden="true" />
                {t("listing.verified")}
              </Badge>
            ) : null}
          </div>

          <h2 className="mt-2 text-base font-semibold text-[#0F172A] dark:text-slate-100">
            {displayName}
          </h2>

          {companyTypeLabel ? (
            <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">
              {companyTypeLabel}
              {sellerCity ? ` · ${sellerCity}` : ""}
            </p>
          ) : null}

          {companyName.trim() && !postedAsCompany && companyName !== sellerName ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#64748B] dark:text-slate-400">
              <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{companyName}</span>
            </p>
          ) : null}
        </div>
      </div>

      {trustLevel ? (
        <SellerTrustCompactBlock
          level={trustLevel}
          signals={trustSignals}
          publishedListingCount={publishedListingCount}
          className="mt-4"
        />
      ) : null}

      <dl className="mt-4 space-y-2 border-t border-[rgba(148,163,184,0.14)] pt-4 text-sm dark:border-slate-800">
        <div className="flex justify-between gap-4">
          <dt className="text-[#64748B] dark:text-slate-400">{t("listing.listingsCount")}</dt>
          <dd className="font-medium text-[#0F172A] dark:text-slate-200">
            {publishedListingCount}
          </dd>
        </div>
        {sellerCity && !companyTypeLabel ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B] dark:text-slate-400">{t("listing.city")}</dt>
            <dd className="font-medium text-[#0F172A] dark:text-slate-200">{sellerCity}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-[#64748B] dark:text-slate-400">{t("listing.memberSince")}</dt>
          <dd className="font-medium text-[#0F172A] dark:text-slate-200">{sellerSinceLabel}</dd>
        </div>
      </dl>

      <Button
        variant="outline"
        className="mt-4 h-10 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        asChild
      >
        <Link
          href={profileHref}
          onClick={() => trackListingDetailAction("seller_profile", analyticsParams)}
        >
          {profileLabel}
        </Link>
      </Button>

      <div className="mt-3 border-t border-[rgba(148,163,184,0.14)] pt-3 text-center dark:border-slate-800">
        <ReportDialog
          targetType="listing"
          listingId={listingId}
          isAuthenticated={isAuthenticated}
          vertical={vertical}
          triggerLabel={t("listing.report")}
          onTriggerClick={() => trackListingDetailAction("report", analyticsParams)}
        />
      </div>
    </div>
  );
}
