import type { ListingStatus } from "@prisma/client";
import { listingStatusBadgeClass } from "@/features/listings/lib/listing-status";
import { cn } from "@/lib/utils";

const listingStatusDisplayLabels: Record<ListingStatus, string> = {
  PUBLISHED: "Опубликовано",
  PENDING_MODERATION: "На модерации",
  REJECTED: "Отклонено",
  DRAFT: "Черновик",
  ARCHIVED: "Архив",
};

type ListingStatusBadgeProps = {
  status: ListingStatus;
  className?: string;
};

export function ListingStatusBadge({ status, className }: ListingStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        listingStatusBadgeClass[status],
        className,
      )}
    >
      {listingStatusDisplayLabels[status]}
    </span>
  );
}
