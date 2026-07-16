import { Flag } from "lucide-react";
import {
  AdminReportsTable,
  type AdminReportRow,
} from "@/components/admin/AdminReportsTable";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { prisma } from "@/shared/lib/prisma";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { ReportStatus } from "@prisma/client";

export default async function AdminReportsPage() {
  const [reports, openCount, resolvedCount, dismissedCount] = await Promise.all([
    prisma.report.findMany({
      orderBy: { created_at: "desc" },
      take: 200,
      select: {
        id: true,
        reason: true,
        comment: true,
        status: true,
        created_at: true,
        listing_id: true,
        seller_profile_id: true,
        listing: {
          select: {
            id: true,
            title: true,
            vertical: true,
            sellerProfile: {
              select: {
                id: true,
                company_name: true,
                user_id: true,
              },
            },
          },
        },
        sellerProfile: {
          select: {
            id: true,
            company_name: true,
            user_id: true,
          },
        },
        reporter: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.report.count({ where: { status: ReportStatus.OPEN } }),
    prisma.report.count({ where: { status: ReportStatus.RESOLVED } }),
    prisma.report.count({ where: { status: ReportStatus.DISMISSED } }),
  ]);

  const rows: AdminReportRow[] = reports.map((report) => {
    const targetType: "listing" | "seller" = report.listing_id ? "listing" : "seller";
    const sellerFromListing = report.listing?.sellerProfile;
    const seller = report.sellerProfile ?? sellerFromListing ?? null;

    return {
      id: report.id,
      reason: report.reason,
      comment: report.comment,
      status: report.status,
      created_at: report.created_at.toISOString(),
      reporterName: report.reporter.name,
      listingId: report.listing?.id ?? report.listing_id,
      listingTitle: report.listing?.title ?? null,
      listingVertical: report.listing?.vertical ?? null,
      sellerId: seller?.id ?? report.seller_profile_id,
      sellerName: seller?.company_name ?? null,
      sellerUserId: seller?.user_id ?? null,
      targetType,
    };
  });

  const stats = [
    {
      label: "Новые",
      value: openCount,
      icon: Flag,
      iconClassName: "bg-[#FFFBEB] text-[#D97706]",
    },
    {
      label: "Рассмотренные",
      value: resolvedCount,
      icon: Flag,
      iconClassName: "bg-[#ECFDF5] text-[#059669]",
    },
    {
      label: "Отклонённые",
      value: dismissedCount,
      icon: Flag,
      iconClassName: "bg-[#F1F5F9] text-[#64748B]",
    },
    {
      label: "Всего",
      value: reports.length,
      icon: Flag,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
  ];

  return (
    <section className="min-w-0">
      <PageHeader className="pb-0">
        <PageHeaderContent>
          <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Жалобы</PageTitle>
          <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
            Ручная проверка жалоб на объявления и продавцов. Без автоблокировок.
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>

      <div className="mt-6 space-y-6 lg:mt-8">
        <AdminStatCards stats={stats} />
        <AdminReportsTable reports={rows} />
      </div>
    </section>
  );
}
