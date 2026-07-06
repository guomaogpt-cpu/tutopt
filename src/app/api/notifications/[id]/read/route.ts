import { z } from "zod";
import { requireAuth } from "@/features/auth/lib/session";
import { markNotificationRead } from "@/features/notifications/lib/notifications-data";
import { jsonDataNoStore, withApiHandler } from "@/shared/lib/api-route";
import { NotFoundError } from "@/shared/lib/errors";

const notificationIdSchema = z.string().uuid();

type NotificationReadRouteContext = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function PATCH(_request: Request, context: NotificationReadRouteContext) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const { id } = await context.params;
    const parsedId = notificationIdSchema.safeParse(id);

    if (!parsedId.success) {
      throw new NotFoundError("Notification not found");
    }

    const notification = await markNotificationRead(user.id, parsedId.data);

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    return jsonDataNoStore({ notification });
  });
}
