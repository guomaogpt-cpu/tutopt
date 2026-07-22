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

/** Soft active pill per direction — local Tailwind classes only. */
export const HEADER_NAV_ACTIVE_CLASS: Record<string, string> = {
  "/opt":
    "bg-blue-600 text-white shadow-sm hover:bg-blue-600 hover:text-white dark:bg-blue-600 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white",
  "/market":
    "bg-violet-600 text-white shadow-sm hover:bg-violet-600 hover:text-white dark:bg-violet-600 dark:text-white dark:hover:bg-violet-600 dark:hover:text-white",
  "/services":
    "bg-emerald-600 text-white shadow-sm hover:bg-emerald-600 hover:text-white dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-600 dark:hover:text-white",
  "/cargo":
    "bg-orange-500 text-white shadow-sm hover:bg-orange-500 hover:text-white dark:bg-orange-500 dark:text-white dark:hover:bg-orange-500 dark:hover:text-white",
};

export const HEADER_NAV_ACTIVE_FALLBACK =
  "bg-blue-600 text-white shadow-sm hover:bg-blue-600 hover:text-white dark:bg-blue-600 dark:text-white";

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
        { label: "Мои объявления", href: "/seller/listings" },
        { label: "Заявки", href: "/seller/leads" },
        { label: "Подать объявление", href: "/listings/new" },
        { label: "Избранное", href: "/favorites" },
        { label: "Уведомления", href: "/notifications" },
      ];
    case "MODERATOR":
      return [
        { label: "Обзор админки", href: "/admin" },
        { label: "Модерация", href: "/admin/moderation/listings" },
        { label: "Жалобы", href: "/admin/reports" },
        { label: "Уведомления", href: "/notifications" },
      ];
    case "ADMIN":
      return [
        { label: "Обзор админки", href: "/admin" },
        { label: "Пользователи", href: "/admin/users" },
        { label: "Модерация", href: "/admin/moderation/listings" },
        { label: "Жалобы", href: "/admin/reports" },
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
