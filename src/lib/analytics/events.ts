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
  | "recently_viewed_clear"
  | "listing_contact_cta_click"
  | "listing_seller_profile_click"
  | "listing_report_click"
  | "similar_listing_click"
  | "seller_other_listing_click"
  | "seller_profile_view"
  | "seller_listing_click"
  | "seller_vertical_filter_click"
  | "listing_edit_start"
  | "listing_edit_submit";

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
  is_own_listing?: boolean;
  is_active?: boolean;
  source_vertical?: ListingVertical;
  target_vertical?: ListingVertical;
  same_category?: boolean;
  same_seller?: boolean;
  seller_has_profile?: boolean;
  listing_count_bucket?: string;
  status_before?: string;
  status_after?: string;
  target_type?: "listing" | "seller";
  reason?: string;
};

export function getListingCountBucket(count: number): string {
  if (count <= 0) {
    return "0";
  }
  if (count <= 3) {
    return "1-3";
  }
  if (count <= 10) {
    return "4-10";
  }
  return "11+";
}

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

export function trackListingEditStart(
  vertical: ListingVertical,
  statusBefore: string,
): void {
  trackEvent("listing_edit_start", {
    vertical,
    status_before: statusBefore,
  });
}

export function trackListingEditSubmit(
  vertical: ListingVertical,
  statusBefore: string,
  statusAfter: string,
): void {
  trackEvent("listing_edit_submit", {
    vertical,
    status_before: statusBefore,
    status_after: statusAfter,
  });
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

export function trackListingDetailAction(
  action: "contact_cta" | "seller_profile" | "report",
  params: {
    vertical?: ListingVertical | null;
    hasPrice?: boolean;
    isOwnListing?: boolean;
  },
): void {
  const eventName: AnalyticsEventName =
    action === "contact_cta"
      ? "listing_contact_cta_click"
      : action === "seller_profile"
        ? "listing_seller_profile_click"
        : "listing_report_click";

  trackEvent(eventName, {
    ...(params.vertical ? { vertical: params.vertical } : {}),
    ...(params.hasPrice !== undefined ? { has_price: params.hasPrice } : {}),
    ...(params.isOwnListing !== undefined
      ? { is_own_listing: params.isOwnListing }
      : {}),
  });
}

export function trackSimilarListingClick(params: {
  sourceVertical: ListingVertical;
  targetVertical: ListingVertical;
  sameCategory: boolean;
}): void {
  trackEvent("similar_listing_click", {
    source_vertical: params.sourceVertical,
    target_vertical: params.targetVertical,
    same_category: params.sameCategory,
  });
}

export function trackSellerOtherListingClick(
  sourceVertical: ListingVertical,
  targetVertical: ListingVertical,
): void {
  trackEvent("seller_other_listing_click", {
    source_vertical: sourceVertical,
    target_vertical: targetVertical,
    same_seller: true,
  });
}

export function trackSellerProfileView(params: {
  sellerHasProfile: boolean;
  vertical?: ListingVertical | null;
  listingCountBucket: string;
}): void {
  trackEvent("seller_profile_view", {
    seller_has_profile: params.sellerHasProfile,
    listing_count_bucket: params.listingCountBucket,
    ...(params.vertical ? { vertical: params.vertical } : {}),
  });
}

export function trackSellerListingClick(
  vertical: ListingVertical,
  listingCountBucket: string,
): void {
  trackEvent("seller_listing_click", {
    vertical,
    listing_count_bucket: listingCountBucket,
  });
}

export function trackSellerVerticalFilterClick(vertical: ListingVertical | null): void {
  trackEvent("seller_vertical_filter_click", {
    ...(vertical ? { vertical } : {}),
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
