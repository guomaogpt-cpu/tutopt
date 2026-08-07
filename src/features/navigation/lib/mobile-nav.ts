import type { HeaderUser } from "@/features/navigation/lib/header-menu";
import { getAccountHomeHref } from "@/features/navigation/lib/account-home";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";

export type MobileNavTabId = "home" | "search" | "post" | "notifications" | "profile";

export function getMobileProfileHref(user: HeaderUser | null): string {
  if (!user) {
    return buildLoginUrl("/account");
  }

  return getAccountHomeHref(user.role);
}

export function getActiveMobileNavTab(pathname: string): MobileNavTabId | null {
  if (pathname === "/listings/new" || pathname.startsWith("/listings/new/")) {
    return "post";
  }

  if (pathname === "/notifications" || pathname.startsWith("/notifications/")) {
    return "notifications";
  }

  if (pathname === "/account/requests" || pathname.startsWith("/account/requests/")) {
    return "notifications";
  }

  if (pathname === "/favorites" || pathname.startsWith("/favorites/")) {
    return "profile";
  }

  if (
    pathname.startsWith("/account") ||
    pathname.startsWith("/buyer") ||
    pathname.startsWith("/seller") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return "profile";
  }

  if (
    pathname === "/listings" ||
    pathname.startsWith("/listings/") ||
    pathname === "/market" ||
    pathname.startsWith("/market/") ||
    pathname === "/opt" ||
    pathname.startsWith("/opt/") ||
    pathname === "/services" ||
    pathname.startsWith("/services/") ||
    pathname === "/cargo" ||
    pathname.startsWith("/cargo/") ||
    pathname === "/categories" ||
    pathname.startsWith("/categories/")
  ) {
    return "search";
  }

  if (pathname === "/") {
    return "home";
  }

  return null;
}
