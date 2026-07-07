import { redirect } from "next/navigation";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getUserNotifications } from "@/features/notifications/lib/notifications-data";
import { Container } from "@/components/ui/container";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/notifications"));
  }

  const notifications = await getUserNotifications(user.id);

  return (
    <main className="bg-background py-6 sm:py-10">
      <Container size="md">
        <PageHeader className="pb-4">
          <PageHeaderContent>
            <PageTitle className="text-2xl sm:text-3xl">Уведомления</PageTitle>
            <PageSubtitle className="text-sm sm:text-base">
              Последние события по вашему аккаунту.
            </PageSubtitle>
          </PageHeaderContent>
        </PageHeader>

        <Section spacing="none" className="mt-4">
          <NotificationsList initialNotifications={notifications} />
        </Section>
      </Container>
    </main>
  );
}
