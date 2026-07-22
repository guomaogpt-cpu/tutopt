"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLLAPSED_LENGTH = 480;

type ListingDescriptionProps = {
  text: string;
};

export function ListingDescription({ text }: ListingDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const hasText = text.trim().length > 0;
  const isLong = hasText && text.length > COLLAPSED_LENGTH;
  const displayText = !isLong || expanded ? text : `${text.slice(0, COLLAPSED_LENGTH).trimEnd()}…`;

  return (
    <section aria-labelledby="listing-description-title">
      <h2
        id="listing-description-title"
        className="mb-4 text-lg font-bold text-[#0F172A] sm:text-xl"
      >
        Описание
      </h2>

      <div
        className={cn(
          "rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-sm sm:p-6",
        )}
      >
        {hasText ? (
          <p className="break-words whitespace-pre-wrap text-base leading-relaxed text-[#334155]">
            {displayText}
          </p>
        ) : (
          <p className="text-sm text-[#94A3B8]">Описание не указано</p>
        )}
        {isLong ? (
          <Button
            type="button"
            variant="link"
            className="mt-4 h-auto p-0 text-[#2563EB]"
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? "Свернуть" : "Показать полностью"}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
