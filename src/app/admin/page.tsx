import Link from "next/link";
import { ListingStatus, ReportStatus, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  ClipboardCheck,
  Flag,
  LayoutGrid,
  Package,
  Store,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { isStaffRole } from "@/features/admin/lib/require-admin";
import { VERTICAL_LIST, VERTICALS } from "@/features/verticals/verticals";
import { prisma } from "@/shared/lib/prisma";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { cn } from "@/lib/utils";

const VERTICAL_ICONS = {
  OPT: Package,
  MARKET: Store,
  SERVICES: Wrench,
  CARGO: Truck,
} as const;

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/admin"));
  }

  if (!isStaffRole(user.role)) {
    redirect("/");
  }

  const isAdmin = user.role === UserRole.ADMIN;

  const [pendingCount, usersCount, openReportsCount, verticalGroups, pendingByVertical] =
    await Promise.all([
      prisma.listing.count({
        where: { status: ListingStatus.PENDING_MODERATION },
      }),
      isAdmin ? prisma.user.count() : Promise.resolve(0),
      prisma.report.count({ where: { status: ReportStatus.OPEN } }),
      prisma.listing.groupBy({
        by: ["vertical"],
        _count: { _all: true },
      }),
      prisma.listing.groupBy({
        by: ["vertical"],
        where: { status: ListingStatus.PENDING_MODERATION },
        _count: { _all: true },
      }),
    ]);

  const listingCounts = Object.fromEntries(
    verticalGroups.map((row) => [row.vertical, row._count._all]),
  ) as Partial<Record<(typeof VERTICAL_LIST)[number]["id"], number>>;

  const pendingCounts = Object.fromEntries(
    pendingByVertical.map((row) => [row.vertical, row._count._all]),
  ) as Partial<Record<(typeof VERTICAL_LIST)[number]["id"], number>>;

  const topStats = [
    {
      label: "Объявления на модерации",
      value: pendingCount,
      icon: ClipboardCheck,
      iconClassName: "bg-[#FFFBEB] text-[#D97706]",
    },
    {
      label: "Новые жалобы",
      value: openReportsCount,
      icon: Flag,
      iconClassName: "bg-[#FEF2F2] text-[#DC2626]",
    },
    ...(isAdmin
      ? [
          {
            label: "Пользователи",
            value: usersCount,
            icon: Users,
            iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
          },
        ]
      : [
          {
            label: "Всего в направлениях",
            value: VERTICAL_LIST.reduce(
              (sum, item) => sum + (listingCounts[item.id] ?? 0),
              0,
            ),
            icon: LayoutGrid,
            iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
          },
        ]),
  ];

  return (
    <section className="min-w-0">
      <PageHeader className="pb-0">
        <PageHeaderContent>
          <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Обзор админки</PageTitle>
          <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
            {isAdmin
              ? "Модерация, пользователи и статистика по направлениям"
              : "Очередь модерации и объявления по направлениям"}
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>

      <div className="mt-6 space-y-6 lg:mt-8">
        <AdminStatCards stats={topStats} />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/moderation/listings"
            className={cn(
              "rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-5",
              "shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition hover:border-[rgba(37,99,235,0.25)]",
            )}
          >
            <p className="text-sm font-medium text-[#64748B]">Очередь</p>
            <p className="mt-1 text-lg font-bold text-[#0F172A]">Объявления на модерации</p>
            <p className="mt-2 text-sm text-[#2563EB]">
              {pendingCount > 0 ? `${pendingCount} ожидают проверки →` : "Открыть модерацию →"}
            </p>
          </Link>

          <Link
            href="/admin/reports"
            className={cn(
              "rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-5",
              "shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition hover:border-[rgba(37,99,235,0.25)]",
            )}
          >
            <p className="text-sm font-medium text-[#64748B]">Abuse</p>
            <p className="mt-1 text-lg font-bold text-[#0F172A]">Жалобы</p>
            <p className="mt-2 text-sm text-[#2563EB]">
              {openReportsCount > 0
                ? `${openReportsCount} новых жалоб →`
                : "Открыть жалобы →"}
            </p>
          </Link>

          {isAdmin ? (
            <Link
              href="/admin/users"
              className={cn(
                "rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-5",
                "shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition hover:border-[rgba(37,99,235,0.25)]",
              )}
            >
              <p className="text-sm font-medium text-[#64748B]">Доступ</p>
              <p className="mt-1 text-lg font-bold text-[#0F172A]">Пользователи</p>
              <p className="mt-2 text-sm text-[#2563EB]">Управление ролями →</p>
            </Link>
          ) : null}
        </div>

        <section aria-labelledby="admin-verticals-title">
          <h2 id="admin-verticals-title" className="mb-3 text-lg font-bold text-[#0F172A]">
            Направления
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VERTICAL_LIST.map((item) => {
              const Icon = VERTICAL_ICONS[item.id];
              const total = listingCounts[item.id] ?? 0;
              const pending = pendingCounts[item.id] ?? 0;

              return (
                <Link
                  key={item.id}
                  href={`/admin/moderation/listings?vertical=${item.id}`}
                  className={cn(
                    "rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-4",
                    "shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition hover:border-[rgba(37,99,235,0.25)]",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#0F172A]">{VERTICALS[item.id].label}</p>
                      <p className="text-xs text-[#64748B]">{item.description}</p>
                    </div>
                  </div>
                  <dl className="mt-3 flex gap-4 text-sm">
                    <div>
                      <dt className="text-xs text-[#94A3B8]">Всего</dt>
                      <dd className="font-semibold text-[#0F172A]">{total}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#94A3B8]">На модерации</dt>
                      <dd className="font-semibold text-[#D97706]">{pending}</dd>
                    </div>
                  </dl>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
