"use client";

import type { ListingVertical } from "@prisma/client";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type VerticalListingBadgeProps = {
  vertical: ListingVertical;
  className?: string;
  /** Compact for cards; default for detail/admin. */
  size?: "sm" | "md";
};

const BADGE_TONES: Record<ListingVertical, string> = {
  OPT: "border-blue-200/80 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-300",
  MARKET:
    "border-purple-200/80 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/80 dark:text-purple-300",
  SERVICES:
    "border-green-200/80 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/80 dark:text-green-300",
  CARGO:
    "border-orange-200/80 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/80 dark:text-orange-300",
};

const BADGE_LABEL_KEYS: Record<ListingVertical, DictionaryKey> = {
  MARKET: "vertical.market",
  OPT: "vertical.opt",
  SERVICES: "vertical.services",
  CARGO: "vertical.cargo",
};

export function VerticalListingBadge({
  vertical,
  className,
  size = "sm",
}: VerticalListingBadgeProps) {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border font-semibold",
        BADGE_TONES[vertical],
        size === "sm" ? "px-1.5 py-0.5 text-[10px] leading-none" : "px-2 py-0.5 text-xs",
        className,
      )}
    >
      {t(BADGE_LABEL_KEYS[vertical])}
    </span>
  );
}
