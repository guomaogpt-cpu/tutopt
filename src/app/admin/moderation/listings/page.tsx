import { ListingStatus } from "@prisma/client";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import {
  ModerationListingsTable,
  type ModerationListingRow,
} from "@/components/admin/ModerationListingsTable";
import { prisma } from "@/shared/lib/prisma";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { StatCard } from "@/components/ui/stat-card";

export default async function AdminModerationListingsPage() {
  const [listings, pendingCount, publishedCount, rejectedCount] = await Promise.all([
    prisma.listing.findMany({
      where: { status: ListingStatus.PENDING_MODERATION },
      orderBy: { created_at: "asc" },
      select: {
        id: true,
        title: true,
        created_at: true,
        category: { select: { name: true } },
        city: { select: { name: true } },
        sellerProfile: { select: { company_name: true } },
        images: {
          orderBy: { sort_order: "asc" },
          take: 1,
          select: { url: true },
        },
      },
    }),
    prisma.listing.count({ where: { status: ListingStatus.PENDING_MODERATION } }),
    prisma.listing.count({ where: { status: ListingStatus.PUBLISHED } }),
    prisma.listing.count({ where: { status: ListingStatus.REJECTED } }),
  ]);

  const rows: ModerationListingRow[] = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    created_at: listing.created_at.toISOString(),
    imageUrl: listing.images[0]?.url ?? null,
    categoryName: listing.category.name,
    cityName: listing.city?.name ?? null,
    sellerName: listing.sellerProfile.company_name,
  }));

  return (
    <section>
      <PageHeader className="pb-4">
        <PageHeaderContent>
          <PageTitle className="text-2xl sm:text-3xl">Модерация объявлений</PageTitle>
          <PageSubtitle className="text-sm sm:text-base">
            Проверьте объявления перед публикацией в публичном каталоге.
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>

      <Section spacing="sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Ожидают проверки"
            value={pendingCount}
            icon={Clock}
          />
          <StatCard
            label="Опубликовано"
            value={publishedCount}
            icon={CheckCircle2}
          />
          <StatCard
            label="Отклонено"
            value={rejectedCount}
            icon={XCircle}
          />
        </div>
      </Section>

      <div className="mt-8">
        <Section spacing="none" aria-labelledby="moderation-queue-title">
          <h2 id="moderation-queue-title" className="sr-only">
            Очередь модерации
          </h2>
          <ModerationListingsTable listings={rows} />
        </Section>
      </div>
    </section>
  );
}
