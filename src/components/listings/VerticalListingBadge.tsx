import type { ListingVertical } from "@prisma/client";
import { getListingVerticalBadgeLabel } from "@/features/listings/lib/listing-display";
import { cn } from "@/lib/utils";

type VerticalListingBadgeProps = {
  vertical: ListingVertical;
  className?: string;
  /** Compact for cards; default for detail/admin. */
  size?: "sm" | "md";
};

const BADGE_TONES: Record<ListingVertical, string> = {
  OPT: "border border-blue-200 bg-blue-50 text-blue-700",
  MARKET: "border border-indigo-200 bg-indigo-50 text-indigo-700",
  SERVICES: "border border-teal-200 bg-teal-50 text-teal-700",
  CARGO: "border border-rose-200 bg-rose-50 text-rose-700",
};

export function VerticalListingBadge({
  vertical,
  className,
  size = "sm",
}: VerticalListingBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border font-medium",
        BADGE_TONES[vertical],
        size === "sm" ? "px-1.5 py-0.5 text-[10px] leading-none" : "px-2 py-0.5 text-xs",
        className,
      )}
    >
      {getListingVerticalBadgeLabel(vertical)}
    </span>
  );
}
