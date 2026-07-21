import type { HeaderUser } from "@/features/navigation/lib/header-menu";

export type NavLinkItem = {
  label: string;
  href: string;
};

/** Desktop + mobile primary nav: directions only (no Catalog / Sellers / Categories). */
export const HEADER_PRIMARY_LINKS: NavLinkItem[] = [
  { label: "Опт", href: "/opt" },
  { label: "Объявления", href: "/market" },
  { label: "Услуги", href: "/services" },
  { label: "Карго", href: "/cargo" },
];

/** Soft active tint per direction — local Tailwind classes only. */
export const HEADER_NAV_ACTIVE_CLASS: Record<string, string> = {
  "/opt":
    "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-300",
  "/market":
    "bg-indigo-50 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-300",
  "/services":
    "bg-teal-50 text-teal-800 hover:bg-teal-50 hover:text-teal-800 dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-950 dark:hover:text-teal-300",
  "/cargo":
    "bg-rose-50 text-rose-700 hover:bg-rose-50 hover:text-rose-700 dark:bg-rose-950 dark:text-rose-300 dark:hover:bg-rose-950 dark:hover:text-rose-300",
};

export const HEADER_NAV_ACTIVE_FALLBACK =
  "bg-slate-100 text-slate-900 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-100";

export function getHeaderNavActiveClass(href: string): string {
  return HEADER_NAV_ACTIVE_CLASS[href] ?? HEADER_NAV_ACTIVE_FALLBACK;
}

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/listings") {
    return (
      pathname === "/listings" ||
      (pathname.startsWith("/listings/") && pathname !== "/listings/new")
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Secondary links for the mobile drawer (account / role), after primary directions.
 * Does not include Catalog, Sellers, or Categories.
 */
export function getMobileAccountLinks(user: HeaderUser | null): NavLinkItem[] {
  if (!user) {
    return [];
  }

  switch (user.role) {
    case "BUYER":
      return [
        { label: "Кабинет покупателя", href: "/buyer/dashboard" },
        { label: "Избранное", href: "/favorites" },
        { label: "Уведомления", href: "/notifications" },
      ];
    case "SELLER":
      return [
        { label: "Кабинет продавца", href: "/seller/dashboard" },
        { label: "Заявки", href: "/seller/leads" },
        { label: "Подать объявление", href: "/listings/new" },
        { label: "Избранное", href: "/favorites" },
        { label: "Уведомления", href: "/notifications" },
      ];
    case "MODERATOR":
      return [
        { label: "Обзор админки", href: "/admin" },
        { label: "Модерация", href: "/admin/moderation/listings" },
        { label: "Уведомления", href: "/notifications" },
      ];
    case "ADMIN":
      return [
        { label: "Обзор админки", href: "/admin" },
        { label: "Пользователи", href: "/admin/users" },
        { label: "Модерация", href: "/admin/moderation/listings" },
        { label: "Уведомления", href: "/notifications" },
      ];
    default:
      return [];
  }
}

/** @deprecated Use getMobileAccountLinks — kept for any leftover imports during transition. */
export function getMobileDrawerLinks(user: HeaderUser | null): NavLinkItem[] {
  return [...HEADER_PRIMARY_LINKS, ...getMobileAccountLinks(user)];
}
