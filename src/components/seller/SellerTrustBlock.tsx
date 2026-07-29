"use client";

import {
  type SellerTrustLevel,
  type SellerTrustSignal,
} from "@/lib/trust/seller-trust";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const LEVEL_STYLES: Record<SellerTrustLevel, string> = {
  trusted: "bg-[#ECFDF5] text-[#059669]",
  normal: "bg-[#EFF6FF] text-[#2563EB]",
  incomplete: "bg-[#FFFBEB] text-[#D97706]",
};

type SellerTrustBadgeProps = {
  level: SellerTrustLevel;
  className?: string;
};

export function SellerTrustBadge({ level, className }: SellerTrustBadgeProps) {
  const { t } = useTranslation();
  const label =
    level === "trusted"
      ? t("listing.profileCompleted")
      : level === "normal"
        ? t("listing.standardProfile")
        : t("listing.profileIncomplete");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        LEVEL_STYLES[level],
        className,
      )}
    >
      {label}
    </span>
  );
}

type SellerTrustSignalsListProps = {
  signals: SellerTrustSignal[];
  maxItems?: number;
  className?: string;
};

export function SellerTrustSignalsList({
  signals,
  maxItems = 4,
  className,
}: SellerTrustSignalsListProps) {
  const items = signals.slice(0, maxItems);

  if (items.length === 0) {
    return null;
  }

  return (
    <ul className={cn("space-y-1 text-xs leading-relaxed text-[#475569]", className)}>
      {items.map((signal) => (
        <li key={signal.code}>• {signal.label}</li>
      ))}
    </ul>
  );
}

type SellerTrustCompactBlockProps = {
  level: SellerTrustLevel;
  signals: SellerTrustSignal[];
  publishedListingCount?: number;
  className?: string;
};

export function SellerTrustCompactBlock({
  level,
  signals,
  publishedListingCount = 0,
  className,
}: SellerTrustCompactBlockProps) {
  const { t } = useTranslation();
  const levelLabel =
    level === "trusted"
      ? t("listing.profileCompleted")
      : level === "normal"
        ? t("listing.standardProfile")
        : t("listing.profileIncomplete");
  const localizedSignals = signals.map((signal) => {
    if (signal.code === "phone_verified") {
      return { ...signal, label: t("listing.phoneVerified") };
    }
    if (signal.code === "profile_filled") {
      return { ...signal, label: t("listing.profileCompleted") };
    }
    if (signal.code === "active_listings") {
      return {
        ...signal,
        label: `${t("listing.activeListings")}: ${publishedListingCount}`,
      };
    }
    return signal;
  });

  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[#F8FAFC] p-3.5 dark:border-slate-800 dark:bg-slate-950",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B] dark:text-slate-400">
          {t("listing.trust")}
        </p>
        <SellerTrustBadge level={level} />
      </div>
      <p className="mt-1.5 text-sm font-medium text-[#0F172A] dark:text-slate-200">{levelLabel}</p>
      <SellerTrustSignalsList
        signals={localizedSignals}
        maxItems={3}
        className="mt-2 dark:text-slate-400"
      />
    </div>
  );
}
