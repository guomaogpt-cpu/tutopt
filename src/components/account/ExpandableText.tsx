"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const COLLAPSE_LENGTH = 180;

type ExpandableTextProps = {
  label: string;
  text: string | null | undefined;
};

export function ExpandableText({ label, text }: ExpandableTextProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const value = text?.trim() || "—";
  const isLong = value.length > COLLAPSE_LENGTH;
  const display =
    !isLong || expanded ? value : `${value.slice(0, COLLAPSE_LENGTH).trimEnd()}…`;

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {display}
      </p>
      {isLong ? (
        <button
          type="button"
          className="mt-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? t("sellerLeads.showLess") : t("sellerLeads.showMore")}
        </button>
      ) : null}
    </div>
  );
}
