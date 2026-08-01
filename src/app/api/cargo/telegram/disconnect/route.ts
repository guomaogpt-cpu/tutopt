import { UserRole } from "@prisma/client";
import { requireAuth } from "@/features/auth/lib/session";
import { disconnectCargoTelegram } from "@/features/cargo/lib/cargo-telegram-connect";
import { assertRateLimit } from "@/lib/security/rate-limit";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

export async function POST() {
  return withApiHandler(async () => {
    const user = await requireAuth();

    if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Only sellers can disconnect Telegram");
    }

    assertRateLimit(
      `cargo:telegram-disconnect:${user.id}`,
      20,
      60 * 60 * 1000,
      "Слишком много запросов. Попробуйте позже.",
    );

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { user_id: user.id },
      select: { id: true },
    });

    if (!sellerProfile) {
      throw new ForbiddenError("Seller profile required");
    }

    const result = await disconnectCargoTelegram({
      sellerProfileId: sellerProfile.id,
      userId: user.id,
    });

    return jsonData({
      subscription: {
        notifyTelegram: result.notifyTelegram,
        telegramChatId: result.telegramChatId,
      },
    });
  });
}
