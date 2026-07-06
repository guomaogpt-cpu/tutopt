import { NotificationType } from "@prisma/client";
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
}): Promise<void> {
  await prisma.notification.create({
    data: {
      recipient_id: input.recipientId,
      actor_id: input.actorId,
      type: NotificationType.NEW_LEAD,
      title: "Новая заявка",
      message: `Покупатель отправил заявку по объявлению «${input.listingTitle}»`,
      link: "/seller/leads",
    },
  });
}
