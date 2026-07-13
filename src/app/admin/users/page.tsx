import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ShoppingBag, Store, UserCog, Users } from "lucide-react";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { AdminUsersTable, type AdminUserRow } from "@/components/admin/AdminUsersTable";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { prisma } from "@/shared/lib/prisma";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";

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

  const stats = [
    {
      label: "Всего пользователей",
      value: users.length,
      icon: Users,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
    {
      label: "Покупатели",
      value: users.filter((item) => item.role === UserRole.BUYER).length,
      icon: ShoppingBag,
      iconClassName: "bg-[#F8FAFC] text-[#475569]",
    },
    {
      label: "Продавцы",
      value: users.filter((item) => item.role === UserRole.SELLER).length,
      icon: Store,
      iconClassName: "bg-[#ECFDF5] text-[#059669]",
    },
    {
      label: "Модераторы",
      value: users.filter((item) => item.role === UserRole.MODERATOR).length,
      icon: UserCog,
      iconClassName: "bg-[#FFFBEB] text-[#D97706]",
    },
  ];

  return (
    <section className="min-w-0">
      <PageHeader className="pb-0">
        <PageHeaderContent>
          <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Пользователи</PageTitle>
          <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
            Управление ролями и доступом пользователей
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>

      <div className="mt-6 space-y-6 lg:mt-8">
        <AdminStatCards stats={stats} />
        <AdminUsersTable users={rows} currentUserId={user.id} />
      </div>
    </section>
  );
}
