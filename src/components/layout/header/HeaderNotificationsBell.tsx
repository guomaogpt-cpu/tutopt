"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useUnreadNotificationCount } from "@/features/notifications/lib/use-unread-notification-count";
import { formatNotificationBadgeCount } from "@/features/notifications/lib/notification-display";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeaderNotificationsBell() {
  const unreadCount = useUnreadNotificationCount();
  const badgeLabel = formatNotificationBadgeCount(unreadCount);

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative h-10 w-10 shrink-0 border-[#E5E7EB] dark:border-slate-700"
      asChild
    >
      <Link
        href="/notifications"
        aria-label={
          badgeLabel ? `Уведомления: ${badgeLabel} непрочитанных` : "Уведомления"
        }
        title="Уведомления"
      >
        <Bell className="size-4" aria-hidden="true" />
        {badgeLabel ? (
          <span
            className={cn(
              "absolute -right-1 -top-1 flex min-w-[1.125rem] items-center justify-center rounded-full",
              "bg-[#2563EB] px-1 py-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-white",
              "dark:ring-slate-950",
            )}
          >
            {badgeLabel}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
