"use client";

import { useSyncExternalStore } from "react";
import {
  getUnreadNotificationCountSnapshot,
  subscribeUnreadNotificationCount,
} from "@/features/notifications/lib/notifications-unread-store";

export function useUnreadNotificationCount(): number {
  return useSyncExternalStore(
    subscribeUnreadNotificationCount,
    getUnreadNotificationCountSnapshot,
    () => 0,
  );
}
