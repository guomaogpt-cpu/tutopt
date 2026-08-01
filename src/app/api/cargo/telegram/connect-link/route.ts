import { UserRole } from "@prisma/client";
import { requireAuth } from "@/features/auth/lib/session";
import { createCargoTelegramConnectLink } from "@/features/cargo/lib/cargo-telegram-connect";
import { assertRateLimit } from "@/lib/security/rate-limit";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

export async function POST() {
  return withApiHandler(async () => {
    const user = await requireAuth();

    if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Only sellers can connect Telegram");
    }

    assertRateLimit(
      `cargo:telegram-connect:${user.id}`,
      20,
      60 * 60 * 1000,
      "Слишком много запросов на подключение Telegram. Попробуйте позже.",
    );

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { user_id: user.id },
      select: { id: true },
    });

    if (!sellerProfile) {
      throw new ForbiddenError("Seller profile required");
    }

    try {
      const link = await createCargoTelegramConnectLink({
        sellerProfileId: sellerProfile.id,
        userId: user.id,
      });

      return jsonData({
        link: {
          url: link.url,
          expiresAt: link.expiresAt,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message === "TELEGRAM_BOT_USERNAME_MISSING") {
        throw new ValidationError("TELEGRAM_BOT_USERNAME_MISSING");
      }
      throw error;
    }
  });
}
