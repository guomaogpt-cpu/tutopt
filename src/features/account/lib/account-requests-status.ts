import { LeadStatus } from "@prisma/client";
import type { SellerLeadStatusFilter } from "@/features/leads/lib/lead-status";

export type AccountRequestsStatusFilter = "all" | "new" | "viewed" | "closed" | "rejected";

export function parseAccountRequestsStatus(
  value: string | null | undefined,
): AccountRequestsStatusFilter {
  switch (value) {
    case "new":
      return "new";
    case "viewed":
    case "inProgress":
      return "viewed";
    case "closed":
    case "completed":
      return "closed";
    case "rejected":
      return "rejected";
    default:
      return "all";
  }
}

export function accountRequestsStatusToLeadStatus(
  filter: AccountRequestsStatusFilter,
): LeadStatus | null {
  switch (filter) {
    case "new":
      return LeadStatus.NEW;
    case "viewed":
      return LeadStatus.VIEWED;
    case "closed":
      return LeadStatus.CLOSED;
    case "rejected":
      return LeadStatus.REJECTED;
    default:
      return null;
  }
}

export function accountRequestsStatusToSellerFilter(
  filter: AccountRequestsStatusFilter,
): SellerLeadStatusFilter {
  if (filter === "all") {
    return "all";
  }
  return filter;
}
