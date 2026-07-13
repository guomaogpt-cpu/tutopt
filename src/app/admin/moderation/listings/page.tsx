import { ListingStatus } from "@prisma/client";
import { CheckCircle2, Clock, LayoutGrid, XCircle } from "lucide-react";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import {
  ModerationListingsTable,
  type ModerationListingRow,
} from "@/components/admin/ModerationListingsTable";
import { prisma } from "@/shared/lib/prisma";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";

const MODERATION_STATUSES = [
  ListingStatus.PENDING_MODERATION,
  ListingStatus.PUBLISHED,
  ListingStatus.REJECTED,
] as const;

export default async function AdminModerationListingsPage() {
  const [listings, pendingCount, publishedCount, rejectedCount, totalCount] = await Promise.all([
    prisma.listing.findMany({
      where: { status: { in: [...MODERATION_STATUSES] } },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
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
    prisma.listing.count({ where: { status: ListingStatus.PENDING_MODERATION } }),
    prisma.listing.count({ where: { status: ListingStatus.PUBLISHED } }),
    prisma.listing.count({ where: { status: ListingStatus.REJECTED } }),
    prisma.listing.count({ where: { status: { in: [...MODERATION_STATUSES] } } }),
  ]);

  const rows: ModerationListingRow[] = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    status: listing.status,
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
      label: "Всего объявлений",
      value: totalCount,
      icon: LayoutGrid,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
  ];

  return (
    <section className="min-w-0">
      <PageHeader className="pb-0">
        <PageHeaderContent>
          <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Модерация объявлений</PageTitle>
          <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
            Проверяйте новые объявления перед публикацией
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>

      <div className="mt-6 space-y-6 lg:mt-8">
        <AdminStatCards stats={stats} />
        <ModerationListingsTable listings={rows} />
      </div>
    </section>
  );
}
