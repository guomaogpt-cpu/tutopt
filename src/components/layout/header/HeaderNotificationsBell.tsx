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

const focusRingClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

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
    <Link
      href="/notifications"
      aria-label={unreadCount > 0 ? `Уведомления: ${badgeLabel} непрочитанных` : "Уведомления"}
      title="Уведомления"
      className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 ${focusRingClassName}`}
    >
      <Bell className="h-4 w-4" aria-hidden="true" />
      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
          {badgeLabel}
        </span>
      ) : null}
    </Link>
  );
}
