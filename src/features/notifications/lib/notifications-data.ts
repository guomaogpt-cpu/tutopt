import { NotificationType, type ListingVertical } from "@prisma/client";
import { getLeadFormConfig } from "@/features/leads/lib/lead-form-config";
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

  await prisma.notification.create({
    data: {
      recipient_id: input.recipientId,
      actor_id: input.actorId,
      type: NotificationType.NEW_LEAD,
      title: config.notificationTitle,
      message: config.notificationMessage(input.listingTitle),
      link: "/seller/leads",
    },
  });
}

export async function createNewCargoRequestNotifications(input: {
  actorId: string | null;
  itemName: string;
  fromLocation: string;
  toLocation: string;
}): Promise<void> {
  const recipientIds = new Set<string>();

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", is_blocked: false },
    select: { id: true },
  });

  for (const admin of admins) {
    recipientIds.add(admin.id);
  }

  const cargoSellers = await prisma.user.findMany({
    where: {
      role: "SELLER",
      is_blocked: false,
      sellerProfile: {
        listings: {
          some: {
            vertical: "CARGO",
            status: "PUBLISHED",
          },
        },
      },
    },
    select: { id: true },
  });

  for (const seller of cargoSellers) {
    recipientIds.add(seller.id);
  }

  if (input.actorId) {
    recipientIds.delete(input.actorId);
  }

  if (recipientIds.size === 0) {
    return;
  }

  const title = "Новая карго-заявка";
  const message = `${input.itemName}: ${input.fromLocation} → ${input.toLocation}`;
  const link = "/seller/cargo-requests";

  await prisma.notification.createMany({
    data: [...recipientIds].map((recipientId) => ({
      recipient_id: recipientId,
      actor_id: input.actorId,
      type: NotificationType.NEW_CARGO_REQUEST,
      title,
      message,
      link,
    })),
  });
}

export async function createNewCargoResponseNotifications(input: {
  actorId: string;
  requestOwnerId: string | null;
  itemName: string;
  companyName: string;
}): Promise<void> {
  const recipientIds = new Set<string>();

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN", is_blocked: false },
    select: { id: true },
  });

  for (const admin of admins) {
    recipientIds.add(admin.id);
  }

  if (input.requestOwnerId) {
    recipientIds.add(input.requestOwnerId);
  }

  recipientIds.delete(input.actorId);

  if (recipientIds.size === 0) {
    return;
  }

  const title = "Новый отклик на карго-заявку";
  const message = `${input.companyName} откликнулась на «${input.itemName}»`;

  await prisma.notification.createMany({
    data: [...recipientIds].map((recipientId) => {
      const isOwner = recipientId === input.requestOwnerId;
      return {
        recipient_id: recipientId,
        actor_id: input.actorId,
        type: NotificationType.NEW_CARGO_RESPONSE,
        title,
        message,
        link: isOwner ? "/buyer/cargo-requests" : "/admin/cargo-requests",
      };
    }),
  });
}
