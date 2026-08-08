import { NotificationType, type ListingVertical } from "@prisma/client";
import { findCargoNotificationRecipients } from "@/features/cargo/lib/cargo-subscription-data";
import { getLeadFormConfig } from "@/features/leads/lib/lead-form-config";
import { dispatchUserPush } from "@/lib/push/dispatch-user-push";
import { prisma } from "@/shared/lib/prisma";

export const NOTIFICATIONS_LIMIT = 20;

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  read_at: Date | null;
  created_at: Date;
  actor: {
    name: string;
  } | null;
};

const notificationSelect = {
  id: true,
  type: true,
  title: true,
  message: true,
  link: true,
  read_at: true,
  created_at: true,
  actor: {
    select: {
      name: true,
    },
  },
} as const;

export async function getUserNotifications(userId: string): Promise<NotificationItem[]> {
  return prisma.notification.findMany({
    where: { recipient_id: userId },
    orderBy: { created_at: "desc" },
    take: NOTIFICATIONS_LIMIT,
    select: notificationSelect,
  });
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: {
      recipient_id: userId,
      read_at: null,
    },
  });
}

export async function markNotificationRead(
  userId: string,
  notificationId: string,
): Promise<NotificationItem | null> {
  const existing = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      recipient_id: userId,
    },
    select: { id: true },
  });

  if (!existing) {
    return null;
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { read_at: new Date() },
    select: notificationSelect,
  });
}

export async function markAllNotificationsRead(userId: string): Promise<number> {
  const result = await prisma.notification.updateMany({
    where: {
      recipient_id: userId,
      read_at: null,
    },
    data: {
      read_at: new Date(),
    },
  });

  return result.count;
}

export async function createNewLeadNotification(input: {
  recipientId: string;
  actorId: string;
  listingTitle: string;
  vertical?: ListingVertical;
}): Promise<void> {
  const config = input.vertical
    ? getLeadFormConfig(input.vertical)
    : getLeadFormConfig("OPT");

  const title = config.notificationTitle;
  const message = config.notificationMessage(input.listingTitle);
  const link = "/account/requests";

  const notification = await prisma.notification.create({
    data: {
      recipient_id: input.recipientId,
      actor_id: input.actorId,
      type: NotificationType.NEW_LEAD,
      title,
      message,
      link,
    },
    select: { id: true },
  });

  await dispatchUserPush({
    userId: input.recipientId,
    title,
    body: message,
    url: link,
    notificationId: notification.id,
    type: NotificationType.NEW_LEAD,
  });
}

export async function createNewCargoRequestNotifications(input: {
  actorId: string | null;
  requestId: string;
  itemName: string;
  fromLocation: string;
  toLocation: string;
  serviceType?: string | null;
  direction?: string | null;
}): Promise<void> {
  const recipientLinks = new Map<string, string>();

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", is_blocked: false },
    select: { id: true },
  });

  for (const admin of admins) {
    recipientLinks.set(admin.id, `/cargo/requests/${input.requestId}`);
  }

  const matchedSellerIds = await findCargoNotificationRecipients({
    serviceType: input.serviceType ?? null,
    direction: input.direction ?? null,
    fromLocation: input.fromLocation,
    toLocation: input.toLocation,
  });

  for (const sellerId of matchedSellerIds) {
    if (!recipientLinks.has(sellerId)) {
      recipientLinks.set(sellerId, `/cargo/requests/${input.requestId}`);
    }
  }

  if (input.actorId) {
    recipientLinks.delete(input.actorId);
  }

  if (recipientLinks.size === 0) {
    return;
  }

  const title = `Новая карго-заявка: ${input.itemName}`;
  const message = `${input.fromLocation} → ${input.toLocation}`;

  await prisma.notification.createMany({
    data: [...recipientLinks.entries()].map(([recipientId, link]) => ({
      recipient_id: recipientId,
      actor_id: input.actorId,
      type: NotificationType.NEW_CARGO_REQUEST,
      title,
      message,
      link,
    })),
  });

  await Promise.all(
    [...recipientLinks.entries()].map(([recipientId, link]) =>
      dispatchUserPush({
        userId: recipientId,
        title,
        body: message,
        url: link,
        type: NotificationType.NEW_CARGO_REQUEST,
      }),
    ),
  );
}

export async function createNewCargoResponseNotifications(input: {
  actorId: string;
  requestId: string;
  requestOwnerId: string | null;
  itemName: string;
  companyName: string;
}): Promise<void> {
  const recipientLinks = new Map<string, string>();
  const detailLink = `/cargo/requests/${input.requestId}`;

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", is_blocked: false },
    select: { id: true },
  });

  for (const admin of admins) {
    recipientLinks.set(admin.id, detailLink);
  }

  if (input.requestOwnerId) {
    recipientLinks.set(input.requestOwnerId, detailLink);
  }

  recipientLinks.delete(input.actorId);

  if (recipientLinks.size === 0) {
    return;
  }

  const title = `Новый отклик на карго-заявку: ${input.itemName}`;
  const message = input.companyName;

  await prisma.notification.createMany({
    data: [...recipientLinks.entries()].map(([recipientId, link]) => ({
      recipient_id: recipientId,
      actor_id: input.actorId,
      type: NotificationType.NEW_CARGO_RESPONSE,
      title,
      message,
      link,
    })),
  });

  await Promise.all(
    [...recipientLinks.entries()].map(([recipientId, link]) =>
      dispatchUserPush({
        userId: recipientId,
        title,
        body: message,
        url: link,
        type: NotificationType.NEW_CARGO_RESPONSE,
      }),
    ),
  );
}

export async function createListingModerationNotification(input: {
  recipientId: string;
  actorId: string;
  listingId: string;
  listingTitle: string;
  approved: boolean;
}): Promise<void> {
  const link = `/listings/${input.listingId}`;
  const title = input.approved ? "Объявление опубликовано" : "Объявление отклонено";
  const message = input.approved
    ? `«${input.listingTitle}» прошло модерацию и опубликовано.`
    : `«${input.listingTitle}» не прошло модерацию.`;

  const notification = await prisma.notification.create({
    data: {
      recipient_id: input.recipientId,
      actor_id: input.actorId,
      type: input.approved
        ? NotificationType.LISTING_APPROVED
        : NotificationType.LISTING_REJECTED,
      title,
      message,
      link,
    },
    select: { id: true },
  });

  await dispatchUserPush({
    userId: input.recipientId,
    title,
    body: message,
    url: link,
    notificationId: notification.id,
    type: input.approved
      ? NotificationType.LISTING_APPROVED
      : NotificationType.LISTING_REJECTED,
  });
}
