import type { NotificationItem } from "@/features/notifications/lib/notifications-data";

type NotificationsListResponse = {
  notifications: NotificationItem[];
};

type UnreadCountResponse = {
  count: number;
};

type MarkReadResponse = {
  notification: NotificationItem;
};

type MarkAllReadResponse = {
  updatedCount: number;
};

type ApiSuccessBody<T> = {
  data: T;
};

type ApiErrorBody = {
  error: {
    message: string;
  };
};

async function parseResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as ApiSuccessBody<T> | ApiErrorBody;

  if (!response.ok) {
    const message =
      "error" in body && body.error.message ? body.error.message : "Request failed";
    throw new Error(message);
  }

  return (body as ApiSuccessBody<T>).data;
}

export async function fetchNotifications(): Promise<NotificationsListResponse> {
  const response = await fetch("/api/notifications", {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  return parseResponse<NotificationsListResponse>(response);
}

export async function fetchUnreadNotificationCount(): Promise<UnreadCountResponse> {
  const response = await fetch("/api/notifications/unread-count", {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  return parseResponse<UnreadCountResponse>(response);
}

export async function markNotificationReadRequest(
  notificationId: string,
): Promise<MarkReadResponse> {
  const response = await fetch(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  return parseResponse<MarkReadResponse>(response);
}

export async function markAllNotificationsReadRequest(): Promise<MarkAllReadResponse> {
  const response = await fetch("/api/notifications/read-all", {
    method: "PATCH",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  return parseResponse<MarkAllReadResponse>(response);
}
