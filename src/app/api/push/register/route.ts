import { requireAuth } from "@/features/auth/lib/session";
import { upsertPushToken } from "@/features/push/lib/push-token-data";
import { pushRegisterSchema } from "@/features/push/validators/push.validators";
import { assertPushRegisterRateLimit } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    assertPushRegisterRateLimit(user.id);

    const input = await parseJsonBody(request, pushRegisterSchema);

    await upsertPushToken({
      userId: user.id,
      token: input.token,
      platform: input.platform,
      deviceId: input.deviceId,
      appVersion: input.appVersion,
    });

    return jsonData({ ok: true });
  });
}
