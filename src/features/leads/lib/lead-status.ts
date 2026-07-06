import type { LeadStatus } from "@prisma/client";

export const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: "Новая",
  VIEWED: "Просмотрена",
  CLOSED: "Закрыта",
};

export const leadStatusBadgeClass: Record<LeadStatus, string> = {
  NEW: "bg-blue-50 text-blue-700",
  VIEWED: "bg-slate-100 text-slate-700",
  CLOSED: "bg-green-50 text-green-700",
};
