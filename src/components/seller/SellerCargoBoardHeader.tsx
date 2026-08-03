"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type BoardFilter = "all" | "new" | "responded";

type SellerCargoBoardHeaderProps = {
  activeFilter: BoardFilter;
  matchingOnly: boolean;
};

function withMatching(href: string, matchingOnly: boolean): string {
  if (!matchingOnly) {
    return href;
  }
  return href.includes("?") ? `${href}&matching=1` : `${href}?matching=1`;
}

export function SellerCargoBoardHeader({
  activeFilter,
  matchingOnly,
}: SellerCargoBoardHeaderProps) {
  const { t } = useTranslation();

  const filters: Array<{
    value: BoardFilter;
    href: string;
    labelKey: "cargo.seller.filterAll" | "cargo.seller.filterNew" | "cargo.seller.filterResponded";
  }> = [
    { value: "all", href: withMatching("/seller/cargo-requests", matchingOnly), labelKey: "cargo.seller.filterAll" },
    {
      value: "new",
      href: withMatching("/seller/cargo-requests?filter=new", matchingOnly),
      labelKey: "cargo.seller.filterNew",
    },
    {
      value: "responded",
      href: withMatching("/seller/cargo-requests?filter=responded", matchingOnly),
      labelKey: "cargo.seller.filterResponded",
    },
  ];

  const matchingHref =
    activeFilter === "all"
      ? matchingOnly
        ? "/seller/cargo-requests"
        : "/seller/cargo-requests?matching=1"
      : matchingOnly
        ? `/seller/cargo-requests?filter=${activeFilter}`
        : `/seller/cargo-requests?filter=${activeFilter}&matching=1`;

  return (
    <section aria-labelledby="cargo-new-requests-heading">
      <h2
        id="cargo-new-requests-heading"
        className="text-lg font-bold text-slate-900 dark:text-slate-100"
      >
        {t("cargo.seller.newRequestsTitle")}
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {t("cargo.seller.newRequestsDescription")}
      </p>

      <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((filter) => {
          const active = filter.value === activeFilter;
          return (
            <Link
              key={filter.value}
              href={filter.href}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                active
                  ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
              )}
            >
              {t(filter.labelKey)}
            </Link>
          );
        })}
        <Link
          href={matchingHref}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
            matchingOnly
              ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
          )}
        >
          {t("cargo.matchingOnly")}
        </Link>
      </div>
    </section>
  );
}
