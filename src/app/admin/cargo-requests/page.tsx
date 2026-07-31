import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { AdminCargoRequestsPanel } from "@/components/admin/AdminCargoRequestsPanel";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getAdminCargoRequests } from "@/features/cargo/lib/cargo-requests-data";
import { parseCargoRequestStatusFilter } from "@/features/cargo/lib/cargo-request-status";
import { Container } from "@/components/ui/container";
import {
  PageHeader,
  PageHeaderContent,
} from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Карго-заявки",
  "Админ-просмотр карго-заявок и откликов.",
);

export const dynamic = "force-dynamic";

type AdminCargoRequestsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminCargoRequestsPage({
  searchParams,
}: AdminCargoRequestsPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/admin/cargo-requests"));
  }

  if (user.role !== UserRole.ADMIN) {
    redirect("/");
  }

  const rawParams = await searchParams;
  const statusParam = typeof rawParams.status === "string" ? rawParams.status : null;
  const statusFilter = parseCargoRequestStatusFilter(statusParam);
  const requests = await getAdminCargoRequests({ statusFilter });

  return (
    <main className="min-w-0">
      <Container size="lg" className="max-w-[1280px] px-0 sm:px-0">
        <PageHeader className="pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-slate-900 sm:text-3xl dark:text-slate-100">
              Карго-заявки
            </PageTitle>
            <PageSubtitle className="text-sm text-slate-500 sm:text-base dark:text-slate-400">
              Все заявки, контакты клиентов и отклики карго-компаний
            </PageSubtitle>
          </PageHeaderContent>
        </PageHeader>

        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              { href: "/admin/cargo-requests", label: "Все" },
              { href: "/admin/cargo-requests?status=NEW", label: "Новые" },
              { href: "/admin/cargo-requests?status=IN_REVIEW", label: "На рассмотрении" },
              { href: "/admin/cargo-requests?status=CONTACTED", label: "Связались" },
              { href: "/admin/cargo-requests?status=CLOSED", label: "Закрытые" },
            ] as const
          ).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="mt-6">
          <AdminCargoRequestsPanel requests={requests} />
        </div>
      </Container>
    </main>
  );
}
