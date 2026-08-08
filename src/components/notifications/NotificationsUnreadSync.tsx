"use client";

import { useEffect } from "react";
import { fetchUnreadNotificationCount } from "@/features/notifications/lib/notifications-client";
import {
  applyPolledUnreadNotificationCount,
  getUnreadMutationGeneration,
  setUnreadNotificationCount,
} from "@/features/notifications/lib/notifications-unread-store";

const POLL_INTERVAL_MS = 30_000;

type NotificationsUnreadSyncProps = {
  initialCount?: number;
};

/** Hydrates unread store from SSR and keeps count fresh via gentle polling. */
export function NotificationsUnreadSync({ initialCount = 0 }: NotificationsUnreadSyncProps) {
  useEffect(() => {
    setUnreadNotificationCount(initialCount);
  }, [initialCount]);

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
        // ignore transient network errors
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

  return null;
}
