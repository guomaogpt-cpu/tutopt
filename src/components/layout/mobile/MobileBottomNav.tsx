"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, Plus, Search, User } from "lucide-react";
import {
  buildLoginUrl,
  getCreateListingHref,
  shouldShowCreateListingCTA,
} from "@/features/auth/lib/login-redirect";
import type { HeaderUser } from "@/features/navigation/lib/header-menu";
import {
  getActiveMobileNavTab,
  getMobileProfileHref,
  type MobileNavTabId,
} from "@/features/navigation/lib/mobile-nav";
import { useUnreadNotificationCount } from "@/features/notifications/lib/use-unread-notification-count";
import { useHideNavOnFormFocus } from "@/hooks/use-hide-nav-on-form-focus";
import { useRouteVerticalTheme } from "@/lib/use-route-vertical-theme";
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

const FORM_ROUTES = ["/listings/new"];

export function MobileBottomNav({ user }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { theme } = useRouteVerticalTheme();
  const activeTab = getActiveMobileNavTab(pathname);
  const unreadCount = useUnreadNotificationCount();
  const showNotificationsBadge = Boolean(user) && unreadCount > 0;
  const hideOnFormFocus = useHideNavOnFormFocus(
    FORM_ROUTES.some((route) => pathname.startsWith(route)),
  );

  const showPost = shouldShowCreateListingCTA(user);

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
    ...(showPost
      ? [
          {
            id: "post" as const,
            href: getCreateListingHref(user),
            labelKey: "mobileNav.post" as const,
            icon: Plus,
            isCenter: true,
          },
        ]
      : []),
    {
      id: "notifications",
      href: user ? "/notifications" : buildLoginUrl("/notifications"),
      labelKey: "mobileNav.notifications",
      icon: Bell,
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
      aria-hidden={hideOnFormFocus}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur transition-transform duration-200",
        "supports-[backdrop-filter]:bg-white/90 md:hidden",
        "dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/90",
        hideOnFormFocus && "pointer-events-none translate-y-full opacity-0",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul
        className={cn(
          "mx-auto grid h-[4.25rem] max-w-lg items-end px-1 pt-1",
          showPost ? "grid-cols-5" : "grid-cols-4",
        )}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isCenter) {
            return (
              <li key={item.id} className="relative flex justify-center">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="group -mt-5 flex flex-col items-center gap-0.5"
                >
                  <span
                    className={cn(
                      "flex size-[3.25rem] items-center justify-center rounded-full text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition",
                      theme.primaryBg,
                      "group-active:scale-95",
                      isActive && cn("ring-[3px] ring-offset-2 dark:ring-offset-slate-950", theme.ring),
                    )}
                  >
                    <Icon className="size-7" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold leading-none text-slate-600 dark:text-slate-300",
                      isActive && theme.primaryText,
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
                  "relative flex min-w-[3.25rem] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition",
                  isActive
                    ? cn("bg-slate-100 dark:bg-slate-800/80", theme.primaryText)
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                )}
              >
                <span className="relative">
                  <Icon
                    className={cn("size-[1.35rem]", isActive && "stroke-[2.5]")}
                    aria-hidden="true"
                  />
                  {item.id === "notifications" && showNotificationsBadge ? (
                    <span
                      className={cn(
                        "absolute -right-0.5 -top-0.5 size-2 rounded-full ring-2 ring-white dark:ring-slate-950",
                        theme.primaryBg,
                      )}
                      aria-hidden="true"
                    />
                  ) : null}
                </span>
                <span className="text-[10px] font-semibold leading-none">{t(item.labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
