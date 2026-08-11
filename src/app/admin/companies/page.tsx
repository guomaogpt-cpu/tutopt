import { redirect } from "next/navigation";
import { ListingStatus, UserRole } from "@prisma/client";
import { AdminCompaniesTable } from "@/components/admin/AdminCompaniesTable";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildCompanyProfileHref } from "@/features/company/lib/company-profile";
import { buildNotExpiredListingFilter } from "@/lib/listings/listing-expiration";
import { prisma } from "@/shared/lib/prisma";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Компании",
  "Проверка компаний на ВсеТут.",
);

export default async function AdminCompaniesPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/admin");
  }

  const companies = await prisma.sellerProfile.findMany({
    where: { company_type: { not: null } },
    orderBy: [{ verification_status: "asc" }, { updated_at: "desc" }],
    select: {
      id: true,
      slug: true,
      company_name: true,
      company_type: true,
      verification_status: true,
      verification_note: true,
      created_at: true,
      city: { select: { name: true } },
      user: { select: { id: true, name: true } },
    },
  });

  const listingCounts = await prisma.listing.groupBy({
    by: ["seller_profile_id"],
    where: {
      seller_profile_id: { in: companies.map((item) => item.id) },
      status: ListingStatus.PUBLISHED,
      posted_as_company: true,
      AND: [buildNotExpiredListingFilter()],
    },
    _count: { _all: true },
  });
  const activeListingsByCompanyId = new Map(
    listingCounts.map((item) => [item.seller_profile_id, item._count._all]),
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Компании
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Базовая проверка профилей компаний. Без KYC и без загрузки документов.
        </p>
      </header>

      <AdminCompaniesTable
        companies={companies.map((item) => ({
          id: item.id,
          slug: item.slug,
          publicHref: buildCompanyProfileHref(item.slug || item.id),
          companyName: item.company_name,
          companyType: item.company_type!,
          cityName: item.city?.name ?? null,
          ownerName: item.user.name,
          ownerId: item.user.id,
          verificationStatus: item.verification_status,
          verificationNote: item.verification_note,
          createdAt: item.created_at.toISOString(),
          activeListingsCount: activeListingsByCompanyId.get(item.id) ?? 0,
        }))}
      />
    </div>
  );
}
