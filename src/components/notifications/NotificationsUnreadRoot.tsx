import { getCurrentUser } from "@/features/auth/lib/session";
import { getUnreadNotificationCount } from "@/features/notifications/lib/notifications-data";
import { NotificationsUnreadSync } from "@/components/notifications/NotificationsUnreadSync";

export async function NotificationsUnreadRoot() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const initialCount = await getUnreadNotificationCount(user.id);

  return <NotificationsUnreadSync initialCount={initialCount} />;
}
