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
  MARKET: "border-indigo-200/80 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300",
  SERVICES: "border-teal-200/80 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/80 dark:text-teal-300",
  CARGO: "border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/80 dark:text-rose-300",
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
