import type { ListingVertical } from "@prisma/client";
import { parseListingVerticalParam } from "@/features/verticals/verticals";

/**
 * Static Tailwind class bundles per marketplace vertical (Phase 86).
 * Do not build class names via string templates — Tailwind must see full literals.
 */
export type VerticalTheme = {
  /** Combined primary filled button. */
  primaryButton: string;
  primaryBg: string;
  primaryBgHover: string;
  primaryText: string;
  primaryBorder: string;
  softBg: string;
  softText: string;
  softIcon: string;
  ring: string;
  focusRing: string;
  activeChip: string;
  outlineButton: string;
  softLink: string;
  badge: string;
  navActive: string;
  pageWash: string;
  heroCtaSolid: string;
  heroCtaGhost: string;
};

const OPT_THEME: VerticalTheme = {
  primaryButton:
    "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500",
  primaryBg: "bg-blue-600 dark:bg-blue-600",
  primaryBgHover: "hover:bg-blue-700 dark:hover:bg-blue-500",
  primaryText: "text-blue-700 dark:text-blue-300",
  primaryBorder: "border-blue-200 dark:border-blue-800",
  softBg: "bg-blue-50 dark:bg-blue-950/30",
  softText: "text-blue-700 dark:text-blue-300",
  softIcon: "bg-blue-100 text-blue-700 dark:bg-slate-800 dark:text-blue-300",
  ring: "ring-blue-500/30 dark:ring-blue-400/30",
  focusRing: "focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
  activeChip: "bg-blue-600 text-white dark:bg-blue-600 dark:text-white",
  outlineButton:
    "border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40",
  softLink: "text-blue-700 hover:underline dark:text-blue-300",
  badge:
    "border-blue-200/80 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-300",
  navActive:
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:text-white dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:hover:text-white",
  pageWash: "from-blue-50/60 to-slate-50 dark:from-slate-950 dark:to-slate-950",
  heroCtaSolid:
    "bg-white text-blue-700 hover:bg-white/95 dark:bg-white dark:text-blue-700",
  heroCtaGhost:
    "border border-white/40 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25",
};

const MARKET_THEME: VerticalTheme = {
  primaryButton:
    "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500",
  primaryBg: "bg-purple-600 dark:bg-purple-600",
  primaryBgHover: "hover:bg-purple-700 dark:hover:bg-purple-500",
  primaryText: "text-purple-700 dark:text-purple-300",
  primaryBorder: "border-purple-200 dark:border-purple-800",
  softBg: "bg-purple-50 dark:bg-purple-950/30",
  softText: "text-purple-700 dark:text-purple-300",
  softIcon: "bg-purple-100 text-purple-700 dark:bg-slate-800 dark:text-purple-300",
  ring: "ring-purple-500/30 dark:ring-purple-400/30",
  focusRing: "focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400",
  activeChip: "bg-purple-600 text-white dark:bg-purple-600 dark:text-white",
  outlineButton:
    "border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950/40",
  softLink: "text-purple-700 hover:underline dark:text-purple-300",
  badge:
    "border-purple-200/80 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/80 dark:text-purple-300",
  navActive:
    "bg-purple-600 text-white shadow-sm hover:bg-purple-700 hover:text-white dark:bg-purple-600 dark:text-white dark:hover:bg-purple-700 dark:hover:text-white",
  pageWash: "from-purple-50/60 to-slate-50 dark:from-slate-950 dark:to-slate-950",
  heroCtaSolid:
    "bg-white text-purple-700 hover:bg-white/95 dark:bg-white dark:text-purple-700",
  heroCtaGhost:
    "border border-white/40 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25",
};

const SERVICES_THEME: VerticalTheme = {
  primaryButton:
    "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500",
  primaryBg: "bg-green-600 dark:bg-green-600",
  primaryBgHover: "hover:bg-green-700 dark:hover:bg-green-500",
  primaryText: "text-green-700 dark:text-green-300",
  primaryBorder: "border-green-200 dark:border-green-800",
  softBg: "bg-green-50 dark:bg-green-950/30",
  softText: "text-green-700 dark:text-green-300",
  softIcon: "bg-green-100 text-green-700 dark:bg-slate-800 dark:text-green-300",
  ring: "ring-green-500/30 dark:ring-green-400/30",
  focusRing: "focus-visible:ring-green-500 dark:focus-visible:ring-green-400",
  activeChip: "bg-green-600 text-white dark:bg-green-600 dark:text-white",
  outlineButton:
    "border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-950/40",
  softLink: "text-green-700 hover:underline dark:text-green-300",
  badge:
    "border-green-200/80 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/80 dark:text-green-300",
  navActive:
    "bg-green-600 text-white shadow-sm hover:bg-green-700 hover:text-white dark:bg-green-600 dark:text-white dark:hover:bg-green-700 dark:hover:text-white",
  pageWash: "from-green-50/60 to-slate-50 dark:from-slate-950 dark:to-slate-950",
  heroCtaSolid:
    "bg-white text-green-700 hover:bg-white/95 dark:bg-white dark:text-green-700",
  heroCtaGhost:
    "border border-white/40 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25",
};

const CARGO_THEME: VerticalTheme = {
  primaryButton:
    "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600",
  primaryBg: "bg-orange-500 dark:bg-orange-500",
  primaryBgHover: "hover:bg-orange-600 dark:hover:bg-orange-600",
  primaryText: "text-orange-700 dark:text-orange-300",
  primaryBorder: "border-orange-200 dark:border-orange-800",
  softBg: "bg-orange-50 dark:bg-orange-950/30",
  softText: "text-orange-700 dark:text-orange-300",
  softIcon: "bg-orange-100 text-orange-700 dark:bg-slate-800 dark:text-orange-300",
  ring: "ring-orange-500/30 dark:ring-orange-400/30",
  focusRing: "focus-visible:ring-orange-500 dark:focus-visible:ring-orange-400",
  activeChip: "bg-orange-500 text-white dark:bg-orange-500 dark:text-white",
  outlineButton:
    "border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-300 dark:hover:bg-orange-950/40",
  softLink: "text-orange-700 hover:underline dark:text-orange-300",
  badge:
    "border-orange-200/80 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/80 dark:text-orange-300",
  navActive:
    "bg-orange-500 text-white shadow-sm hover:bg-orange-600 hover:text-white dark:bg-orange-500 dark:text-white dark:hover:bg-orange-600 dark:hover:text-white",
  pageWash: "from-orange-50/40 to-slate-50 dark:from-slate-950 dark:to-slate-950",
  heroCtaSolid:
    "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600",
  heroCtaGhost:
    "border border-white/40 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25",
};

const THEMES: Record<ListingVertical, VerticalTheme> = {
  OPT: OPT_THEME,
  MARKET: MARKET_THEME,
  SERVICES: SERVICES_THEME,
  CARGO: CARGO_THEME,
};

/** Theme for a vertical; null/undefined → default OPT (blue). */
export function getVerticalTheme(
  vertical: ListingVertical | null | undefined,
): VerticalTheme {
  if (!vertical) {
    return OPT_THEME;
  }
  return THEMES[vertical];
}

type SearchParamsLike = URLSearchParams | { get(name: string): string | null };

/**
 * Vertical that drives UI chrome (search button, page CTAs).
 * Returns null on home and catalog without `?vertical=` so default blue applies.
 */
export function resolveThemeVertical(
  pathname: string,
  searchParams?: SearchParamsLike,
): ListingVertical | null {
  const path = pathname.split("?")[0] ?? pathname;

  if (path === "/opt" || path.startsWith("/opt/")) {
    return "OPT";
  }
  if (path === "/market" || path.startsWith("/market/")) {
    return "MARKET";
  }
  if (path === "/services" || path.startsWith("/services/")) {
    return "SERVICES";
  }
  if (path === "/cargo" || path.startsWith("/cargo/")) {
    return "CARGO";
  }

  if (path === "/listings" || path.startsWith("/listings/")) {
    return parseListingVerticalParam(searchParams?.get("vertical") ?? null);
  }

  return null;
}
