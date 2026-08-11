"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Megaphone,
  Package,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SearchWithSuggest } from "@/components/search/SearchWithSuggest";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { trackVerticalClick } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

type EntryCard = {
  id: "OPT" | "MARKET" | "SERVICES" | "CARGO";
  labelKey: DictionaryKey;
  descriptionKey: DictionaryKey;
  href: string;
  icon: LucideIcon;
  accentBar: string;
  iconWrap: string;
  iconColor: string;
};

const ENTRY_CARDS: EntryCard[] = [
  {
    id: "MARKET",
    labelKey: "nav.market",
    descriptionKey: "home.marketDesc",
    href: "/market",
    icon: Megaphone,
    accentBar: "bg-purple-500",
    iconWrap: "bg-purple-100 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-300",
  },
  {
    id: "SERVICES",
    labelKey: "nav.services",
    descriptionKey: "home.servicesDesc",
    href: "/services",
    icon: Briefcase,
    accentBar: "bg-green-500",
    iconWrap: "bg-green-100 dark:bg-green-950/60",
    iconColor: "text-green-600 dark:text-green-300",
  },
  {
    id: "OPT",
    labelKey: "nav.opt",
    descriptionKey: "home.optDesc",
    href: "/opt",
    icon: Package,
    accentBar: "bg-blue-500",
    iconWrap: "bg-blue-100 dark:bg-blue-950/60",
    iconColor: "text-blue-600 dark:text-blue-300",
  },
  {
    id: "CARGO",
    labelKey: "nav.cargo",
    descriptionKey: "home.cargoDesc",
    href: "/cargo",
    icon: Truck,
    accentBar: "bg-orange-500",
    iconWrap: "bg-orange-100 dark:bg-orange-950/60",
    iconColor: "text-orange-600 dark:text-orange-300",
  },
];

/**
 * Marketplace entry for `/`.
 * Mobile: title, one search, compact 2×2 sections — no welcome/quick actions/chips.
 * sm+/desktop: lead + search row and wider white cards.
 */
export function HomepagePaperEntry() {
  const { t } = useTranslation();

  return (
    <section
      data-home-section="marketplace-entry"
      className="overflow-x-clip bg-[#F8FAFC] pb-2 pt-1 sm:pb-8 sm:pt-4 lg:pb-10 dark:bg-slate-950"
      aria-labelledby="home-marketplace-lead"
    >
      <Container size="lg">
        <div className="flex flex-col gap-2 sm:gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="min-w-0 max-w-xl">
            <h1
              id="home-marketplace-lead"
              className="text-base font-bold leading-snug tracking-tight text-slate-900 sm:hidden dark:text-slate-100"
            >
              {t("home.appTitle")}
            </h1>
            <p className="mt-0.5 text-xs leading-snug text-slate-500 sm:hidden dark:text-slate-400">
              {t("home.appSubtitle")}
            </p>
            <p className="hidden min-w-0 text-2xl font-bold leading-snug text-slate-900 sm:block lg:text-3xl dark:text-slate-100">
              {t("home.lead")}
            </p>
          </div>

          <div className="hidden w-full min-w-0 sm:block lg:max-w-[440px]">
            <SearchWithSuggest
              id="home-marketplace-search"
              variant="header"
              placeholder={t("home.searchPlaceholder")}
              buttonLabel={t("search.find")}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-2 sm:hidden">
          <SearchWithSuggest
            id="home-mobile-search"
            variant="header"
            placeholder={t("home.searchPlaceholder")}
            buttonLabel={t("search.find")}
            className="w-full"
          />
        </div>

        <h2 className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:mt-4 sm:text-sm sm:normal-case sm:tracking-normal sm:text-slate-700 dark:text-slate-400 dark:sm:text-slate-300">
          {t("home.sectionsTitle")}
        </h2>

        <ul
          className="mt-1.5 grid w-full grid-cols-2 gap-1.5 sm:mt-4 sm:gap-3.5 lg:grid-cols-4 lg:gap-4"
          aria-label={t("home.directions")}
        >
          {ENTRY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <li key={card.id} className="min-w-0">
                <Link
                  href={card.href}
                  onClick={() => {
                    trackVerticalClick(card.id, "homepage");
                  }}
                  className={cn(
                    "group relative flex w-full flex-col overflow-hidden transition duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
                    "min-h-[3.5rem] items-center gap-1 rounded-xl border border-slate-200/80 bg-white px-2 py-2",
                    "dark:border-slate-800 dark:bg-slate-900",
                    "sm:min-h-[140px] sm:items-stretch sm:justify-start sm:gap-0 sm:rounded-2xl sm:border-slate-200/70 sm:p-5 sm:shadow-sm",
                    "sm:hover:-translate-y-0.5 sm:hover:border-slate-300 sm:hover:shadow-md",
                    "dark:sm:border-slate-800 dark:sm:bg-slate-900 dark:sm:shadow-none dark:sm:hover:border-slate-700",
                  )}
                >
                  <div className="flex items-center gap-2 sm:items-start sm:justify-between">
                    <span
                      className={cn(
                        "flex shrink-0 items-center justify-center rounded-lg sm:rounded-xl",
                        "size-6 sm:size-10",
                        card.iconWrap,
                        card.iconColor,
                        "dark:sm:bg-slate-800",
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="size-3 sm:size-5" strokeWidth={1.75} />
                    </span>
                    <ArrowRight
                      className="hidden size-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500 sm:block dark:text-slate-500 dark:group-hover:text-slate-300"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0 text-center sm:mt-3 sm:flex-1 sm:text-left">
                    <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-900 sm:text-[15px] sm:font-bold dark:text-slate-100">
                      {t(card.labelKey)}
                    </p>
                    <p className="mt-1 hidden text-xs leading-snug text-slate-500 sm:line-clamp-2 sm:block sm:text-[13px] dark:text-slate-400">
                      {t(card.descriptionKey)}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "mt-2 hidden h-[3px] w-10 rounded-full sm:mt-4 sm:block",
                      card.accentBar,
                    )}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
