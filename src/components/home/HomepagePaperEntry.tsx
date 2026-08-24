"use client";

import Link from "next/link";
import {
  Briefcase,
  Megaphone,
  Package,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { trackVerticalClick } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

type EntryLink = {
  id: "OPT" | "MARKET" | "SERVICES" | "CARGO";
  labelKey: DictionaryKey;
  href: string;
  icon: LucideIcon;
  iconWrap: string;
  iconColor: string;
};

const ENTRY_LINKS: EntryLink[] = [
  {
    id: "MARKET",
    labelKey: "nav.market",
    href: "/market",
    icon: Megaphone,
    iconWrap: "bg-purple-100 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-300",
  },
  {
    id: "SERVICES",
    labelKey: "nav.services",
    href: "/services",
    icon: Briefcase,
    iconWrap: "bg-green-100 dark:bg-green-950/60",
    iconColor: "text-green-600 dark:text-green-300",
  },
  {
    id: "OPT",
    labelKey: "nav.opt",
    href: "/opt",
    icon: Package,
    iconWrap: "bg-blue-100 dark:bg-blue-950/60",
    iconColor: "text-blue-600 dark:text-blue-300",
  },
  {
    id: "CARGO",
    labelKey: "nav.cargo",
    href: "/cargo",
    icon: Truck,
    iconWrap: "bg-orange-100 dark:bg-orange-950/60",
    iconColor: "text-orange-600 dark:text-orange-300",
  },
];

/**
 * Compact marketplace entry for `/` — quick nav row only.
 * Search and hero copy live in the global header.
 */
export function HomepagePaperEntry() {
  const { t } = useTranslation();

  return (
    <section
      data-home-section="marketplace-entry"
      className="overflow-x-clip bg-[#F8FAFC] pb-1 pt-2 sm:pb-3 sm:pt-3 dark:bg-slate-950"
      aria-label={t("home.directions")}
    >
      <Container size="lg">
        <ul
          className="flex w-full min-w-0 gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-4 sm:gap-2.5 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {ENTRY_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.id} className="min-w-0 shrink-0 sm:shrink">
                <Link
                  href={link.href}
                  onClick={() => {
                    trackVerticalClick(link.id, "homepage");
                  }}
                  className={cn(
                    "group flex h-11 min-w-[7.25rem] items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 transition",
                    "hover:border-slate-300 hover:bg-slate-50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2",
                    "dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800",
                    "sm:h-12 sm:min-w-0 sm:justify-center sm:px-3.5",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg",
                      link.iconWrap,
                      link.iconColor,
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="size-3.5" strokeWidth={1.75} />
                  </span>
                  <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {t(link.labelKey)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
