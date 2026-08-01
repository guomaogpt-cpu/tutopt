import { UserRole } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "@/features/auth/lib/session";
import { getCargoSubscriptionForSeller } from "@/features/cargo/lib/cargo-subscription-data";
import { buildCargoTelegramTestText } from "@/lib/telegram/cargo-telegram-notify";
import {
  isTelegramBotConfigured,
  sendTelegramMessage,
} from "@/lib/telegram/sendTelegramMessage";
import { assertRateLimit } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

const telegramTestSchema = z.object({
  chatId: z
    .string()
    .trim()
    .max(64)
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    })
    .refine((value) => value == null || /^-?\d{5,64}$/.test(value), {
      message: "CARGO_TELEGRAM_CHAT_ID_INVALID",
    }),
});

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await requireAuth();

    if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Only sellers can test cargo Telegram notifications");
    }

    assertRateLimit(
      `cargo:telegram-test:${user.id}`,
      10,
      60 * 60 * 1000,
      "Слишком много тестовых сообщений. Попробуйте позже.",
    );

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { user_id: user.id },
      select: { id: true },
    });

    if (!sellerProfile) {
      throw new ForbiddenError("Seller profile required");
    }

    const input = await parseJsonBody(request, telegramTestSchema);
    const settings = await getCargoSubscriptionForSeller(sellerProfile.id);
    const chatId = input.chatId ?? settings?.telegramChatId ?? null;

    if (!chatId) {
      throw new ValidationError("CARGO_TELEGRAM_CHAT_ID_REQUIRED");
    }

    if (!isTelegramBotConfigured()) {
      return jsonData({
        result: {
          status: "skipped" as const,
          reason: "missing_token" as const,
        },
      });
    }

    const result = await sendTelegramMessage({
      chatId,
      text: buildCargoTelegramTestText(),
    });

    return jsonData({ result });
  });
}
