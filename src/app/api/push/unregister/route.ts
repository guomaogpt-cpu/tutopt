import { requireAuth } from "@/features/auth/lib/session";
import { disablePushToken } from "@/features/push/lib/push-token-data";
import { pushUnregisterSchema } from "@/features/push/validators/push.validators";
import { assertPushUnregisterRateLimit } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    assertPushUnregisterRateLimit(user.id);

    const input = await parseJsonBody(request, pushUnregisterSchema);
    const disabled = await disablePushToken(user.id, input.token);

    return jsonData({ ok: true, disabled });
  });
}
