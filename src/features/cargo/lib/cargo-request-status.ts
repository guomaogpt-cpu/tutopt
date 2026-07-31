import type { CargoRequestStatus } from "@prisma/client";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";

export const cargoRequestStatusI18nKey: Record<CargoRequestStatus, DictionaryKey> = {
  NEW: "cargo.status.new",
  IN_REVIEW: "cargo.status.inReview",
  CONTACTED: "cargo.status.contacted",
  CLOSED: "cargo.status.closed",
};

export const cargoRequestStatusBadgeClass: Record<CargoRequestStatus, string> = {
  NEW: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  IN_REVIEW: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  CONTACTED: "bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
  CLOSED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export function parseCargoRequestStatusFilter(
  value: string | null,
): CargoRequestStatus | null {
  if (
    value === "NEW" ||
    value === "IN_REVIEW" ||
    value === "CONTACTED" ||
    value === "CLOSED"
  ) {
    return value;
  }
  return null;
}
