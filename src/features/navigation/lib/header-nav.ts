import type { HeaderUser } from "@/features/navigation/lib/header-menu";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { parseListingVerticalParam } from "@/features/verticals/verticals";
import { getVerticalTheme } from "@/lib/vertical-theme";
import type { ListingVertical } from "@prisma/client";

export type NavLinkItem = {
  labelKey: DictionaryKey;
  href: string;
};

/** Account drawer links — still RU labels (Phase 53 known gap). */
export type AccountLinkItem = {
  label: string;
  href: string;
};

/** Desktop + mobile primary nav: directions only (no Catalog / Sellers / Categories). */
export const HEADER_PRIMARY_LINKS: NavLinkItem[] = [
  { labelKey: "nav.opt", href: "/opt" },
  { labelKey: "nav.market", href: "/market" },
  { labelKey: "nav.services", href: "/services" },
  { labelKey: "nav.cargo", href: "/cargo" },
];

/** Second-level header section nav — Объявления first. */
export const HEADER_SECTION_LINKS: NavLinkItem[] = [
  { labelKey: "nav.market", href: "/market" },
  { labelKey: "nav.services", href: "/services" },
  { labelKey: "nav.opt", href: "/opt" },
  { labelKey: "nav.cargo", href: "/cargo" },
];

/** Soft active pill per direction — from vertical theme (Phase 86). */
export const HEADER_NAV_ACTIVE_CLASS: Record<string, string> = {
  "/opt": getVerticalTheme("OPT").navActive,
  "/market": getVerticalTheme("MARKET").navActive,
  "/services": getVerticalTheme("SERVICES").navActive,
  "/cargo": getVerticalTheme("CARGO").navActive,
};

export const HEADER_NAV_ACTIVE_FALLBACK = getVerticalTheme(null).navActive;

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

const SECTION_HREF_VERTICAL: Record<string, ListingVertical> = {
  "/market": "MARKET",
  "/services": "SERVICES",
  "/opt": "OPT",
  "/cargo": "CARGO",
};

/** Active state for second-level section nav (pathname + listings vertical query). */
export function isSectionNavActive(
  pathname: string,
  searchParams: URLSearchParams | { get(name: string): string | null },
  href: string,
): boolean {
  if (isNavLinkActive(pathname, href)) {
    return true;
  }

  if (pathname !== "/listings") {
    return false;
  }

  const targetVertical = SECTION_HREF_VERTICAL[href];
  if (!targetVertical) {
    return false;
  }

  const queryVertical = parseListingVerticalParam(searchParams.get("vertical"));
  return queryVertical === targetVertical;
}

/**
 * Secondary links for the mobile drawer (account / role), after primary directions.
 * Does not include Catalog, Sellers, or Categories.
 */
export function getMobileAccountLinks(
  user: HeaderUser | null,
): AccountLinkItem[] {
  if (!user) {
    return [];
  }

  switch (user.role) {
    case "BUYER":
    case "SELLER":
      return [
        { label: "Личный кабинет", href: "/account" },
        { label: "Мои объявления", href: "/account/listings" },
        { label: "Заявки", href: "/account/requests" },
        { label: "Профиль компании", href: "/account/company" },
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
export function getMobileDrawerLinks(
  user: HeaderUser | null,
): Array<NavLinkItem | AccountLinkItem> {
  return [...HEADER_PRIMARY_LINKS, ...getMobileAccountLinks(user)];
}
