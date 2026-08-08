import type { ListingStatus } from "@prisma/client";
import { translate, type DictionaryKey, type Locale } from "@/lib/i18n/dictionaries";

/**
 * RU fallback map — kept for server code / contexts without locale context
 * (e.g. emails, admin exports). Prefer `getListingStatusLabel` in client UI.
 */
export const listingStatusLabels: Record<ListingStatus, string> = {
  DRAFT: "Черновик",
  PENDING_MODERATION: "На модерации",
  PUBLISHED: "Активно",
  REJECTED: "Отклонено",
  ARCHIVED: "В архиве",
};

export const listingStatusBadgeClass: Record<ListingStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  PENDING_MODERATION: "bg-amber-100 text-amber-800",
  PUBLISHED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  ARCHIVED: "bg-slate-200 text-slate-600",
};

/** Dictionary key per status — Phase 56. Use with `translate()` / `useTranslation().t()`. */
export const listingStatusLabelKeys: Record<ListingStatus, DictionaryKey> = {
  DRAFT: "status.draft",
  PENDING_MODERATION: "status.pendingModeration",
  PUBLISHED: "status.published",
  REJECTED: "status.rejected",
  ARCHIVED: "status.archived",
};

/** Locale-aware listing status label for client badges (Phase 56). */
export function getListingStatusLabel(locale: Locale, status: ListingStatus): string {
  return translate(locale, listingStatusLabelKeys[status]);
}
