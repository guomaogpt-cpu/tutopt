import { LeadStatus } from "@prisma/client";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";

export const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: "Новая",
  VIEWED: "В работе",
  CLOSED: "Закрыта",
};

export const leadStatusBadgeClass: Record<LeadStatus, string> = {
  NEW: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  VIEWED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  CLOSED: "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300",
};

export const leadStatusI18nKey: Record<LeadStatus, DictionaryKey> = {
  NEW: "sellerLeads.status.new",
  VIEWED: "sellerLeads.status.inProgress",
  CLOSED: "sellerLeads.status.closed",
};

export type SellerLeadStatusFilter = "all" | "new" | "viewed" | "closed";

export function parseSellerLeadStatusFilter(
  value: string | null | undefined,
): SellerLeadStatusFilter {
  switch (value) {
    case "new":
    case "viewed":
    case "closed":
      return value;
    case "done":
      return "closed";
    case "inProgress":
      return "viewed";
    default:
      return "all";
  }
}

export function sellerLeadStatusFilterToEnum(
  filter: SellerLeadStatusFilter,
): LeadStatus | null {
  switch (filter) {
    case "new":
      return LeadStatus.NEW;
    case "viewed":
      return LeadStatus.VIEWED;
    case "closed":
      return LeadStatus.CLOSED;
    default:
      return null;
  }
}
