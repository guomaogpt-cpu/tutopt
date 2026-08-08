"use client";

import type { ListingVertical } from "@prisma/client";
import { Building2, Megaphone, Package, Wrench } from "lucide-react";
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
    titleKey: "post.sellGoods",
    descriptionKey: "post.sellGoodsDescription",
    icon: Megaphone,
  },
  {
    vertical: "SERVICES",
    titleKey: "post.offerService",
    descriptionKey: "post.offerServiceDescription",
    icon: Wrench,
  },
  {
    vertical: "OPT",
    titleKey: "post.wholesaleGoods",
    descriptionKey: "post.wholesaleGoodsDescription",
    icon: Package,
  },
  {
    vertical: "CARGO",
    titleKey: "post.cargoCompany",
    descriptionKey: "post.cargoCompanyDescription",
    icon: Building2,
  },
];

export function CreateListingVerticalChooser({
  onSelect,
}: CreateListingVerticalChooserProps) {
  const { t } = useTranslation();

  return (
    <section
      className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:mt-6 sm:p-6"
      aria-labelledby="post-choose-type-heading"
    >
      <h2
        id="post-choose-type-heading"
        className="text-lg font-bold text-slate-900 dark:text-slate-100"
      >
        {t("post.chooseType")}
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("post.chooseTypeHint")}</p>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const theme = getVerticalTheme(option.vertical);
          return (
            <button
              key={option.vertical}
              type="button"
              onClick={() => onSelect(option.vertical)}
              className={cn(
                "flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left transition active:scale-[0.99]",
                "hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900",
                theme.primaryBorder,
              )}
            >
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl",
                  theme.softIcon,
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                  {t(option.titleKey)}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-slate-500 dark:text-slate-400">
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
