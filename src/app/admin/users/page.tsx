import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Shield, Store, UserCog, Users } from "lucide-react";
import { AdminUsersTable, type AdminUserRow } from "@/components/admin/AdminUsersTable";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { prisma } from "@/shared/lib/prisma";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { StatCard } from "@/components/ui/stat-card";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/admin/users"));
  }

  if (user.role !== UserRole.ADMIN) {
    redirect("/admin/moderation");
  }

  const users = await prisma.user.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      email: true,
      phone: true,
      name: true,
      role: true,
      is_blocked: true,
      created_at: true,
    },
  });

  const rows: AdminUserRow[] = users.map((item) => ({
    id: item.id,
    email: item.email,
    phone: item.phone,
    name: item.name,
    role: item.role,
    is_blocked: item.is_blocked,
    created_at: item.created_at.toISOString(),
  }));

  const totalCount = users.length;
  const sellersCount = users.filter((item) => item.role === UserRole.SELLER).length;
  const moderatorsCount = users.filter((item) => item.role === UserRole.MODERATOR).length;
  const adminsCount = users.filter((item) => item.role === UserRole.ADMIN).length;

  return (
    <section>
      <PageHeader className="pb-4">
        <PageHeaderContent>
          <PageTitle className="text-2xl sm:text-3xl">Пользователи</PageTitle>
          <PageSubtitle className="text-sm sm:text-base">
            Назначайте и снимайте роль модератора. Продавцов и администраторов изменить нельзя.
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>

      <Section spacing="sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Всего пользователей"
            value={totalCount}
            icon={Users}
          />
          <StatCard
            label="Продавцы"
            value={sellersCount}
            icon={Store}
          />
          <StatCard
            label="Модераторы"
            value={moderatorsCount}
            icon={UserCog}
          />
          <StatCard
            label="Администраторы"
            value={adminsCount}
            icon={Shield}
          />
        </div>
      </Section>

      <div className="mt-8">
        <AdminUsersTable users={rows} currentUserId={user.id} />
      </div>
    </section>
  );
}
