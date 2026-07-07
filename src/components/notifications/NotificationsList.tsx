"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

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

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="У вас пока нет уведомлений"
        description="Здесь появятся новые заявки и другие события по вашему аккаунту."
        action={
          <Button asChild>
            <Link href="/listings">Перейти в каталог</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {hasUnread ? "Есть непрочитанные уведомления" : "Все уведомления прочитаны"}
        </p>
        {hasUnread ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void handleMarkAllRead()}
            disabled={isMarkingAll}
          >
            {isMarkingAll ? "Обновление..." : "Отметить все как прочитанные"}
          </Button>
        ) : null}
      </div>

      <ul className="space-y-3">
        {notifications.map((notification) => {
          const isUnread = !notification.read_at;

          return (
            <li key={notification.id}>
              <button
                type="button"
                onClick={() => void handleNotificationClick(notification)}
                disabled={pendingId === notification.id}
                className="w-full text-left disabled:opacity-60"
              >
                <Card
                  className={cn(
                    "transition hover:shadow-md",
                    isUnread && "border-primary/30 bg-primary/5",
                  )}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-foreground">{notification.title}</p>
                          {isUnread ? <Badge>Новое</Badge> : null}
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {notification.message}
                        </p>
                        {notification.actor ? (
                          <p className="mt-2 text-xs text-muted-foreground">
                            От: {notification.actor.name}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {formatListingDate(notification.created_at)}
                    </p>
                  </CardContent>
                </Card>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
