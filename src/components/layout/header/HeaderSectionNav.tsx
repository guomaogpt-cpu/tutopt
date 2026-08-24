"use client";

import Link from "next/link";
import {
  Briefcase,
  Megaphone,
  Package,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  getHeaderNavActiveClass,
  isSectionNavActive,
} from "@/features/navigation/lib/header-nav";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { trackVerticalClick } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import type { ListingVertical } from "@prisma/client";

type SectionLinkConfig = {
  id: ListingVertical;
  labelKey: DictionaryKey;
  href: string;
  icon: LucideIcon;
  iconColor: string;
};

const SECTION_LINKS: SectionLinkConfig[] = [
  {
    id: "MARKET",
    labelKey: "nav.market",
    href: "/market",
    icon: Megaphone,
    iconColor: "text-purple-600 dark:text-purple-300",
  },
  {
    id: "SERVICES",
    labelKey: "nav.services",
    href: "/services",
    icon: Briefcase,
    iconColor: "text-green-600 dark:text-green-300",
  },
  {
    id: "OPT",
    labelKey: "nav.opt",
    href: "/opt",
    icon: Package,
    iconColor: "text-blue-600 dark:text-blue-300",
  },
  {
    id: "CARGO",
    labelKey: "nav.cargo",
    href: "/cargo",
    icon: Truck,
    iconColor: "text-orange-600 dark:text-orange-300",
  },
];

export function HeaderSectionNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  return (
    <nav
      className="min-w-0 border-t border-slate-100 dark:border-slate-800"
      aria-label={t("nav.main")}
    >
      <ul
        className="flex h-11 min-w-0 items-center gap-1.5 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:h-12 sm:justify-center sm:gap-2 lg:h-14 lg:gap-2.5 [&::-webkit-scrollbar]:hidden"
      >
        {SECTION_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = isSectionNavActive(pathname, searchParams, link.href);

          return (
            <li key={link.id} className="shrink-0">
              <Link
                href={link.href}
                onClick={() => {
                  trackVerticalClick(link.id, "header");
                }}
                className={cn(
                  "flex h-9 min-w-[6.75rem] items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition",
                  "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2",
                  "sm:h-10 sm:min-w-[7.5rem] sm:px-3.5",
                  isActive && getHeaderNavActiveClass(link.href),
                )}
              >
                <Icon
                  className={cn("size-3.5 shrink-0", !isActive && link.iconColor)}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="truncate">{t(link.labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
