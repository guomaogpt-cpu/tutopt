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
  shortKey: DictionaryKey;
  href: string;
  icon: LucideIcon;
  accentBar: string;
  iconWrap: string;
  iconColor: string;
  /** Soft tinted surface for compact mobile category buttons. */
  mobileTile: string;
};

const ENTRY_CARDS: EntryCard[] = [
  {
    id: "MARKET",
    labelKey: "nav.market",
    descriptionKey: "home.marketDesc",
    shortKey: "home.marketShort",
    href: "/market",
    icon: Megaphone,
    accentBar: "bg-purple-500",
    iconWrap: "bg-purple-100 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-300",
    mobileTile:
      "border-purple-200/80 bg-gradient-to-br from-purple-50 to-purple-100/70 dark:border-purple-800/60 dark:from-purple-950/50 dark:to-slate-900",
  },
  {
    id: "SERVICES",
    labelKey: "nav.services",
    descriptionKey: "home.servicesDesc",
    shortKey: "home.servicesShort",
    href: "/services",
    icon: Briefcase,
    accentBar: "bg-green-500",
    iconWrap: "bg-green-100 dark:bg-green-950/60",
    iconColor: "text-green-600 dark:text-green-300",
    mobileTile:
      "border-green-200/80 bg-gradient-to-br from-green-50 to-green-100/70 dark:border-green-800/60 dark:from-green-950/50 dark:to-slate-900",
  },
  {
    id: "OPT",
    labelKey: "nav.opt",
    descriptionKey: "home.optDesc",
    shortKey: "home.optShort",
    href: "/opt",
    icon: Package,
    accentBar: "bg-blue-500",
    iconWrap: "bg-blue-100 dark:bg-blue-950/60",
    iconColor: "text-blue-600 dark:text-blue-300",
    mobileTile:
      "border-blue-200/80 bg-gradient-to-br from-blue-50 to-blue-100/70 dark:border-blue-800/60 dark:from-blue-950/50 dark:to-slate-900",
  },
  {
    id: "CARGO",
    labelKey: "nav.cargo",
    descriptionKey: "home.cargoDesc",
    shortKey: "home.cargoShort",
    href: "/cargo",
    icon: Truck,
    accentBar: "bg-orange-500",
    iconWrap: "bg-orange-100 dark:bg-orange-950/60",
    iconColor: "text-orange-600 dark:text-orange-300",
    mobileTile:
      "border-orange-200/80 bg-gradient-to-br from-orange-50 to-amber-50 dark:border-orange-800/60 dark:from-orange-950/45 dark:to-slate-900",
  },
];

/**
 * Marketplace entry for `/`.
 * Mobile: header search only; compact tinted 2×2 category buttons.
 * sm+/desktop: lead + search row and wider white cards.
 */
export function HomepagePaperEntry() {
  const { t } = useTranslation();

  return (
    <section
      data-home-section="marketplace-entry"
      className="overflow-x-clip bg-[#F8FAFC] pb-2 pt-2 sm:pb-8 sm:pt-4 lg:pb-10 dark:bg-slate-950"
      aria-labelledby="home-marketplace-lead"
    >
      <Container size="lg">
        <div className="flex flex-col gap-2 sm:gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="min-w-0 max-w-xl">
            <h1
              id="home-marketplace-lead"
              className="text-base font-bold leading-snug tracking-tight text-slate-900 sm:hidden dark:text-slate-100"
            >
              {t("home.mobileTitle")}
            </h1>
            <p className="mt-0.5 line-clamp-1 text-xs leading-snug text-slate-500 sm:hidden dark:text-slate-400">
              {t("home.mobileSubtitle")}
            </p>
            <p className="hidden min-w-0 text-2xl font-bold leading-snug text-slate-900 sm:block lg:text-3xl dark:text-slate-100">
              {t("home.lead")}
            </p>
          </div>

          {/* Duplicate of header search — hide on mobile, keep for tablet/desktop */}
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

        <ul
          className="mt-2 grid w-full grid-cols-2 gap-2 sm:mt-4 sm:gap-3.5 lg:grid-cols-4 lg:gap-4"
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
                    // Mobile: compact tinted category button (not a huge empty square)
                    "min-h-[100px] justify-between gap-2 rounded-xl border p-2.5",
                    card.mobileTile,
                    // Tablet+: roomier neutral cards
                    "sm:min-h-[140px] sm:justify-start sm:gap-0 sm:rounded-2xl sm:border-slate-200/70 sm:bg-white sm:bg-none sm:p-5 sm:shadow-sm",
                    "sm:hover:-translate-y-0.5 sm:hover:border-slate-300 sm:hover:shadow-md",
                    "dark:sm:border-slate-800 dark:sm:bg-slate-900 dark:sm:shadow-none dark:sm:hover:border-slate-700",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "flex shrink-0 items-center justify-center rounded-lg sm:rounded-xl",
                        "size-8 sm:size-10",
                        card.iconWrap,
                        card.iconColor,
                        "sm:bg-opacity-100 dark:sm:bg-slate-800",
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="size-3.5 sm:size-5" strokeWidth={1.75} />
                    </span>
                    <ArrowRight
                      className="hidden size-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500 sm:block dark:text-slate-500 dark:group-hover:text-slate-300"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0 sm:mt-3 sm:flex-1">
                    <p className="line-clamp-1 text-sm font-semibold tracking-tight text-slate-900 sm:text-[15px] sm:font-bold dark:text-slate-100">
                      {t(card.labelKey)}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[11px] leading-snug text-slate-600 sm:hidden dark:text-slate-400">
                      {t(card.shortKey)}
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
