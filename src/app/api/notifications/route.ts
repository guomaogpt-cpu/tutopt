import { requireAuth } from "@/features/auth/lib/session";
import { getUserNotifications } from "@/features/notifications/lib/notifications-data";
import { jsonDataNoStore, withApiHandler } from "@/shared/lib/api-route";

export const dynamic = "force-dynamic";

export async function GET() {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const notifications = await getUserNotifications(user.id);

    return jsonDataNoStore({ notifications });
  });
}
