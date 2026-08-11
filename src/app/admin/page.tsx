import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { ListingStatus, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  Archive,
  Building2,
  ClipboardCheck,
  ExternalLink,
  Flag,
  Inbox,
  Package,
  ScrollText,
  ShieldOff,
  Store,
  Truck,
  UserCheck,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { isStaffRole } from "@/features/admin/lib/require-admin";
import {
  getAdminMarketplaceMetrics,
  getLatestMarketplaceEvents,
} from "@/features/admin/lib/admin-marketplace-events";
import { VERTICAL_LIST, VERTICALS } from "@/features/verticals/verticals";
import { buildPublicListingWhere } from "@/lib/listings/listing-expiration";
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

const eventDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

type VerticalCounts = Partial<Record<ListingVertical, number>>;

function countsByVertical(
  groups: Array<{ vertical: ListingVertical; _count: { _all: number } }>,
): VerticalCounts {
  return Object.fromEntries(groups.map((row) => [row.vertical, row._count._all]));
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/admin"));
  }

  if (!isStaffRole(user.role)) {
    redirect("/");
  }

  const isAdmin = user.role === UserRole.ADMIN;
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const publicPublishedWhere = buildPublicListingWhere();

  const [
    marketplaceMetrics,
    latestEvents,
    totalByVertical,
    publishedByVertical,
    pendingByVertical,
    newCargoRequestsCount,
    sellersCount,
    blockedUsersCount,
    leadsWeekCount,
    auditWeekCount,
  ] = await Promise.all([
    getAdminMarketplaceMetrics(isAdmin),
    getLatestMarketplaceEvents(10),
    prisma.listing.groupBy({ by: ["vertical"], _count: { _all: true } }),
    prisma.listing.groupBy({
      by: ["vertical"],
      where: publicPublishedWhere,
      _count: { _all: true },
    }),
    prisma.listing.groupBy({
      by: ["vertical"],
      where: { status: ListingStatus.PENDING_MODERATION },
      _count: { _all: true },
    }),
    prisma.cargoRequest.count({ where: { status: "NEW" } }),
    isAdmin ? prisma.sellerProfile.count() : Promise.resolve(0),
    isAdmin
      ? prisma.user.count({
          where: { OR: [{ is_blocked: true }, { blocked_at: { not: null } }] },
        })
      : Promise.resolve(0),
    isAdmin ? prisma.lead.count({ where: { created_at: { gte: weekAgo } } }) : Promise.resolve(0),
    isAdmin ? prisma.auditLog.count({ where: { created_at: { gte: weekAgo } } }) : Promise.resolve(0),
  ]);

  const totalCounts = countsByVertical(totalByVertical);
  const publishedCounts = countsByVertical(publishedByVertical);
  const pendingCounts = countsByVertical(pendingByVertical);

  const hasMarketplaceData =
    marketplaceMetrics.publishedListingsCount > 0 ||
    marketplaceMetrics.pendingCount > 0 ||
    marketplaceMetrics.newLeadsCount > 0 ||
    marketplaceMetrics.openReportsCount > 0 ||
    (isAdmin && marketplaceMetrics.usersCount > 0);

  const marketplaceOverviewStats = [
    ...(isAdmin
      ? [
          {
            label: "Пользователи",
            value: marketplaceMetrics.usersCount,
            icon: Users,
            iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
            href: "/admin/users",
          },
        ]
      : []),
    {
      label: "Активные объявления",
      value: marketplaceMetrics.publishedListingsCount,
      icon: Package,
      iconClassName: "bg-[#ECFDF5] text-[#059669]",
    },
    {
      label: "На модерации",
      value: marketplaceMetrics.pendingCount,
      icon: ClipboardCheck,
      iconClassName: "bg-[#FFFBEB] text-[#D97706]",
      href: "/admin/moderation/listings",
    },
    {
      label: "Отклонённые",
      value: marketplaceMetrics.rejectedListingsCount,
      icon: XCircle,
      iconClassName: "bg-[#FEF2F2] text-[#DC2626]",
    },
    {
      label: "Архивные",
      value: marketplaceMetrics.archivedListingsCount,
      icon: Archive,
      iconClassName: "bg-[#F1F5F9] text-[#64748B]",
    },
    {
      label: "Новые заявки",
      value: marketplaceMetrics.newLeadsCount,
      icon: Inbox,
      iconClassName: "bg-[#FFFBEB] text-[#D97706]",
    },
    {
      label: "Жалобы",
      value: marketplaceMetrics.openReportsCount,
      icon: Flag,
      iconClassName: "bg-[#FEF2F2] text-[#DC2626]",
      href: "/admin/reports",
    },
    {
      label: "Компании на проверке",
      value: marketplaceMetrics.pendingCompaniesCount,
      icon: Building2,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
      href: "/admin/companies",
    },
  ];

  const adminExtraStats = isAdmin
    ? [
        {
          label: "Продавцы",
          value: sellersCount,
          icon: UserCheck,
          iconClassName: "bg-[#ECFDF5] text-[#059669]",
        },
        {
          label: "Заблокированные",
          value: blockedUsersCount,
          icon: ShieldOff,
          iconClassName: "bg-[#FEF2F2] text-[#DC2626]",
          href: "/admin/users",
        },
        {
          label: `Заявки за 7 дней`,
          value: leadsWeekCount,
          icon: Inbox,
          iconClassName: "bg-[#FFFBEB] text-[#D97706]",
        },
        {
          label: "Действия за 7 дней",
          value: auditWeekCount,
          icon: ScrollText,
          iconClassName: "bg-[#F1F5F9] text-[#64748B]",
          href: "/admin/audit",
        },
        {
          label: "Новые карго-заявки",
          value: newCargoRequestsCount,
          icon: Truck,
          iconClassName: "bg-[#FFF1F2] text-[#E11D48]",
          href: "/admin/cargo-requests?status=NEW",
        },
      ]
    : [];

  const quickActions = [
    {
      label: "Модерация объявлений",
      description:
        marketplaceMetrics.pendingCount > 0
          ? `${marketplaceMetrics.pendingCount} ожидают проверки`
          : "Нет объявлений на модерации",
      href: "/admin/moderation/listings",
      adminOnly: false,
    },
    {
      label: "Жалобы",
      description:
        marketplaceMetrics.openReportsCount > 0
          ? `${marketplaceMetrics.openReportsCount} новых жалоб`
          : "Нет новых жалоб",
      href: "/admin/reports",
      adminOnly: false,
    },
    {
      label: "Карго-заявки",
      description:
        newCargoRequestsCount > 0
          ? `${newCargoRequestsCount} новых заявок`
          : "Открыть доску карго",
      href: "/admin/cargo-requests",
      adminOnly: true,
    },
    {
      label: "Пользователи",
      description: "Роли, блокировки и ограничения",
      href: "/admin/users",
      adminOnly: true,
    },
    {
      label: "Журнал действий",
      description: "История модерации и блокировок",
      href: "/admin/audit",
      adminOnly: true,
    },
    {
      label: "На сайт",
      description: "Открыть публичную часть",
      href: "/",
      adminOnly: false,
    },
  ].filter((action) => isAdmin || !action.adminOnly);

  return (
    <section className="min-w-0">
      <PageHeader className="pb-0">
        <PageHeaderContent>
          <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Обзор админки</PageTitle>
          <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
            {isAdmin
              ? "Операционные показатели платформы: модерация, пользователи, заявки"
              : "Очередь модерации, жалобы и объявления по направлениям"}
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>

      <div className="mt-6 space-y-6 lg:mt-8">
        <section aria-labelledby="admin-marketplace-overview-title">
          <h2 id="admin-marketplace-overview-title" className="mb-3 text-lg font-bold text-[#0F172A]">
            Обзор маркетплейса
          </h2>
          {!hasMarketplaceData ? (
            <div className="rounded-2xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-5 py-8 text-center text-sm text-[#64748B]">
              Пока нет данных для отображения.
            </div>
          ) : (
            <AdminStatCards stats={marketplaceOverviewStats} />
          )}
        </section>

        {isAdmin && adminExtraStats.length > 0 ? (
          <AdminStatCards stats={adminExtraStats} />
        ) : null}

        <section aria-labelledby="admin-quick-actions-title">
          <h2 id="admin-quick-actions-title" className="mb-3 text-lg font-bold text-[#0F172A]">
            Быстрые действия
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  "rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-5",
                  "shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition hover:border-[rgba(37,99,235,0.25)]",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base font-bold text-[#0F172A]">{action.label}</p>
                  <ExternalLink className="size-4 shrink-0 text-[#94A3B8]" aria-hidden="true" />
                </div>
                <p className="mt-1 text-sm text-[#64748B]">{action.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="admin-verticals-title">
          <h2 id="admin-verticals-title" className="mb-3 text-lg font-bold text-[#0F172A]">
            Объявления по разделам
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VERTICAL_LIST.map((item) => {
              const Icon = VERTICAL_ICONS[item.id];
              const total = totalCounts[item.id] ?? 0;
              const published = publishedCounts[item.id] ?? 0;
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
                      <dt className="text-xs text-[#94A3B8]">Активные</dt>
                      <dd className="font-semibold text-[#059669]">{published}</dd>
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

        <section aria-labelledby="admin-latest-events-title">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="admin-latest-events-title" className="text-lg font-bold text-[#0F172A]">
              Последние события
            </h2>
            {isAdmin ? (
              <Link href="/admin/audit" className="text-sm font-medium text-[#2563EB]">
                Открыть журнал действий →
              </Link>
            ) : null}
          </div>

          {latestEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-5 py-8 text-center text-sm text-[#64748B]">
              Пока нет данных для отображения.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
              <ul className="divide-y divide-[rgba(148,163,184,0.1)]">
                {latestEvents.map((event) => (
                  <li key={event.id}>
                    <Link
                      href={event.href}
                      className="flex flex-col gap-1 px-4 py-3 transition hover:bg-[#F8FAFC] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#0F172A]">{event.title}</p>
                        <p className="truncate text-xs text-[#64748B]">{event.subtitle}</p>
                      </div>
                      <p className="shrink-0 text-xs text-[#94A3B8]">
                        {eventDateFormatter.format(event.created_at)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
