import type { ListingVertical } from "@prisma/client";

export type AnalyticsEventName =
  | "vertical_click"
  | "search_submit"
  | "listing_view"
  | "favorite_add"
  | "favorite_remove"
  | "create_listing_start"
  | "create_listing_submit"
  | "lead_submit"
  | "seller_onboarding_start"
  | "seller_onboarding_complete"
  | "moderation_approve"
  | "moderation_reject"
  | "report_submit"
  | "saved_search_create"
  | "saved_search_remove"
  | "saved_search_open"
  | "recently_viewed_open"
  | "recently_viewed_remove"
  | "recently_viewed_clear";

export type AnalyticsVerticalSource =
  | "homepage"
  | "header"
  | "vertical_page"
  | "catalog"
  | "listing_detail";

export type AnalyticsEventParams = {
  vertical?: ListingVertical;
  source?: AnalyticsVerticalSource;
  listing_id?: string;
  category_slug?: string;
  result_count?: number;
  role?: string;
  search_query?: string;
  search_length?: number;
  has_query?: boolean;
  has_category?: boolean;
  has_price?: boolean;
  is_active?: boolean;
  target_type?: "listing" | "seller";
  reason?: string;
};

const SEARCH_QUERY_MAX_LENGTH = 80;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getMetrikaCounterId(): number | null {
  const raw = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim();
  if (!raw) {
    return null;
  }

  const counterId = Number(raw);
  return Number.isFinite(counterId) ? counterId : null;
}

function sanitizeParams(params?: AnalyticsEventParams): AnalyticsEventParams | undefined {
  if (!params) {
    return undefined;
  }

  const sanitized: AnalyticsEventParams = { ...params };

  if (typeof sanitized.search_query === "string") {
    sanitized.search_query = sanitized.search_query.trim().slice(0, SEARCH_QUERY_MAX_LENGTH);
    sanitized.search_length = sanitized.search_query.length;
    sanitized.has_query = sanitized.search_query.length > 0;
  }

  return sanitized;
}

function sendToGtag(eventName: AnalyticsEventName, params?: AnalyticsEventParams): void {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  } catch {
    // Analytics must never break the app.
  }
}

function sendToMetrika(eventName: AnalyticsEventName, params?: AnalyticsEventParams): void {
  try {
    const counterId = getMetrikaCounterId();
    if (counterId !== null && typeof window.ym === "function") {
      window.ym(counterId, "reachGoal", eventName, params ?? {});
    }
  } catch {
    // Analytics must never break the app.
  }
}

export function trackEvent(
  eventName: AnalyticsEventName,
  params?: AnalyticsEventParams,
): void {
  if (!isBrowser()) {
    return;
  }

  const safeParams = sanitizeParams(params);
  sendToGtag(eventName, safeParams);
  sendToMetrika(eventName, safeParams);
}

export function trackVerticalClick(
  vertical: ListingVertical,
  source: AnalyticsVerticalSource,
): void {
  trackEvent("vertical_click", { vertical, source });
}

export function trackSearch(query: string, vertical?: ListingVertical | null): void {
  const trimmed = query.trim();
  if (!trimmed) {
    return;
  }

  trackEvent("search_submit", {
    search_query: trimmed,
    ...(vertical ? { vertical } : {}),
  });
}

export function trackListingView(listingId: string, vertical?: ListingVertical | null): void {
  trackEvent("listing_view", {
    listing_id: listingId,
    ...(vertical ? { vertical } : {}),
  });
}

export function trackFavoriteToggle(
  listingId: string,
  vertical: ListingVertical | null | undefined,
  isActive: boolean,
): void {
  trackEvent(isActive ? "favorite_add" : "favorite_remove", {
    listing_id: listingId,
    is_active: isActive,
    ...(vertical ? { vertical } : {}),
  });
}

export function trackCreateListingStart(vertical: ListingVertical): void {
  trackEvent("create_listing_start", { vertical });
}

export function trackCreateListingSubmit(vertical: ListingVertical): void {
  trackEvent("create_listing_submit", { vertical });
}

export function trackLeadSubmit(vertical: ListingVertical): void {
  trackEvent("lead_submit", { vertical });
}

export function trackSellerOnboardingStart(): void {
  trackEvent("seller_onboarding_start");
}

export function trackSellerOnboardingComplete(): void {
  trackEvent("seller_onboarding_complete");
}

export function trackModerationAction(
  action: "approve" | "reject",
  vertical?: ListingVertical | null,
  listingId?: string,
): void {
  trackEvent(action === "approve" ? "moderation_approve" : "moderation_reject", {
    ...(vertical ? { vertical } : {}),
    ...(listingId ? { listing_id: listingId } : {}),
  });
}

export function trackSavedSearch(
  action: "create" | "remove" | "open",
  params: {
    vertical?: ListingVertical | null;
    hasQuery: boolean;
    hasCategory: boolean;
  },
): void {
  const eventName: AnalyticsEventName =
    action === "create"
      ? "saved_search_create"
      : action === "remove"
        ? "saved_search_remove"
        : "saved_search_open";

  trackEvent(eventName, {
    has_query: params.hasQuery,
    has_category: params.hasCategory,
    ...(params.vertical ? { vertical: params.vertical } : {}),
  });
}

export function trackRecentlyViewed(
  action: "open" | "remove" | "clear",
  params?: {
    vertical?: ListingVertical | null;
    hasPrice?: boolean;
  },
): void {
  const eventName: AnalyticsEventName =
    action === "open"
      ? "recently_viewed_open"
      : action === "remove"
        ? "recently_viewed_remove"
        : "recently_viewed_clear";

  trackEvent(eventName, {
    ...(params?.hasPrice !== undefined ? { has_price: params.hasPrice } : {}),
    ...(params?.vertical ? { vertical: params.vertical } : {}),
  });
}

export function trackReportSubmit(
  targetType: "listing" | "seller",
  reason: string,
  vertical?: ListingVertical | null,
): void {
  trackEvent("report_submit", {
    target_type: targetType,
    reason,
    ...(vertical ? { vertical } : {}),
  });
}
