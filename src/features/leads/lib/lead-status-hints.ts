import type { LeadStatus } from "@prisma/client";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";

export const leadStatusHintKeys: Record<LeadStatus, DictionaryKey> = {
  NEW: "leadStatus.hint.new",
  VIEWED: "leadStatus.hint.inProgress",
  CLOSED: "leadStatus.hint.closed",
  REJECTED: "leadStatus.hint.rejected",
};

export function getLeadStatusFallbackLabel(): string {
  return "Неизвестный статус";
}
