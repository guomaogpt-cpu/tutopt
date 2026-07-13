"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Bell, BellRing, CalendarDays, Inbox } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type NotificationsListProps = {
  initialNotifications: NotificationItem[];
  userRole: UserRole;
};

type NotificationFilter = "all" | "unread" | "leads";

const FILTER_CONFIG: Array<{ value: NotificationFilter; label: string }> = [
  { value: "all", label: "Все" },
  { value: "unread", label: "Непрочитанные" },
  { value: "leads", label: "Заявки" },
];

function formatNotificationDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
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

function filterNotifications(
  notifications: NotificationItem[],
  filter: NotificationFilter,
): NotificationItem[] {
  switch (filter) {
    case "unread":
      return notifications.filter((notification) => !notification.read_at);
    case "leads":
      return notifications.filter((notification) => notification.type === NotificationTypeEnum.NEW_LEAD);
    default:
      return notifications;
  }
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationTypeEnum.NEW_LEAD:
      return Inbox;
    default:
      return BellRing;
  }
}

function getEmptyStateAction(role: UserRole): { href: string; label: string } {
  if (role === UserRoleEnum.SELLER || role === UserRoleEnum.ADMIN) {
    return { href: "/seller/dashboard", label: "Перейти в кабинет продавца" };
  }

  if (role === UserRoleEnum.BUYER) {
    return { href: "/listings", label: "Перейти в каталог" };
  }

  return { href: "/", label: "Перейти на главную" };
}

export function NotificationsList({ initialNotifications, userRole }: NotificationsListProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read_at).length,
    [notifications],
  );

  const todayCount = useMemo(
    () => notifications.filter((notification) => isWithinLast24Hours(notification.created_at)).length,
    [notifications],
  );

  const filterCounts = useMemo(
    () => ({
      all: notifications.length,
      unread: unreadCount,
      leads: notifications.filter((notification) => notification.type === NotificationTypeEnum.NEW_LEAD)
        .length,
    }),
    [notifications, unreadCount],
  );

  const summaryStats = [
    {
      label: "Все уведомления",
      value: notifications.length,
      icon: Bell,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
    {
      label: "Непрочитанные",
      value: unreadCount,
      icon: BellRing,
      iconClassName: "bg-[#FFFBEB] text-[#D97706]",
    },
    {
      label: "За 24 часа",
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
    } catch {
      setNotifications(previousNotifications);
      const previousUnreadCount = previousNotifications.filter(
        (notification) => !notification.read_at,
      ).length;
      setUnreadNotificationCount(previousUnreadCount);
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

      if (notification.link) {
        router.push(notification.link);
      }
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
      <div className="rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white px-6 py-12 text-center shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
          <Bell className="size-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-base font-semibold text-[#0F172A] sm:text-lg">
          Уведомлений пока нет
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
          Здесь будут появляться заявки, статусы модерации и важные события.
        </p>
        <Button asChild className="mt-6 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]">
          <Link href={emptyAction.href}>{emptyAction.label}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <NotificationsSummaryCards stats={summaryStats} />
      </div>

      {unreadCount > 0 ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleMarkAllRead()}
            disabled={isMarkingAll}
            className="h-11 w-full rounded-xl border-[rgba(148,163,184,0.25)] sm:w-auto"
          >
            {isMarkingAll ? "Обновление..." : "Отметить всё прочитанным"}
          </Button>
        </div>
      ) : null}

      <Tabs
        value={activeFilter}
        onValueChange={(value) => setActiveFilter(value as NotificationFilter)}
      >
        <TabsList
          className={cn(
            "h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-1",
            "scrollbar-none",
          )}
        >
          {FILTER_CONFIG.map((filter) => (
            <TabsTrigger
              key={filter.value}
              value={filter.value}
              className="shrink-0 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-[#EFF6FF] data-[state=active]:text-[#2563EB] sm:text-sm"
            >
              {filter.label}
              <span className="ml-1.5 text-[#94A3B8]">({filterCounts[filter.value]})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {FILTER_CONFIG.map((filter) => {
          const filteredNotifications = filterNotifications(notifications, filter.value);

          return (
            <TabsContent key={filter.value} value={filter.value} className="mt-4">
              {filteredNotifications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-10 text-center">
                  <p className="text-sm text-[#64748B]">В этой категории уведомлений нет.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {filteredNotifications.map((notification) => {
                    const isUnread = !notification.read_at;
                    const Icon = getNotificationIcon(notification.type);
                    const hasLink = Boolean(notification.link);

                    return (
                      <li key={notification.id}>
                        <button
                          type="button"
                          onClick={() => void handleNotificationClick(notification)}
                          disabled={pendingId === notification.id}
                          className={cn(
                            "w-full rounded-[18px] border text-left transition disabled:opacity-60",
                            hasLink && "cursor-pointer hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
                            isUnread
                              ? "border-[rgba(37,99,235,0.18)] bg-[#EFF6FF] shadow-[0_4px_16px_rgba(37,99,235,0.06)]"
                              : "border-[rgba(148,163,184,0.18)] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)] hover:border-[rgba(148,163,184,0.28)]",
                          )}
                        >
                          <div className="flex gap-3 p-4 sm:gap-4 sm:p-4">
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
                                  ? "bg-white text-[#2563EB]"
                                  : "bg-[#F8FAFC] text-[#64748B]",
                              )}
                            >
                              <Icon className="size-5" aria-hidden="true" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <p className="font-semibold text-[#0F172A]">{notification.title}</p>
                                {isUnread ? (
                                  <span className="inline-flex shrink-0 items-center rounded-full bg-[#2563EB] px-2.5 py-0.5 text-xs font-medium text-white">
                                    Новое
                                  </span>
                                ) : null}
                              </div>

                              <p className="mt-1 text-sm leading-relaxed text-[#64748B]">
                                {notification.message}
                              </p>

                              {notification.actor ? (
                                <p className="mt-2 text-xs text-[#94A3B8]">
                                  От: {notification.actor.name}
                                </p>
                              ) : null}

                              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs text-[#94A3B8]">
                                  {formatNotificationDateTime(notification.created_at)}
                                </p>
                                {hasLink ? (
                                  <span className="text-xs font-medium text-[#2563EB]">
                                    Открыть →
                                  </span>
                                ) : null}
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
