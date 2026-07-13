import type { LeadStatus } from "@prisma/client";
import { leadStatusBadgeClass, leadStatusLabels } from "@/features/leads/lib/lead-status";
import { cn } from "@/lib/utils";

type LeadStatusBadgeProps = {
  status: LeadStatus;
  className?: string;
};

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        leadStatusBadgeClass[status],
        className,
      )}
    >
      {leadStatusLabels[status]}
    </span>
  );
}
