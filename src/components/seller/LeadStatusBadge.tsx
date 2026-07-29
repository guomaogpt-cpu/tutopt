"use client";

import type { LeadStatus } from "@prisma/client";
import { leadStatusBadgeClass, leadStatusI18nKey } from "@/features/leads/lib/lead-status";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type LeadStatusBadgeProps = {
  status: LeadStatus;
  className?: string;
};

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        leadStatusBadgeClass[status],
        className,
      )}
    >
      {t(leadStatusI18nKey[status])}
    </span>
  );
}
