"use client";

import { Info } from "lucide-react";
import type { ListingVertical } from "@prisma/client";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getVerticalTheme } from "@/lib/vertical-theme";
import { cn } from "@/lib/utils";

type ListingRequestHintProps = {
  vertical?: ListingVertical;
};

export function ListingRequestHint({ vertical }: ListingRequestHintProps) {
  const { t } = useTranslation();
  const theme = getVerticalTheme(vertical ?? null);
  const hintKey =
    vertical === "MARKET"
      ? "listing.requestHintMarket"
      : vertical === "SERVICES"
        ? "listing.requestHintServices"
        : "listing.requestHint";

  return (
    <div
      className={cn(
        "flex gap-2.5 rounded-xl border px-3.5 py-3 text-sm leading-relaxed",
        theme.primaryBorder,
        theme.softBg,
        theme.softText,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>{t(hintKey)}</p>
    </div>
  );
}
