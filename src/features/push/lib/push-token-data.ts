import type { PushPlatform, Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";

export type UpsertPushTokenInput = {
  userId: string;
  token: string;
  platform: PushPlatform;
  deviceId?: string | null;
  appVersion?: string | null;
};

export async function upsertPushToken(input: UpsertPushTokenInput) {
  const now = new Date();

  return prisma.pushToken.upsert({
    where: { token: input.token },
    create: {
      user_id: input.userId,
      token: input.token,
      platform: input.platform,
      device_id: input.deviceId ?? null,
      app_version: input.appVersion ?? null,
      enabled: true,
      last_seen_at: now,
    },
    update: {
      user_id: input.userId,
      platform: input.platform,
      device_id: input.deviceId ?? null,
      app_version: input.appVersion ?? null,
      enabled: true,
      last_seen_at: now,
    },
  });
}

export async function disablePushToken(userId: string, token?: string | null): Promise<number> {
  const where: Prisma.PushTokenWhereInput = { user_id: userId, enabled: true };

  if (token) {
    where.token = token;
  }

  const result = await prisma.pushToken.updateMany({
    where,
    data: { enabled: false },
  });

  return result.count;
}

export async function getEnabledPushTokensForUser(userId: string) {
  return prisma.pushToken.findMany({
    where: {
      user_id: userId,
      enabled: true,
    },
    select: {
      id: true,
      token: true,
      platform: true,
    },
  });
}

export async function disablePushTokensByValue(tokens: string[]): Promise<number> {
  if (tokens.length === 0) {
    return 0;
  }

  const result = await prisma.pushToken.updateMany({
    where: { token: { in: tokens } },
    data: { enabled: false },
  });

  return result.count;
}

export async function userHasEnabledPushTokens(userId: string): Promise<boolean> {
  const count = await prisma.pushToken.count({
    where: { user_id: userId, enabled: true },
  });
  return count > 0;
}
