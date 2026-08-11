import { NotificationType } from "@prisma/client";
import type { NotificationItem } from "@/features/notifications/lib/notifications-data";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";

export type NotificationCategory = "all" | "leads" | "listings" | "cargo" | "system";

export const NOTIFICATION_CATEGORY_FILTERS: Array<{
  value: NotificationCategory;
  labelKey: DictionaryKey;
}> = [
  { value: "all", labelKey: "notifications.filterAll" },
  { value: "leads", labelKey: "notifications.filterLeads" },
  { value: "listings", labelKey: "notifications.filterListings" },
  { value: "cargo", labelKey: "notifications.filterCargo" },
  { value: "system", labelKey: "notifications.filterSystem" },
];

export function getNotificationCategory(type: NotificationType): Exclude<NotificationCategory, "all"> {
  switch (type) {
    case NotificationType.NEW_LEAD:
    case NotificationType.LEAD_STATUS_UPDATED:
      return "leads";
    case NotificationType.NEW_CARGO_REQUEST:
    case NotificationType.NEW_CARGO_RESPONSE:
      return "cargo";
    case NotificationType.LISTING_SUBMITTED:
    case NotificationType.LISTING_APPROVED:
    case NotificationType.LISTING_REJECTED:
      return "listings";
    case NotificationType.COMPANY_VERIFIED:
    case NotificationType.COMPANY_VERIFICATION_REJECTED:
      return "system";
    default:
      return "system";
  }
}

export function filterNotificationsByCategory(
  notifications: NotificationItem[],
  category: NotificationCategory,
): NotificationItem[] {
  if (category === "all") {
    return notifications;
  }

  if (category === "listings") {
    return notifications.filter(
      (notification) => getNotificationCategory(notification.type) === "listings",
    );
  }

  return notifications.filter(
    (notification) => getNotificationCategory(notification.type) === category,
  );
}

export function resolveNotificationLink(notification: NotificationItem): string {
  if (notification.link) {
    return notification.link;
  }

  switch (notification.type) {
    case NotificationType.NEW_LEAD:
      return "/account/requests?tab=received";
    case NotificationType.LEAD_STATUS_UPDATED:
      return "/account/requests?tab=sent";
    case NotificationType.NEW_CARGO_REQUEST:
    case NotificationType.NEW_CARGO_RESPONSE:
      return "/account/requests";
    case NotificationType.LISTING_SUBMITTED:
      return "/account/listings";
    case NotificationType.LISTING_APPROVED:
      return notification.link ?? "/account/listings";
    case NotificationType.LISTING_REJECTED:
      return "/account/listings";
    case NotificationType.COMPANY_VERIFIED:
    case NotificationType.COMPANY_VERIFICATION_REJECTED:
      return "/account/company";
    default:
      return "/notifications";
  }
}

export function getNotificationActionLabelKey(type: NotificationType): DictionaryKey {
  switch (type) {
    case NotificationType.NEW_LEAD:
    case NotificationType.LEAD_STATUS_UPDATED:
      return "notifications.actionOpenRequest";
    case NotificationType.NEW_CARGO_REQUEST:
    case NotificationType.NEW_CARGO_RESPONSE:
      return "notifications.actionOpenCargo";
    case NotificationType.LISTING_SUBMITTED:
      return "notifications.actionOpenMyListings";
    case NotificationType.LISTING_APPROVED:
    case NotificationType.LISTING_REJECTED:
      return "notifications.actionOpenListing";
    case NotificationType.COMPANY_VERIFIED:
    case NotificationType.COMPANY_VERIFICATION_REJECTED:
      return "notifications.actionOpenCompany";
    default:
      return "notifications.open";
  }
}

export function formatNotificationBadgeCount(count: number): string | null {
  if (count <= 0) {
    return null;
  }
  return count > 9 ? "9+" : String(count);
}
