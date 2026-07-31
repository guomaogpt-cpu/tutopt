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
};

const ENTRY_CARDS: EntryCard[] = [
  {
    id: "MARKET",
    labelKey: "nav.market",
    descriptionKey: "home.marketDesc",
    shortKey: "home.marketShort",
    href: "/market",
    icon: Megaphone,
    accentBar: "bg-violet-500",
    iconWrap: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    id: "SERVICES",
    labelKey: "nav.services",
    descriptionKey: "home.servicesDesc",
    shortKey: "home.servicesShort",
    href: "/services",
    icon: Briefcase,
    accentBar: "bg-emerald-500",
    iconWrap: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "OPT",
    labelKey: "nav.opt",
    descriptionKey: "home.optDesc",
    shortKey: "home.optShort",
    href: "/opt",
    icon: Package,
    accentBar: "bg-blue-500",
    iconWrap: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "CARGO",
    labelKey: "nav.cargo",
    descriptionKey: "home.cargoDesc",
    shortKey: "home.cargoShort",
    href: "/cargo",
    icon: Truck,
    accentBar: "bg-orange-500",
    iconWrap: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

/**
 * Integrated marketplace entry for `/`.
 * Mobile: dense first screen — short copy, search, 2×2 tiles.
 * Desktop/tablet: wider lead + search row and larger section cards.
 */
export function HomepagePaperEntry() {
  const { t } = useTranslation();

  return (
    <section
      data-home-section="marketplace-entry"
      className="overflow-x-clip bg-[#F8FAFC] pb-3 pt-2.5 sm:pb-8 sm:pt-4 lg:pb-10 dark:bg-slate-950"
      aria-labelledby="home-marketplace-lead"
    >
      <Container size="lg">
        {/* Mobile: title → search → tiles. Desktop: lead + search row. */}
        <div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="min-w-0 max-w-xl">
            <h1
              id="home-marketplace-lead"
              className="text-[17px] font-bold leading-snug tracking-tight text-[#0F172A] sm:hidden dark:text-slate-100"
            >
              {t("home.mobileTitle")}
            </h1>
            <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-slate-500 sm:hidden dark:text-slate-400">
              {t("home.mobileSubtitle")}
            </p>
            <p className="hidden min-w-0 text-2xl font-bold leading-snug text-[#0F172A] sm:block lg:text-3xl dark:text-slate-100">
              {t("home.lead")}
            </p>
          </div>

          <div className="w-full min-w-0 lg:max-w-[440px]">
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
          className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4 lg:gap-4"
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
                    "group relative flex h-full flex-col overflow-hidden",
                    "rounded-2xl border border-slate-200/70 bg-white shadow-sm",
                    "dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
                    "transition duration-200",
                    "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:hover:border-slate-700",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
                    "aspect-square max-h-[128px] min-h-[108px] p-2.5",
                    "sm:aspect-auto sm:max-h-none sm:min-h-[140px] sm:p-5",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "flex shrink-0 items-center justify-center rounded-xl",
                        "size-8 sm:size-10",
                        card.iconWrap,
                        card.iconColor,
                        "dark:bg-slate-800",
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="size-3.5 sm:size-5" strokeWidth={1.75} />
                    </span>
                    <ArrowRight
                      className="size-3.5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500 sm:size-4 dark:text-slate-500 dark:group-hover:text-slate-300"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-auto min-w-0 pt-1.5 sm:mt-3 sm:flex-1 sm:pt-0">
                    <p className="text-[13px] font-bold tracking-tight text-[#0F172A] sm:text-[15px] dark:text-slate-100">
                      {t(card.labelKey)}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[11px] leading-snug text-[#64748B] sm:hidden dark:text-slate-400">
                      {t(card.shortKey)}
                    </p>
                    <p className="mt-1 hidden text-xs leading-snug text-[#64748B] sm:line-clamp-2 sm:block sm:text-[13px] dark:text-slate-400">
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
