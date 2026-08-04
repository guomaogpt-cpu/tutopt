"use client";

import { ShieldCheck, Clock3 } from "lucide-react";
import type { CompanyVerificationStatus } from "@prisma/client";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  getPublicVerificationBadgeKey,
  isCompanyVerified,
} from "@/features/company/lib/company-verification";
import { cn } from "@/lib/utils";

type CompanyVerificationBadgeProps = {
  status: CompanyVerificationStatus | null | undefined;
  isCargo?: boolean;
  /** Owner cabinet may show pending/rejected/unverified. */
  showOwnerStatus?: boolean;
  compact?: boolean;
  className?: string;
};

export function CompanyVerificationBadge({
  status,
  isCargo = false,
  showOwnerStatus = false,
  compact = false,
  className,
}: CompanyVerificationBadgeProps) {
  const { t } = useTranslation();

  if (!status) {
    return null;
  }

  if (isCompanyVerified(status)) {
    const labelKey = getPublicVerificationBadgeKey({ status, isCargo });
    if (!labelKey) {
      return null;
    }
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-emerald-50 font-semibold text-emerald-700",
          "dark:bg-emerald-950/50 dark:text-emerald-300",
          compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
          className,
        )}
      >
        <ShieldCheck className={cn(compact ? "size-3" : "size-3.5")} aria-hidden="true" />
        <span className="truncate">{t(labelKey)}</span>
      </span>
    );
  }

  // Public surfaces: only the verified badge is bright; pending/rejected stay owner-only.
  if (!showOwnerStatus) {
    return null;
  }

  if (status === "PENDING") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-amber-50 font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
          compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
          className,
        )}
      >
        <Clock3 className={cn(compact ? "size-3" : "size-3.5")} aria-hidden="true" />
        {t("company.verification.pending")}
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span
        className={cn(
          "inline-flex rounded-full bg-red-50 font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300",
          compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
          className,
        )}
      >
        {t("company.verification.rejected")}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-slate-100 font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400",
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        className,
      )}
    >
      {t("company.verification.unverified")}
    </span>
  );
}
