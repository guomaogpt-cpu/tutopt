"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Bell, BellRing, Building2, CalendarDays, Inbox, Package, Truck } from "lucide-react";
import type { NotificationType, UserRole } from "@prisma/client";
import { NotificationType as NotificationTypeEnum, UserRole as UserRoleEnum } from "@prisma/client";
import { NotificationsSummaryCards } from "@/components/notifications/NotificationsSummaryCards";
import type { NotificationItem } from "@/features/notifications/lib/notifications-data";
import {
  markAllNotificationsReadRequest,
  markNotificationReadRequest,
} from "@/features/notifications/lib/notifications-client";
import {
  decrementUnreadNotificationCount,
  setUnreadNotificationCount,
} from "@/features/notifications/lib/notifications-unread-store";
import {
  filterNotificationsByCategory,
  getNotificationActionLabelKey,
  NOTIFICATION_CATEGORY_FILTERS,
  resolveNotificationLink,
  type NotificationCategory,
} from "@/features/notifications/lib/notification-display";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type NotificationsListProps = {
  initialNotifications: NotificationItem[];
  userRole: UserRole;
  initialUnreadCount?: number;
};

function formatNotificationDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isWithinLast24Hours(date: Date | string): boolean {
  const createdAt = new Date(date).getTime();
  return Date.now() - createdAt < 24 * 60 * 60 * 1000;
}

function markNotificationReadLocally(
  notifications: NotificationItem[],
  notificationId: string,
  readAt: Date,
): NotificationItem[] {
  return notifications.map((notification) =>
    notification.id === notificationId ? { ...notification, read_at: readAt } : notification,
  );
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationTypeEnum.NEW_LEAD:
      return Inbox;
    case NotificationTypeEnum.NEW_CARGO_REQUEST:
    case NotificationTypeEnum.NEW_CARGO_RESPONSE:
      return Truck;
    case NotificationTypeEnum.COMPANY_VERIFIED:
    case NotificationTypeEnum.COMPANY_VERIFICATION_REJECTED:
      return Building2;
    default:
      return Package;
  }
}

function getEmptyStateAction(role: UserRole): { href: string; labelKey: DictionaryKey } {
  if (role === UserRoleEnum.SELLER || role === UserRoleEnum.ADMIN) {
    return { href: "/account", labelKey: "notifications.goToSellerDashboard" };
  }

  if (role === UserRoleEnum.BUYER) {
    return { href: "/listings", labelKey: "catalog.goToCatalog" };
  }

  return { href: "/", labelKey: "notifications.goToHome" };
}

export function NotificationsList({
  initialNotifications,
  userRole,
  initialUnreadCount,
}: NotificationsListProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>("all");
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof initialUnreadCount === "number") {
      setUnreadNotificationCount(initialUnreadCount);
    }
  }, [initialUnreadCount]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read_at).length,
    [notifications],
  );

  const todayCount = useMemo(
    () => notifications.filter((notification) => isWithinLast24Hours(notification.created_at)).length,
    [notifications],
  );

  const filterCounts = useMemo(() => {
    const counts: Record<NotificationCategory, number> = {
      all: notifications.length,
      leads: 0,
      listings: 0,
      cargo: 0,
      system: 0,
    };

    for (const filter of NOTIFICATION_CATEGORY_FILTERS) {
      if (filter.value === "all") {
        continue;
      }
      counts[filter.value] = filterNotificationsByCategory(notifications, filter.value).length;
    }

    return counts;
  }, [notifications]);

  const summaryStats = [
    {
      label: t("notifications.allNotifications"),
      value: notifications.length,
      icon: Bell,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
    {
      label: t("notifications.unread"),
      value: unreadCount,
      icon: BellRing,
      iconClassName: "bg-[#FFFBEB] text-[#D97706]",
    },
    {
      label: t("notifications.last24h"),
      value: todayCount,
      icon: CalendarDays,
      iconClassName: "bg-[#ECFDF5] text-[#059669]",
    },
  ];

  async function handleMarkAllRead() {
    if (isMarkingAll) {
      return;
    }

    const previousNotifications = notifications;
    const readAt = new Date();

    setIsMarkingAll(true);
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read_at: notification.read_at ?? readAt,
      })),
    );
    setUnreadNotificationCount(0);

    try {
      await markAllNotificationsReadRequest();
      toast({
        title: t("notifications.markAllReadSuccess"),
      });
    } catch {
      setNotifications(previousNotifications);
      const previousUnreadCount = previousNotifications.filter(
        (notification) => !notification.read_at,
      ).length;
      setUnreadNotificationCount(previousUnreadCount);
      toast({
        variant: "destructive",
        title: t("notifications.markAllReadError"),
      });
    } finally {
      setIsMarkingAll(false);
    }
  }

  async function handleNotificationClick(notification: NotificationItem) {
    if (pendingId) {
      return;
    }

    const wasUnread = !notification.read_at;
    const previousNotifications = notifications;
    const optimisticReadAt = new Date();
    const targetLink = resolveNotificationLink(notification);

    setPendingId(notification.id);

    if (wasUnread) {
      setNotifications((current) =>
        markNotificationReadLocally(current, notification.id, optimisticReadAt),
      );
      decrementUnreadNotificationCount();
    }

    try {
      if (wasUnread) {
        const { notification: updatedNotification } = await markNotificationReadRequest(
          notification.id,
        );
        setNotifications((current) =>
          markNotificationReadLocally(
            current,
            notification.id,
            updatedNotification.read_at ?? optimisticReadAt,
          ),
        );
      }

      router.push(targetLink);
    } catch {
      if (wasUnread) {
        setNotifications(previousNotifications);
        const previousUnreadCount = previousNotifications.filter((item) => !item.read_at).length;
        setUnreadNotificationCount(previousUnreadCount);
      }
    } finally {
      setPendingId(null);
    }
  }

  const emptyAction = getEmptyStateAction(userRole);

  if (notifications.length === 0) {
    return (
      <div className="rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white px-6 py-12 text-center shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB] dark:bg-slate-800 dark:text-blue-400">
          <Bell className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-base font-semibold text-[#0F172A] dark:text-slate-100 sm:text-lg">
          {t("notifications.emptyTitle")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B] dark:text-slate-400">
          {t("notifications.emptyDescription")}
        </p>
        <Button asChild className="mt-6 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]">
          <Link href={emptyAction.href}>{t(emptyAction.labelKey)}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NotificationsSummaryCards stats={summaryStats} />

      {unreadCount > 0 ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleMarkAllRead()}
            disabled={isMarkingAll}
            className="h-11 w-full rounded-xl border-[rgba(148,163,184,0.25)] sm:w-auto dark:border-slate-700"
          >
            {isMarkingAll ? t("notifications.updating") : t("notifications.markAllRead")}
          </Button>
        </div>
      ) : null}

      <Tabs
        value={activeFilter}
        onValueChange={(value) => setActiveFilter(value as NotificationCategory)}
      >
        <TabsList
          className={cn(
            "h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-1",
            "scrollbar-none dark:border-slate-800 dark:bg-slate-900",
          )}
        >
          {NOTIFICATION_CATEGORY_FILTERS.map((filter) => (
            <TabsTrigger
              key={filter.value}
              value={filter.value}
              className="shrink-0 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-[#EFF6FF] data-[state=active]:text-[#2563EB] sm:text-sm dark:data-[state=active]:bg-blue-950/40 dark:data-[state=active]:text-blue-300"
            >
              {t(filter.labelKey)}
              <span className="ml-1.5 text-[#94A3B8]">({filterCounts[filter.value]})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {NOTIFICATION_CATEGORY_FILTERS.map((filter) => {
          const filteredNotifications = filterNotificationsByCategory(notifications, filter.value);

          return (
            <TabsContent key={filter.value} value={filter.value} className="mt-4">
              {filteredNotifications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm text-[#64748B] dark:text-slate-400">
                    {filter.value === "listings"
                      ? t("notifications.emptyListingsCategory")
                      : t("notifications.emptyCategory")}
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {filteredNotifications.map((notification) => {
                    const isUnread = !notification.read_at;
                    const Icon = getNotificationIcon(notification.type);
                    const actionLabel = t(getNotificationActionLabelKey(notification.type));

                    return (
                      <li key={notification.id}>
                        <button
                          type="button"
                          onClick={() => void handleNotificationClick(notification)}
                          disabled={pendingId === notification.id}
                          className={cn(
                            "w-full rounded-[18px] border text-left transition disabled:opacity-60",
                            "cursor-pointer hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
                            isUnread
                              ? "border-[rgba(37,99,235,0.18)] bg-[#EFF6FF] shadow-[0_4px_16px_rgba(37,99,235,0.06)] dark:border-blue-900/40 dark:bg-blue-950/30"
                              : "border-[rgba(148,163,184,0.18)] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)] hover:border-[rgba(148,163,184,0.28)] dark:border-slate-800 dark:bg-slate-900",
                          )}
                        >
                          <div className="flex gap-3 p-4 sm:gap-4">
                            {isUnread ? (
                              <span
                                className="mt-2 hidden w-1 shrink-0 self-stretch rounded-full bg-[#2563EB] sm:block"
                                aria-hidden="true"
                              />
                            ) : null}

                            <div
                              className={cn(
                                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                                isUnread
                                  ? "bg-white text-[#2563EB] dark:bg-slate-900"
                                  : "bg-[#F8FAFC] text-[#64748B] dark:bg-slate-800 dark:text-slate-400",
                              )}
                            >
                              <Icon className="size-5" aria-hidden="true" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <p className="line-clamp-2 font-semibold text-[#0F172A] dark:text-slate-100">
                                  {notification.title}
                                </p>
                                {isUnread ? (
                                  <span className="inline-flex shrink-0 items-center rounded-full bg-[#2563EB] px-2.5 py-0.5 text-xs font-medium text-white">
                                    {t("notifications.new")}
                                  </span>
                                ) : null}
                              </div>

                              <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-[#64748B] dark:text-slate-400">
                                {notification.message}
                              </p>

                              {notification.actor ? (
                                <p className="mt-2 truncate text-xs text-[#94A3B8]">
                                  {t("notifications.from")} {notification.actor.name}
                                </p>
                              ) : null}

                              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs text-[#94A3B8]">
                                  {formatNotificationDateTime(notification.created_at)}
                                </p>
                                <span className="text-xs font-medium text-[#2563EB] dark:text-blue-400">
                                  {actionLabel}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
