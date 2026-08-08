import type { NotificationType } from "@prisma/client";
import { disablePushTokensByValue } from "@/features/push/lib/push-token-data";
import { sanitizePushPath } from "@/lib/push/push-path";
import { sendPushToUser } from "@/lib/push/send-push-notification";
import { logger } from "@/shared/lib/logger";

export type DispatchUserPushInput = {
  userId: string;
  title: string;
  body: string;
  url: string;
  notificationId?: string;
  type?: NotificationType | string;
};

/** Sends native push after in-app notification; never throws to callers. */
export async function dispatchUserPush(input: DispatchUserPushInput): Promise<void> {
  try {
    const result = await sendPushToUser(input.userId, {
      title: input.title,
      body: input.body,
      url: sanitizePushPath(input.url),
      notificationId: input.notificationId,
      type: input.type,
    });

    if (result.invalidTokens.length > 0) {
      await disablePushTokensByValue(result.invalidTokens);
    }
  } catch (error) {
    logger.warn("Push dispatch failed", {
      userId: input.userId,
      message: error instanceof Error ? error.message : "unknown",
    });
  }
}
