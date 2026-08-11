"use client";

import { useEffect } from "react";
import { fetchUnreadNotificationCount } from "@/features/notifications/lib/notifications-client";
import {
  applyPolledUnreadNotificationCount,
  getUnreadMutationGeneration,
  setUnreadNotificationCount,
} from "@/features/notifications/lib/notifications-unread-store";

const POLL_INTERVAL_ACTIVE_MS = 30_000;
const POLL_INTERVAL_HIDDEN_MS = 120_000;

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
    let intervalId = 0;

    async function loadUnreadCount() {
      if (document.hidden) {
        return;
      }

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

    function schedulePolling() {
      window.clearInterval(intervalId);
      const intervalMs = document.hidden ? POLL_INTERVAL_HIDDEN_MS : POLL_INTERVAL_ACTIVE_MS;
      intervalId = window.setInterval(() => {
        void loadUnreadCount();
      }, intervalMs);
    }

    function handleVisibilityChange() {
      if (!document.hidden) {
        void loadUnreadCount();
      }
      schedulePolling();
    }

    void loadUnreadCount();
    schedulePolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
