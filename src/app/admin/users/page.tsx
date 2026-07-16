import type { ListingVertical } from "@prisma/client";
import { ListingStatus, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ShoppingBag, Store, UserCog, Users } from "lucide-react";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { AdminUsersTable, type AdminUserRow } from "@/components/admin/AdminUsersTable";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { VERTICAL_LIST } from "@/features/verticals/verticals";
import { calculateSellerTrust } from "@/lib/trust/seller-trust";
import { prisma } from "@/shared/lib/prisma";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";

export default async function AdminUsersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/admin/users"));
  }

  if (user.role !== UserRole.ADMIN) {
    redirect("/admin/moderation");
  }

  const [users, sellerProfiles, listingGroups, publishedGroups] = await Promise.all([
    prisma.user.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        email: true,
        phone: true,
        phone_verified_at: true,
        name: true,
        avatar_url: true,
        role: true,
        is_blocked: true,
        created_at: true,
      },
    }),
    prisma.sellerProfile.findMany({
      select: {
        id: true,
        user_id: true,
        company_name: true,
        description: true,
        logo_url: true,
        city: { select: { name: true } },
      },
    }),
    prisma.listing.groupBy({
      by: ["seller_profile_id", "vertical"],
      _count: { _all: true },
    }),
    prisma.listing.groupBy({
      by: ["seller_profile_id"],
      where: { status: ListingStatus.PUBLISHED },
      _count: { _all: true },
    }),
  ]);

  const profileByUserId = new Map(
    sellerProfiles.map((profile) => [profile.user_id, profile]),
  );

  const statsByProfileId = new Map<
    string,
    { listingCount: number; verticals: ListingVertical[] }
  >();

  for (const row of listingGroups) {
    const current = statsByProfileId.get(row.seller_profile_id) ?? {
      listingCount: 0,
      verticals: [],
    };
    current.listingCount += row._count._all;
    if (!current.verticals.includes(row.vertical)) {
      current.verticals.push(row.vertical);
    }
    statsByProfileId.set(row.seller_profile_id, current);
  }

  const publishedByProfileId = new Map(
    publishedGroups.map((row) => [row.seller_profile_id, row._count._all]),
  );

  const verticalOrder = VERTICAL_LIST.map((item) => item.id);

  const rows: AdminUserRow[] = users.map((item) => {
    const profile = profileByUserId.get(item.id);
    const stats = profile ? statsByProfileId.get(profile.id) : undefined;
    const verticals = (stats?.verticals ?? [])
      .slice()
      .sort((a, b) => verticalOrder.indexOf(a) - verticalOrder.indexOf(b));

    const trust =
      item.role === UserRole.SELLER || profile
        ? calculateSellerTrust({
            hasSellerProfile: Boolean(profile),
            companyName: profile?.company_name ?? null,
            userName: item.name,
            description: profile?.description ?? null,
            cityName: profile?.city?.name ?? null,
            phone: item.phone,
            phoneVerifiedAt: item.phone_verified_at,
            logoUrl: profile?.logo_url ?? null,
            avatarUrl: item.avatar_url,
            accountCreatedAt: item.created_at,
            publishedListingCount: profile
              ? (publishedByProfileId.get(profile.id) ?? 0)
              : 0,
            activeVerticals: verticals,
            hasCompletedOnboarding: Boolean(item.phone && profile),
          })
        : null;

    return {
      id: item.id,
      email: item.email,
      phone: item.phone,
      name: item.name,
      role: item.role,
      is_blocked: item.is_blocked,
      created_at: item.created_at.toISOString(),
      listingCount: stats?.listingCount ?? 0,
      verticals,
      trustLevel: trust?.level ?? null,
    };
  });

  const stats = [
    {
      label: "Всего пользователей",
      value: users.length,
      icon: Users,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
    {
      label: "Покупатели",
      value: users.filter((item) => item.role === UserRole.BUYER).length,
      icon: ShoppingBag,
      iconClassName: "bg-[#F8FAFC] text-[#475569]",
    },
    {
      label: "Продавцы",
      value: users.filter((item) => item.role === UserRole.SELLER).length,
      icon: Store,
      iconClassName: "bg-[#ECFDF5] text-[#059669]",
    },
    {
      label: "Модераторы",
      value: users.filter((item) => item.role === UserRole.MODERATOR).length,
      icon: UserCog,
      iconClassName: "bg-[#FFFBEB] text-[#D97706]",
    },
  ];

  return (
    <section className="min-w-0">
      <PageHeader className="pb-0">
        <PageHeaderContent>
          <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Пользователи</PageTitle>
          <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
            Управление ролями и доступом пользователей
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>

      <div className="mt-6 space-y-6 lg:mt-8">
        <AdminStatCards stats={stats} />
        <AdminUsersTable users={rows} currentUserId={user.id} />
      </div>
    </section>
  );
}
