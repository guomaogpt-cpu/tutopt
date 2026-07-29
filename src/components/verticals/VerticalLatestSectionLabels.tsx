"use client";

import Link from "next/link";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";

type VerticalLatestHeadingProps = {
  headingId: string;
  listingsHref: string;
  showAllLink: boolean;
  linkClassName?: string;
};

export function VerticalLatestHeading({
  headingId,
  listingsHref,
  showAllLink,
  linkClassName = "shrink-0 text-sm font-medium text-indigo-700 hover:underline",
}: VerticalLatestHeadingProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2
        id={headingId}
        className="text-lg font-semibold tracking-tight text-[#0F172A] dark:text-slate-100"
      >
        {t("vertical.latestListings")}
      </h2>
      {showAllLink ? (
        <Link href={listingsHref} className={linkClassName}>
          {t("vertical.allListings")}
        </Link>
      ) : null}
    </div>
  );
}

type VerticalEmptyStateProps = {
  emptyKey: DictionaryKey;
};

export function VerticalEmptyState({ emptyKey }: VerticalEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white px-5 py-7 text-sm text-[#64748B] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      {t(emptyKey)}
    </div>
  );
}
