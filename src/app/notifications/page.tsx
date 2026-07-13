import { redirect } from "next/navigation";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getUserNotifications } from "@/features/notifications/lib/notifications-data";
import { Container } from "@/components/ui/container";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/notifications"));
  }

  const notifications = await getUserNotifications(user.id);

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container size="md" className="max-w-[1000px] min-w-0">
        <PageHeader className="pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Уведомления</PageTitle>
            <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
              События по вашим объявлениям, заявкам и аккаунту
            </PageSubtitle>
          </PageHeaderContent>
        </PageHeader>

        <div className="mt-6 lg:mt-8">
          <NotificationsList initialNotifications={notifications} userRole={user.role} />
        </div>
      </Container>
    </main>
  );
}
