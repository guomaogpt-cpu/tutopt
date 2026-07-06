import { requireAuth } from "@/features/auth/lib/session";
import { getUnreadNotificationCount } from "@/features/notifications/lib/notifications-data";
import { jsonDataNoStore, withApiHandler } from "@/shared/lib/api-route";

export const dynamic = "force-dynamic";

export async function GET() {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const count = await getUnreadNotificationCount(user.id);

    return jsonDataNoStore({ count });
  });
}
