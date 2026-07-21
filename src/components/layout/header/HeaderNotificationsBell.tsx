"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect } from "react";
import { fetchUnreadNotificationCount } from "@/features/notifications/lib/notifications-client";
import {
  applyPolledUnreadNotificationCount,
  getUnreadMutationGeneration,
} from "@/features/notifications/lib/notifications-unread-store";
import { useUnreadNotificationCount } from "@/features/notifications/lib/use-unread-notification-count";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const POLL_INTERVAL_MS = 30_000;

export function HeaderNotificationsBell() {
  const unreadCount = useUnreadNotificationCount();

  useEffect(() => {
    let isMounted = true;

    async function loadUnreadCount() {
      const pollStartGeneration = getUnreadMutationGeneration();

      try {
        const { count } = await fetchUnreadNotificationCount();
        if (!isMounted) {
          return;
        }

        applyPolledUnreadNotificationCount(count, pollStartGeneration);
      } catch {
        if (!isMounted) {
          return;
        }
      }
    }

    void loadUnreadCount();
    const intervalId = window.setInterval(() => {
      void loadUnreadCount();
    }, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative h-10 w-10 shrink-0 border-[#E5E7EB]"
      asChild
    >
      <Link
        href="/notifications"
        aria-label={unreadCount > 0 ? `Уведомления: ${badgeLabel} непрочитанных` : "Уведомления"}
        title="Уведомления"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unreadCount > 0 ? (
          <Badge
            variant="default"
            className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full p-0 text-[10px]"
          >
            {badgeLabel}
          </Badge>
        ) : null}
      </Link>
    </Button>
  );
}
