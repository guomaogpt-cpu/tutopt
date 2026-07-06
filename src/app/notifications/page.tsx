import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getUserNotifications } from "@/features/notifications/lib/notifications-data";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/notifications"));
  }

  const notifications = await getUserNotifications(user.id);

  return (
    <main className="bg-white py-6 sm:py-10">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Уведомления
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Последние события по вашему аккаунту.
            </p>
          </div>

          <NotificationsList initialNotifications={notifications} />
        </div>
      </Container>
    </main>
  );
}
