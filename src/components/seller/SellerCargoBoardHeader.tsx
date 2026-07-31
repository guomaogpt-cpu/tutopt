"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type BoardFilter = "all" | "new" | "responded";

type SellerCargoBoardHeaderProps = {
  activeFilter: BoardFilter;
};

const FILTERS: Array<{ value: BoardFilter; href: string; labelKey: "cargo.seller.filterAll" | "cargo.seller.filterNew" | "cargo.seller.filterResponded" }> = [
  { value: "all", href: "/seller/cargo-requests", labelKey: "cargo.seller.filterAll" },
  { value: "new", href: "/seller/cargo-requests?filter=new", labelKey: "cargo.seller.filterNew" },
  {
    value: "responded",
    href: "/seller/cargo-requests?filter=responded",
    labelKey: "cargo.seller.filterResponded",
  },
];

export function SellerCargoBoardHeader({ activeFilter }: SellerCargoBoardHeaderProps) {
  const { t } = useTranslation();

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

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = filter.value === activeFilter;
          return (
            <Link
              key={filter.value}
              href={filter.href}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                active
                  ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
              )}
            >
              {t(filter.labelKey)}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
