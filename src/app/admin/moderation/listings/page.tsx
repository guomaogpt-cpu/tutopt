import type { ListingVertical } from "@prisma/client";
import { ListingStatus } from "@prisma/client";
import Link from "next/link";
import { CheckCircle2, Clock, LayoutGrid, XCircle } from "lucide-react";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import {
  ModerationListingsTable,
  type ModerationListingRow,
} from "@/components/admin/ModerationListingsTable";
import {
  getModerationEmptyMessage,
  getModerationVerticalFilterHref,
  getModerationVerticalLabel,
} from "@/features/admin/lib/moderation-vertical";
import { parseListingVerticalParam, VERTICAL_LIST } from "@/features/verticals/verticals";
import { prisma } from "@/shared/lib/prisma";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { cn } from "@/lib/utils";

const MODERATION_STATUSES = [
  ListingStatus.PENDING_MODERATION,
  ListingStatus.PUBLISHED,
  ListingStatus.REJECTED,
] as const;

type AdminModerationListingsPageProps = {
  searchParams: Promise<{ vertical?: string }>;
};

export default async function AdminModerationListingsPage({
  searchParams,
}: AdminModerationListingsPageProps) {
  const { vertical: verticalParam } = await searchParams;
  const filterVertical = parseListingVerticalParam(verticalParam);

  const statusWhere = {
    status: { in: [...MODERATION_STATUSES] },
    ...(filterVertical ? { vertical: filterVertical } : {}),
  };

  const [
    listings,
    pendingCount,
    publishedCount,
    rejectedCount,
    totalCount,
    verticalGroups,
  ] = await Promise.all([
    prisma.listing.findMany({
      where: statusWhere,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        vertical: true,
        price: true,
        currency: true,
        created_at: true,
        category: { select: { name: true } },
        city: { select: { name: true } },
        sellerProfile: { select: { company_name: true } },
        images: {
          orderBy: { sort_order: "asc" },
          take: 1,
          select: { url: true, thumbnail_url: true },
        },
      },
    }),
    prisma.listing.count({
      where: {
        status: ListingStatus.PENDING_MODERATION,
        ...(filterVertical ? { vertical: filterVertical } : {}),
      },
    }),
    prisma.listing.count({
      where: {
        status: ListingStatus.PUBLISHED,
        ...(filterVertical ? { vertical: filterVertical } : {}),
      },
    }),
    prisma.listing.count({
      where: {
        status: ListingStatus.REJECTED,
        ...(filterVertical ? { vertical: filterVertical } : {}),
      },
    }),
    prisma.listing.count({ where: statusWhere }),
    prisma.listing.groupBy({
      by: ["vertical"],
      where: { status: { in: [...MODERATION_STATUSES] } },
      _count: { _all: true },
    }),
  ]);

  const verticalCounts = Object.fromEntries(
    verticalGroups.map((row) => [row.vertical, row._count._all]),
  ) as Partial<Record<ListingVertical, number>>;

  const allModerationCount = verticalGroups.reduce((sum, row) => sum + row._count._all, 0);

  const rows: ModerationListingRow[] = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    status: listing.status,
    vertical: listing.vertical,
    price: listing.price.toString(),
    currency: listing.currency,
    created_at: listing.created_at.toISOString(),
    imageUrl: listing.images[0]?.thumbnail_url ?? listing.images[0]?.url ?? null,
    categoryName: listing.category.name,
    cityName: listing.city?.name ?? null,
    sellerName: listing.sellerProfile.company_name,
  }));

  const stats = [
    {
      label: "На модерации",
      value: pendingCount,
      icon: Clock,
      iconClassName: "bg-[#FFFBEB] text-[#D97706]",
    },
    {
      label: "Опубликовано",
      value: publishedCount,
      icon: CheckCircle2,
      iconClassName: "bg-[#ECFDF5] text-[#059669]",
    },
    {
      label: "Отклонено",
      value: rejectedCount,
      icon: XCircle,
      iconClassName: "bg-[#FEF2F2] text-[#DC2626]",
    },
    {
      label: filterVertical ? "В направлении" : "Всего объявлений",
      value: totalCount,
      icon: LayoutGrid,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
  ];

  const emptyMessage = getModerationEmptyMessage(filterVertical);

  return (
    <section className="min-w-0">
      <PageHeader className="pb-0">
        <PageHeaderContent>
          <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Модерация объявлений</PageTitle>
          <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
            {filterVertical
              ? `Фильтр: ${getModerationVerticalLabel(filterVertical)}. Проверяйте объявления перед публикацией.`
              : "Проверяйте новые объявления перед публикацией"}
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>

      <div className="mt-6 space-y-6 lg:mt-8">
        <AdminStatCards stats={stats} />

        <div className="-mx-1 overflow-x-auto px-1">
          <div className="flex w-max min-w-full flex-wrap gap-2 sm:w-auto">
            <Link
              href={getModerationVerticalFilterHref(null)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center rounded-full px-3.5 text-sm font-medium transition",
                filterVertical === null
                  ? "bg-[#2563EB] text-white"
                  : "bg-white text-[#475569] ring-1 ring-slate-200 hover:ring-[#2563EB]/35",
              )}
            >
              Все
              <span className="ml-1.5 opacity-80">{allModerationCount}</span>
            </Link>
            {VERTICAL_LIST.map((item) => {
              const isActive = filterVertical === item.id;
              const count = verticalCounts[item.id] ?? 0;
              return (
                <Link
                  key={item.id}
                  href={getModerationVerticalFilterHref(item.id)}
                  className={cn(
                    "inline-flex h-9 shrink-0 items-center rounded-full px-3.5 text-sm font-medium transition",
                    isActive
                      ? "bg-[#2563EB] text-white"
                      : "bg-white text-[#475569] ring-1 ring-slate-200 hover:ring-[#2563EB]/35",
                  )}
                >
                  {item.label}
                  <span className="ml-1.5 opacity-80">{count}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <ModerationListingsTable
          listings={rows}
          activeVertical={filterVertical}
          emptyMessage={emptyMessage}
        />
      </div>
    </section>
  );
}
