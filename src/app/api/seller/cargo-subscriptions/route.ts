import { UserRole } from "@prisma/client";
import { requireAuth } from "@/features/auth/lib/session";
import {
  setCargoSubscription,
  upsertCargoSubscriptionSettings,
} from "@/features/cargo/lib/cargo-subscription-data";
import {
  cargoSubscriptionPostSchema,
  isFullCargoSubscriptionPayload,
} from "@/features/cargo/validators/cargo-subscription.validators";
import { assertRateLimit } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await requireAuth();

    if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Only sellers can manage cargo subscriptions");
    }

    assertRateLimit(
      `cargo:subscription:${user.id}`,
      20,
      60 * 60 * 1000,
      "Слишком много изменений подписки. Попробуйте позже.",
    );

    const input = await parseJsonBody(request, cargoSubscriptionPostSchema);

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { user_id: user.id },
      select: { id: true },
    });

    if (!sellerProfile) {
      throw new ForbiddenError("Seller profile required");
    }

    if (isFullCargoSubscriptionPayload(input)) {
      const settings = await upsertCargoSubscriptionSettings({
        sellerProfileId: sellerProfile.id,
        userId: user.id,
        settings: {
          enabled: input.enabled,
          serviceTypes: input.serviceTypes,
          directions: input.directions,
          fromLocations: input.fromLocations,
          toLocations: input.toLocations,
          notifyInApp: input.notifyInApp,
          notifyEmail: input.notifyEmail,
          notifyTelegram: input.notifyTelegram,
          notifyWhatsApp: input.notifyWhatsApp,
        },
      });

      return jsonData({
        subscription: {
          isActive: settings.enabled,
          enabled: settings.enabled,
          serviceTypes: settings.serviceTypes,
          directions: settings.directions,
          fromLocations: settings.fromLocations,
          toLocations: settings.toLocations,
          notifyInApp: settings.notifyInApp,
          notifyEmail: settings.notifyEmail,
          notifyTelegram: settings.notifyTelegram,
          notifyWhatsApp: settings.notifyWhatsApp,
        },
      });
    }

    const subscription = await setCargoSubscription({
      sellerProfileId: sellerProfile.id,
      userId: user.id,
      active: input.active,
    });

    return jsonData({
      subscription: {
        isActive: subscription.isActive,
      },
    });
  });
}
