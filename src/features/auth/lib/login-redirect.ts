import type { HeaderUser } from "@/features/navigation/lib/header-menu";

export function isSafeInternalPath(path: string): boolean {
  if (!path.startsWith("/")) {
    return false;
  }

  if (path.startsWith("//")) {
    return false;
  }

  if (path.includes("://")) {
    return false;
  }

  return true;
}

export function resolveNextParam(next: string | null | undefined): string {
  if (!next || !isSafeInternalPath(next)) {
    return "/";
  }

  return next;
}

export function buildLoginUrl(returnPath: string): string {
  const safePath = isSafeInternalPath(returnPath) ? returnPath : "/";
  return `/login?next=${encodeURIComponent(safePath)}`;
}

export function buildRegisterUrl(options?: { role?: "SELLER"; returnPath?: string }): string {
  const params = new URLSearchParams();

  if (options?.role === "SELLER") {
    params.set("role", "SELLER");
  }

  if (options?.returnPath && isSafeInternalPath(options.returnPath)) {
    params.set("next", options.returnPath);
  }

  const query = params.toString();
  return query ? `/register?${query}` : "/register";
}

export function buildSellerUpgradeUrl(returnPath?: string): string {
  if (returnPath && isSafeInternalPath(returnPath) && returnPath !== "/seller/upgrade") {
    return `/seller/upgrade?next=${encodeURIComponent(returnPath)}`;
  }
  return "/seller/upgrade";
}

export function shouldShowCreateListingCTA(user: HeaderUser | null): boolean {
  if (!user) {
    return true;
  }

  return user.role !== "MODERATOR" && user.role !== "ADMIN";
}

export function getCreateListingHref(user: HeaderUser | null): string {
  if (!user) {
    return buildLoginUrl("/listings/new");
  }

  switch (user.role) {
    case "SELLER":
    case "ADMIN":
      return "/listings/new";
    case "BUYER":
      // Page guard also redirects; explicit upgrade path avoids register.
      return buildSellerUpgradeUrl("/listings/new");
    default:
      return buildLoginUrl("/listings/new");
  }
}

export function getCurrentPathFromWindow(): string {
  if (typeof window === "undefined") {
    return "/";
  }

  const { pathname, search } = window.location;
  return search ? `${pathname}${search}` : pathname;
}
