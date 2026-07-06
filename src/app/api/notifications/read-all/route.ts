import { requireAuth } from "@/features/auth/lib/session";
import { markAllNotificationsRead } from "@/features/notifications/lib/notifications-data";
import { jsonDataNoStore, withApiHandler } from "@/shared/lib/api-route";

export const dynamic = "force-dynamic";

export async function PATCH() {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const updatedCount = await markAllNotificationsRead(user.id);

    return jsonDataNoStore({ updatedCount });
  });
}
