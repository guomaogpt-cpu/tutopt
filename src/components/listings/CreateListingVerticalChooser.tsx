"use client";

import type { ListingVertical } from "@prisma/client";
import { Building2, Package, Store, Truck } from "lucide-react";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getVerticalTheme } from "@/lib/vertical-theme";
import { cn } from "@/lib/utils";

type CreateListingVerticalChooserProps = {
  onSelect: (vertical: ListingVertical) => void;
};

const OPTIONS: Array<{
  vertical: ListingVertical;
  titleKey: DictionaryKey;
  descriptionKey: DictionaryKey;
  icon: typeof Package;
}> = [
  {
    vertical: "MARKET",
    titleKey: "post.market",
    descriptionKey: "post.marketDescription",
    icon: Store,
  },
  {
    vertical: "SERVICES",
    titleKey: "post.service",
    descriptionKey: "post.serviceDescription",
    icon: Package,
  },
  {
    vertical: "OPT",
    titleKey: "post.wholesale",
    descriptionKey: "post.wholesaleDescription",
    icon: Package,
  },
  {
    vertical: "CARGO",
    titleKey: "post.cargoCompany",
    descriptionKey: "post.cargoCompanyDescription",
    icon: Truck,
  },
];

export function CreateListingVerticalChooser({
  onSelect,
}: CreateListingVerticalChooserProps) {
  const { t } = useTranslation();

  return (
    <section
      className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:mt-6 sm:p-6"
      aria-labelledby="post-choose-type-heading"
    >
      <h2
        id="post-choose-type-heading"
        className="text-lg font-bold text-slate-900 dark:text-slate-100"
      >
        {t("post.chooseType")}
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const Icon = option.vertical === "CARGO" ? Building2 : option.icon;
          const theme = getVerticalTheme(option.vertical);
          return (
            <button
              key={option.vertical}
              type="button"
              onClick={() => onSelect(option.vertical)}
              className={cn(
                "flex min-h-[88px] items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition",
                "hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900",
                theme.primaryBorder,
                "hover:border-current",
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  theme.softIcon,
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t(option.titleKey)}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {t(option.descriptionKey)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
