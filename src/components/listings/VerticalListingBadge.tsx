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
  OPT: "bg-[#EFF6FF] text-[#1D4ED8] ring-[#BFDBFE]",
  MARKET: "bg-[#F0FDF4] text-[#15803D] ring-[#BBF7D0]",
  SERVICES: "bg-[#FFF7ED] text-[#C2410C] ring-[#FED7AA]",
  CARGO: "bg-[#F8FAFC] text-[#334155] ring-[#CBD5E1]",
};

export function VerticalListingBadge({
  vertical,
  className,
  size = "sm",
}: VerticalListingBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md font-medium ring-1 ring-inset",
        BADGE_TONES[vertical],
        size === "sm" ? "px-1.5 py-0.5 text-[10px] leading-none" : "px-2 py-0.5 text-xs",
        className,
      )}
    >
      {getListingVerticalBadgeLabel(vertical)}
    </span>
  );
}
