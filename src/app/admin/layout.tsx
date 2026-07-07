import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Container } from "@/components/layout/Container";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { isStaffRole } from "@/features/admin/lib/require-admin";

async function getAdminReturnPath(): Promise<string> {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname");
  return pathname && pathname.startsWith("/admin") ? pathname : "/admin/moderation/listings";
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl(await getAdminReturnPath()));
  }

  if (!isStaffRole(user.role)) {
    redirect("/");
  }

  return (
    <div className="bg-slate-50 py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-wider text-blue-600">Админка</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Панель управления
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {user.role === UserRole.ADMIN
                ? "Полный доступ к управлению пользователями и модерацией."
                : "Доступ к модерации объявлений."}
            </p>
          </div>

          <AdminNav user={user} />
          {children}
        </div>
      </Container>
    </div>
  );
}
