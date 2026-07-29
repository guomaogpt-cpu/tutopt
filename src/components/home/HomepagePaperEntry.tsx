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
    accentBar: "bg-violet-500",
    iconWrap: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    id: "SERVICES",
    labelKey: "nav.services",
    descriptionKey: "home.servicesDesc",
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
    href: "/cargo",
    icon: Truck,
    accentBar: "bg-orange-500",
    iconWrap: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

/**
 * Integrated marketplace entry for `/`.
 * paperBoard experiment disabled — no outer poster wrapper / PNG layout.
 * PNG paper banner kept as reference only.
 * Compact: no “TUTOPT” label / no large “ОБЪЯВЛЕНИЯ” heading.
 */
export function HomepagePaperEntry() {
  const { t } = useTranslation();

  return (
    <section
      data-home-section="marketplace-entry"
      className="overflow-x-clip bg-[#F8FAFC] pb-6 pt-4 sm:pb-8 sm:pt-4 lg:pb-10 dark:bg-slate-950"
      aria-labelledby="home-marketplace-lead"
    >
      <Container size="lg">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <p
            id="home-marketplace-lead"
            className="min-w-0 max-w-xl text-xl font-bold leading-snug text-[#0F172A] sm:text-2xl lg:text-3xl dark:text-slate-100"
          >
            {t("home.lead")}
          </p>

          <div className="w-full min-w-0 lg:max-w-[440px]">
            <SearchWithSuggest
              id="home-marketplace-search"
              variant="header"
              placeholder={t("search.homePlaceholder")}
              buttonLabel={t("search.find")}
            />
          </div>
        </div>

        <ul
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4 lg:gap-4"
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
                    "group relative flex h-full min-h-[132px] flex-col overflow-hidden",
                    "rounded-[20px] border border-slate-200/70 bg-white p-4 shadow-sm",
                    "dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
                    "transition duration-200",
                    "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:hover:border-slate-700",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950",
                    "sm:min-h-[140px] sm:p-5",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl",
                        card.iconWrap,
                        card.iconColor,
                        "dark:bg-slate-800",
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-3 min-w-0 flex-1">
                    <p className="text-[15px] font-bold tracking-tight text-[#0F172A] dark:text-slate-100">
                      {t(card.labelKey)}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-[#64748B] sm:text-[13px] dark:text-slate-400">
                      {t(card.descriptionKey)}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "mt-4 h-[3px] w-10 rounded-full",
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
