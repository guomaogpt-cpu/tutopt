import { ListingStatus } from "@prisma/client";
import {
  ModerationListingsTable,
  type ModerationListingRow,
} from "@/components/admin/ModerationListingsTable";
import { prisma } from "@/shared/lib/prisma";

export default async function AdminModerationListingsPage() {
  const listings = await prisma.listing.findMany({
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
  });

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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">Модерация объявлений</h2>
        <p className="mt-2 text-sm text-slate-600">
          Проверьте объявления перед публикацией в публичном каталоге.
        </p>
      </div>

      <ModerationListingsTable listings={rows} />
    </section>
  );
}
