import { requireAuth } from "@/features/auth/lib/session";
import {
  disablePushTokensByValue,
  getEnabledPushTokensForUser,
} from "@/features/push/lib/push-token-data";
import { isPushConfigured, sendPushToTokens } from "@/lib/push/send-push-notification";
import { assertPushTestRateLimit } from "@/lib/security/rate-limit";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";

const TEST_PUSH_TITLE = "ВсеТут";
const TEST_PUSH_BODY = "Тестовое push-уведомление включено.";
const TEST_PUSH_URL = "/notifications";

export async function POST() {
  return withApiHandler(async () => {
    const user = await requireAuth();
    assertPushTestRateLimit(user.id);

    const tokens = await getEnabledPushTokensForUser(user.id);

    if (tokens.length === 0) {
      return jsonData({
        sent: 0,
        failed: 0,
        skipped: true,
        reason: "no_tokens" as const,
      });
    }

    if (!isPushConfigured()) {
      return jsonData({
        sent: 0,
        failed: 0,
        skipped: true,
        reason: "missing_firebase_config" as const,
      });
    }

    const result = await sendPushToTokens(
      tokens.map((entry) => entry.token),
      {
        title: TEST_PUSH_TITLE,
        body: TEST_PUSH_BODY,
        url: TEST_PUSH_URL,
        type: "TEST",
      },
    );

    if (result.invalidTokens.length > 0) {
      await disablePushTokensByValue(result.invalidTokens);
    }

    return jsonData({
      sent: result.sent,
      failed: result.failed,
      skipped: false,
    });
  });
}
