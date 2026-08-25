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
  activeAccent: string;
};

const SECTION_LINKS: SectionLinkConfig[] = [
  {
    id: "MARKET",
    labelKey: "nav.market",
    href: "/market",
    icon: Megaphone,
    iconColor: "text-purple-600 dark:text-purple-300",
    activeAccent: "text-purple-700 dark:text-purple-300",
  },
  {
    id: "SERVICES",
    labelKey: "nav.services",
    href: "/services",
    icon: Briefcase,
    iconColor: "text-green-600 dark:text-green-300",
    activeAccent: "text-green-700 dark:text-green-300",
  },
  {
    id: "OPT",
    labelKey: "nav.opt",
    href: "/opt",
    icon: Package,
    iconColor: "text-blue-600 dark:text-blue-300",
    activeAccent: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "CARGO",
    labelKey: "nav.cargo",
    href: "/cargo",
    icon: Truck,
    iconColor: "text-orange-600 dark:text-orange-300",
    activeAccent: "text-orange-700 dark:text-orange-300",
  },
];

type HeaderSectionNavProps = {
  variant?: "inline" | "scroll";
  className?: string;
};

export function HeaderSectionNav({
  variant = "inline",
  className,
}: HeaderSectionNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const isScroll = variant === "scroll";

  return (
    <nav
      className={cn("min-w-0", className)}
      aria-label={t("nav.main")}
    >
      <ul
        className={cn(
          "flex min-w-0 items-center gap-0.5",
          isScroll
            ? "h-9 overflow-x-auto px-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "hidden h-full lg:flex lg:gap-1",
        )}
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
                  "relative flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition",
                  "text-slate-600 hover:bg-white/70 hover:text-slate-900",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2",
                  "dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-slate-100",
                  "lg:px-2.5 lg:text-sm",
                  isScroll && "h-8 whitespace-nowrap sm:px-2.5",
                  isActive && !isScroll && getHeaderNavInlineActiveClass(link),
                  isActive && isScroll && getHeaderNavActiveClass(link.href),
                  isActive && isScroll && "rounded-full px-2.5",
                )}
              >
                <Icon
                  className={cn(
                    "size-3.5 shrink-0",
                    !isActive && link.iconColor,
                    isActive && !isScroll && link.activeAccent,
                  )}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="truncate">{t(link.labelKey)}</span>
                {isActive && !isScroll ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-1 -bottom-1 h-0.5 rounded-full",
                      link.id === "MARKET" && "bg-purple-500",
                      link.id === "SERVICES" && "bg-green-500",
                      link.id === "OPT" && "bg-blue-500",
                      link.id === "CARGO" && "bg-orange-500",
                    )}
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function getHeaderNavInlineActiveClass(link: SectionLinkConfig): string {
  return cn(link.activeAccent, "font-semibold");
}
