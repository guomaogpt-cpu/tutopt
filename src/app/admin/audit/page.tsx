import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ScrollText } from "lucide-react";
import { AdminAuditTable, type AdminAuditRow } from "@/components/admin/AdminAuditTable";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { prisma } from "@/shared/lib/prisma";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";

function normalizeMetadata(
  value: unknown,
): Record<string, string | number | boolean | null> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const result: Record<string, string | number | boolean | null> = {};

  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (
      typeof entry === "string" ||
      typeof entry === "number" ||
      typeof entry === "boolean" ||
      entry === null
    ) {
      result[key] = entry;
    }
  }

  return result;
}

export default async function AdminAuditPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/admin/audit"));
  }

  if (user.role !== UserRole.ADMIN) {
    redirect("/admin");
  }

  const [logs, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { created_at: "desc" },
      take: 100,
      select: {
        id: true,
        action: true,
        entity_type: true,
        entity_id: true,
        metadata: true,
        created_at: true,
        actor: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    }),
    prisma.auditLog.count(),
  ]);

  const rows: AdminAuditRow[] = logs.map((log) => {
    const metadata = normalizeMetadata(log.metadata);
    const actorRole =
      typeof metadata?.actor_role === "string" ? metadata.actor_role : log.actor.role;

    return {
      id: log.id,
      action: log.action,
      targetType: log.entity_type,
      targetId: log.entity_id,
      actorName: log.actor.name,
      actorRole,
      metadata,
      created_at: log.created_at.toISOString(),
    };
  });

  const stats = [
    {
      label: "Всего записей",
      value: totalCount,
      icon: ScrollText,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
    {
      label: "Показано",
      value: rows.length,
      icon: ScrollText,
      iconClassName: "bg-[#F1F5F9] text-[#64748B]",
    },
  ];

  return (
    <section className="min-w-0">
      <PageHeader className="pb-0">
        <PageHeaderContent>
          <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Журнал действий</PageTitle>
          <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
            Действия администраторов и модераторов: модерация, жалобы, блокировки
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>

      <div className="mt-6 space-y-6 lg:mt-8">
        <AdminStatCards stats={stats} />
        <AdminAuditTable logs={rows} />
      </div>
    </section>
  );
}
