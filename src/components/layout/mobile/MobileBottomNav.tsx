"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, PlusCircle, Search, User } from "lucide-react";
import { getCreateListingHref } from "@/features/auth/lib/login-redirect";
import type { HeaderUser } from "@/features/navigation/lib/header-menu";
import {
  getActiveMobileNavTab,
  getMobileProfileHref,
  type MobileNavTabId,
} from "@/features/navigation/lib/mobile-nav";
import { useUnreadNotificationCount } from "@/features/notifications/lib/use-unread-notification-count";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type MobileBottomNavProps = {
  user: HeaderUser | null;
};

type NavItem = {
  id: MobileNavTabId;
  href: string;
  labelKey: DictionaryKey;
  icon: typeof Home;
  isCenter?: boolean;
};

export function MobileBottomNav({ user }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const activeTab = getActiveMobileNavTab(pathname);
  const unreadCount = useUnreadNotificationCount();
  const showProfileBadge = Boolean(user) && unreadCount > 0;

  const items: NavItem[] = [
    {
      id: "home",
      href: "/",
      labelKey: "mobileNav.home",
      icon: Home,
    },
    {
      id: "search",
      href: "/listings",
      labelKey: "mobileNav.search",
      icon: Search,
    },
    {
      id: "post",
      href: getCreateListingHref(user),
      labelKey: "mobileNav.post",
      icon: PlusCircle,
      isCenter: true,
    },
    {
      id: "favorites",
      href: "/favorites",
      labelKey: "mobileNav.favorites",
      icon: Heart,
    },
    {
      id: "profile",
      href: getMobileProfileHref(user),
      labelKey: "mobileNav.profile",
      icon: User,
    },
  ];

  return (
    <nav
      aria-label={t("mobileNav.label")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 md:hidden dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/90"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5 items-end px-1 pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isCenter) {
            return (
              <li key={item.id} className="relative flex justify-center">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="group -mt-4 flex flex-col items-center gap-0.5"
                >
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition group-hover:bg-blue-700",
                      isActive && "ring-2 ring-blue-300 ring-offset-2 dark:ring-blue-500 dark:ring-offset-slate-950",
                    )}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold leading-none text-slate-600 dark:text-slate-300",
                      isActive && "text-blue-600 dark:text-blue-400",
                    )}
                  >
                    {t(item.labelKey)}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={item.id} className="flex justify-center">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex min-w-[3.5rem] flex-col items-center gap-1 px-1 py-1.5 text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400",
                  isActive && "text-blue-600 dark:text-blue-400",
                )}
              >
                <span className="relative">
                  <Icon
                    className={cn("size-5", isActive && "stroke-[2.25]")}
                    aria-hidden="true"
                  />
                  {item.id === "profile" && showProfileBadge ? (
                    <span
                      className="absolute -right-1 -top-0.5 size-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-950"
                      aria-hidden="true"
                    />
                  ) : null}
                </span>
                <span className="text-[10px] font-semibold leading-none">
                  {t(item.labelKey)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
