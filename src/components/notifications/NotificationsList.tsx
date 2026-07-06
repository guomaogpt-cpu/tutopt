"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { NotificationItem } from "@/features/notifications/lib/notifications-data";
import {
  markAllNotificationsReadRequest,
  markNotificationReadRequest,
} from "@/features/notifications/lib/notifications-client";
import {
  decrementUnreadNotificationCount,
  setUnreadNotificationCount,
} from "@/features/notifications/lib/notifications-unread-store";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";

type NotificationsListProps = {
  initialNotifications: NotificationItem[];
};

function markNotificationReadLocally(
  notifications: NotificationItem[],
  notificationId: string,
  readAt: Date,
): NotificationItem[] {
  return notifications.map((notification) =>
    notification.id === notificationId ? { ...notification, read_at: readAt } : notification,
  );
}

export function NotificationsList({ initialNotifications }: NotificationsListProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

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
      const unreadCount = previousNotifications.filter((notification) => !notification.read_at).length;
      setUnreadNotificationCount(unreadCount);
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
        const unreadCount = previousNotifications.filter((item) => !item.read_at).length;
        setUnreadNotificationCount(unreadCount);
      }
    } finally {
      setPendingId(null);
    }
  }

  const hasUnread = notifications.some((notification) => !notification.read_at);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {hasUnread ? "Есть непрочитанные уведомления" : "Все уведомления прочитаны"}
        </p>
        {hasUnread ? (
          <button
            type="button"
            onClick={() => void handleMarkAllRead()}
            disabled={isMarkingAll}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {isMarkingAll ? "Обновление..." : "Отметить все как прочитанные"}
          </button>
        ) : null}
      </div>

      {notifications.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
          <p className="text-base font-medium text-slate-900">Уведомлений пока нет</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Здесь появятся новые заявки и другие события по вашему аккаунту.
          </p>
          <Link
            href="/listings"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {notifications.map((notification) => {
            const isUnread = !notification.read_at;

            return (
              <li key={notification.id}>
                <button
                  type="button"
                  onClick={() => void handleNotificationClick(notification)}
                  disabled={pendingId === notification.id}
                  className={`w-full rounded-2xl border px-5 py-4 text-left transition disabled:opacity-60 ${
                    isUnread
                      ? "border-blue-200 bg-blue-50/60 hover:bg-blue-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{notification.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {notification.message}
                      </p>
                      {notification.actor ? (
                        <p className="mt-2 text-xs text-slate-500">
                          От: {notification.actor.name}
                        </p>
                      ) : null}
                    </div>
                    {isUnread ? (
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                    ) : null}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    {formatListingDate(notification.created_at)}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
