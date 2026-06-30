import type { ListingStatus } from "@prisma/client";

export const listingStatusLabels: Record<ListingStatus, string> = {
  DRAFT: "Черновик",
  PENDING_MODERATION: "На модерации",
  PUBLISHED: "Опубликовано",
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
