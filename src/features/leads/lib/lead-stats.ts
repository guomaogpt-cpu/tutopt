import { LeadStatus } from "@prisma/client";

export type LeadStatusCounts = {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
  rejected: number;
};

export function countLeadsByStatus(
  leads: ReadonlyArray<{ status: LeadStatus }>,
): LeadStatusCounts {
  let newCount = 0;
  let inProgress = 0;
  let completed = 0;
  let rejected = 0;

  for (const lead of leads) {
    switch (lead.status) {
      case LeadStatus.NEW:
        newCount += 1;
        break;
      case LeadStatus.VIEWED:
        inProgress += 1;
        break;
      case LeadStatus.CLOSED:
        completed += 1;
        break;
      case LeadStatus.REJECTED:
        rejected += 1;
        break;
      default:
        break;
    }
  }

  return {
    total: leads.length,
    new: newCount,
    inProgress,
    completed,
    rejected,
  };
}

export function filterLeadsByStatus<T extends { status: LeadStatus }>(
  leads: T[],
  statusFilter: LeadStatus | null,
): T[] {
  if (!statusFilter) {
    return leads;
  }
  return leads.filter((lead) => lead.status === statusFilter);
}
