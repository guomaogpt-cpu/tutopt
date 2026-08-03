"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  buildSellerListingsQueryString,
  type SellerListingsFilters,
  type SellerListingsStatusFilter,
} from "@/features/sellers/lib/seller-listings";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const STATUS_CHIPS: Array<{ value: SellerListingsStatusFilter; labelKey: DictionaryKey }> = [
  { value: "all", labelKey: "accountListings.filters.all" },
  { value: "active", labelKey: "accountListings.filters.active" },
  { value: "pending", labelKey: "accountListings.filters.pending" },
  { value: "rejected", labelKey: "accountListings.filters.rejected" },
  { value: "archived", labelKey: "accountListings.filters.archived" },
  { value: "expired", labelKey: "accountListings.filters.expired" },
  { value: "draft", labelKey: "accountListings.filters.draft" },
];

const TYPE_CHIPS: Array<{ value: ListingVertical | "all"; labelKey: DictionaryKey }> = [
  { value: "all", labelKey: "accountListings.filters.all" },
  { value: "MARKET", labelKey: "accountListings.types.market" },
  { value: "SERVICES", labelKey: "accountListings.types.services" },
  { value: "OPT", labelKey: "accountListings.types.opt" },
  { value: "CARGO", labelKey: "accountListings.types.cargo" },
];

type AccountListingsFiltersProps = {
  filters: SellerListingsFilters;
};

function ChipRow({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  );
}

export function AccountListingsFilters({ filters }: AccountListingsFiltersProps) {
  const { t } = useTranslation();
  const router = useRouter();

  function push(next: Partial<SellerListingsFilters>) {
    const merged: SellerListingsFilters = {
      ...filters,
      ...next,
      page: 1,
    };
    router.push(`/account/listings${buildSellerListingsQueryString(merged)}`);
  }

  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900 sm:space-y-3 sm:p-4">
      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:mb-2 sm:text-xs sm:normal-case sm:tracking-normal">
          {t("accountListings.status")}
        </p>
        <ChipRow>
          {STATUS_CHIPS.map((chip) => {
            const active = filters.status === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => push({ status: chip.value })}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold transition sm:px-3 sm:py-1.5",
                  active
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300",
                )}
              >
                {t(chip.labelKey)}
              </button>
            );
          })}
        </ChipRow>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:mb-2 sm:text-xs sm:normal-case sm:tracking-normal">
          {t("accountListings.type")}
        </p>
        <ChipRow>
          {TYPE_CHIPS.map((chip) => {
            const active =
              chip.value === "all"
                ? filters.vertical === null
                : filters.vertical === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() =>
                  push({
                    vertical: chip.value === "all" ? null : chip.value,
                  })
                }
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold transition sm:px-3 sm:py-1.5",
                  active
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300",
                )}
              >
                {t(chip.labelKey)}
              </button>
            );
          })}
        </ChipRow>
      </div>

      {(filters.status !== "all" || filters.vertical !== null) && (
        <Link
          href="/account/listings"
          className="inline-block text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {t("accountListings.filters.all")}
        </Link>
      )}
    </div>
  );
}
