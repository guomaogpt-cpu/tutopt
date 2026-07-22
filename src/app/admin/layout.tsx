import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Container } from "@/components/layout/Container";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { isStaffRole } from "@/features/admin/lib/require-admin";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata: Metadata = buildPrivatePageMetadata(
  "Админ",
  "Административная панель ВсеТут.",
);

async function getAdminReturnPath(): Promise<string> {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname");
  return pathname && pathname.startsWith("/admin") ? pathname : "/admin";
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
    <div className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container className="max-w-[1280px] min-w-0">
        <AdminNav user={user} />
        {children}
      </Container>
    </div>
  );
}
