import { ListingStatus, NotificationType, type ListingVertical } from "@prisma/client";
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

  await prisma.notification.create({
    data: {
      recipient_id: input.recipientId,
      actor_id: input.actorId,
      type: NotificationType.NEW_LEAD,
      title,
      message,
      link,
    },
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

export async function createListingSubmittedNotification(input: {
  recipientId: string;
  listingTitle: string;
}): Promise<void> {
  const title = "Объявление отправлено на модерацию";
  const message = `Мы проверим объявление «${input.listingTitle}» и опубликуем его после одобрения.`;
  const link = "/account/listings";

  await prisma.notification.create({
    data: {
      recipient_id: input.recipientId,
      type: NotificationType.LISTING_SUBMITTED,
      title,
      message,
      link,
    },
  });
}

export async function notifyListingSubmittedIfNeeded(input: {
  recipientId: string;
  listingTitle: string;
  previousStatus: ListingStatus;
  nextStatus: ListingStatus;
}): Promise<void> {
  if (
    input.nextStatus !== ListingStatus.PENDING_MODERATION ||
    input.previousStatus === ListingStatus.PENDING_MODERATION
  ) {
    return;
  }

  await createListingSubmittedNotification({
    recipientId: input.recipientId,
    listingTitle: input.listingTitle,
  });
}

export async function createListingModerationNotification(input: {
  recipientId: string;
  actorId: string;
  listingId: string;
  listingTitle: string;
  approved: boolean;
  rejectionReason?: string | null;
}): Promise<void> {
  const link = input.approved ? `/listings/${input.listingId}` : "/account/listings";
  const title = input.approved ? "Объявление опубликовано" : "Объявление отклонено";
  const baseMessage = input.approved
    ? `Ваше объявление «${input.listingTitle}» одобрено и теперь видно пользователям.`
    : `Объявление «${input.listingTitle}» не прошло модерацию. Проверьте описание и фото.`;
  const trimmedReason = input.rejectionReason?.trim();
  const message =
    !input.approved && trimmedReason
      ? `${baseMessage} Причина: ${trimmedReason}`
      : baseMessage;
  const type = input.approved
    ? NotificationType.LISTING_APPROVED
    : NotificationType.LISTING_REJECTED;

  const notification = await prisma.notification.create({
    data: {
      recipient_id: input.recipientId,
      actor_id: input.actorId,
      type,
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
    type,
  });
}
