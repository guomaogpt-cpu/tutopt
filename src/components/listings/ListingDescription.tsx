"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const COLLAPSED_LENGTH = 480;

type ListingDescriptionProps = {
  text: string;
};

export function ListingDescription({ text }: ListingDescriptionProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const hasText = text.trim().length > 0;
  const isLong = hasText && text.length > COLLAPSED_LENGTH;
  const displayText = !isLong || expanded ? text : `${text.slice(0, COLLAPSED_LENGTH).trimEnd()}…`;

  return (
    <section aria-labelledby="listing-description-title">
      <h2
        id="listing-description-title"
        className="mb-4 text-lg font-bold text-[#0F172A] sm:text-xl dark:text-slate-100"
      >
        {t("listing.description")}
      </h2>

      <div
        className={cn(
          "rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
        )}
      >
        {hasText ? (
          <p className="break-words whitespace-pre-wrap text-[15px] leading-relaxed text-[#334155] sm:text-base dark:text-slate-300">
            {displayText}
          </p>
        ) : (
          <p className="text-sm text-[#94A3B8] dark:text-slate-500">{t("listing.noDescription")}</p>
        )}
        {isLong ? (
          <Button
            type="button"
            variant="link"
            className="mt-3 h-auto min-h-10 p-0 text-[#2563EB] dark:text-blue-400"
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? t("listing.showLess") : t("listing.showMore")}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
