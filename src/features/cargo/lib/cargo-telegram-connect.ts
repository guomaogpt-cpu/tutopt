import { randomBytes } from "crypto";
import { prisma } from "@/shared/lib/prisma";
import {
  buildTelegramBotStartLink,
  getTelegramBotUsername,
} from "@/lib/telegram/env";

export const TELEGRAM_CONNECT_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export type CargoTelegramConnectLinkResult = {
  url: string;
  expiresAt: string;
};

export type CompleteTelegramConnectResult =
  | { status: "connected"; chatId: string }
  | { status: "invalid_token" }
  | { status: "expired_token" };

function generateConnectToken(): string {
  // Telegram start payload: up to 64 chars, A-Z a-z 0-9 _ -
  return randomBytes(24).toString("base64url");
}

/**
 * Creates/refreshes a one-time start token and returns a t.me deep link.
 */
export async function createCargoTelegramConnectLink(input: {
  sellerProfileId: string;
  userId: string;
}): Promise<CargoTelegramConnectLinkResult> {
  if (!getTelegramBotUsername()) {
    throw new Error("TELEGRAM_BOT_USERNAME_MISSING");
  }

  const token = generateConnectToken();
  const expiresAt = new Date(Date.now() + TELEGRAM_CONNECT_TOKEN_TTL_MS);

  await prisma.cargoSubscription.upsert({
    where: { seller_profile_id: input.sellerProfileId },
    create: {
      seller_profile_id: input.sellerProfileId,
      user_id: input.userId,
      enabled: true,
      notify_in_app: true,
      notify_telegram: false,
      telegram_connect_token: token,
      telegram_connect_token_expires_at: expiresAt,
    },
    update: {
      user_id: input.userId,
      telegram_connect_token: token,
      telegram_connect_token_expires_at: expiresAt,
    },
    select: { id: true },
  });

  const url = buildTelegramBotStartLink(token);
  if (!url) {
    throw new Error("TELEGRAM_BOT_USERNAME_MISSING");
  }

  return {
    url,
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Links Telegram chat to the subscription that owns this start token.
 */
export async function completeCargoTelegramConnect(input: {
  token: string;
  chatId: string;
  username: string | null;
}): Promise<CompleteTelegramConnectResult> {
  const token = input.token.trim();
  if (!token || token.length > 64) {
    return { status: "invalid_token" };
  }

  const chatId = input.chatId.trim();
  if (!chatId || !/^-?\d{5,64}$/.test(chatId)) {
    return { status: "invalid_token" };
  }

  const row = await prisma.cargoSubscription.findUnique({
    where: { telegram_connect_token: token },
    select: {
      id: true,
      telegram_connect_token_expires_at: true,
    },
  });

  if (!row) {
    return { status: "invalid_token" };
  }

  if (
    !row.telegram_connect_token_expires_at ||
    row.telegram_connect_token_expires_at.getTime() < Date.now()
  ) {
    await prisma.cargoSubscription.update({
      where: { id: row.id },
      data: {
        telegram_connect_token: null,
        telegram_connect_token_expires_at: null,
      },
    });
    return { status: "expired_token" };
  }

  const username = input.username?.trim().replace(/^@+/, "") || null;

  // Avoid one chat delivering to multiple sellers
  await prisma.cargoSubscription.updateMany({
    where: {
      telegram_chat_id: chatId,
      NOT: { id: row.id },
    },
    data: {
      notify_telegram: false,
      telegram_chat_id: null,
      telegram_username: null,
      telegram_connected_at: null,
    },
  });

  await prisma.cargoSubscription.update({
    where: { id: row.id },
    data: {
      telegram_chat_id: chatId,
      telegram_username: username,
      telegram_connected_at: new Date(),
      notify_telegram: true,
      telegram_connect_token: null,
      telegram_connect_token_expires_at: null,
    },
  });

  return { status: "connected", chatId };
}

/**
 * Disables Telegram notifications; keeps chatId for quick re-enable.
 */
export async function disconnectCargoTelegram(input: {
  sellerProfileId: string;
  userId: string;
}): Promise<{ notifyTelegram: boolean; telegramChatId: string | null }> {
  const existing = await prisma.cargoSubscription.findUnique({
    where: { seller_profile_id: input.sellerProfileId },
    select: {
      telegram_chat_id: true,
    },
  });

  if (!existing) {
    await prisma.cargoSubscription.create({
      data: {
        seller_profile_id: input.sellerProfileId,
        user_id: input.userId,
        enabled: true,
        notify_telegram: false,
        telegram_connect_token: null,
        telegram_connect_token_expires_at: null,
      },
    });
    return { notifyTelegram: false, telegramChatId: null };
  }

  const row = await prisma.cargoSubscription.update({
    where: { seller_profile_id: input.sellerProfileId },
    data: {
      user_id: input.userId,
      notify_telegram: false,
      telegram_connect_token: null,
      telegram_connect_token_expires_at: null,
    },
    select: {
      notify_telegram: true,
      telegram_chat_id: true,
    },
  });

  return {
    notifyTelegram: row.notify_telegram,
    telegramChatId: row.telegram_chat_id,
  };
}

export function parseTelegramStartToken(text: string): string | null {
  const trimmed = text.trim();
  const match = /^\/start(?:@\w+)?(?:\s+(.+))?$/i.exec(trimmed);
  if (!match) {
    return null;
  }
  const payload = match[1]?.trim();
  if (!payload) {
    return null;
  }
  return payload.slice(0, 64);
}
