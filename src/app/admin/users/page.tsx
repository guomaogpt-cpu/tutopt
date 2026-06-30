import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { AdminUsersTable, type AdminUserRow } from "@/components/admin/AdminUsersTable";
import { getCurrentUser } from "@/features/auth/lib/session";
import { prisma } from "@/shared/lib/prisma";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
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

  return (
    <section>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Пользователи</h2>
        <p className="mt-2 text-sm text-slate-600">
          Назначайте и снимайте роль модератора. Продавцов и администраторов изменить нельзя.
        </p>
      </div>

      <AdminUsersTable users={rows} />
    </section>
  );
}
