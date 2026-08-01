import { ListingStatus, type CompanyType, type CompanyVerificationStatus } from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";
import {
  buildCompanyProfileHref,
  isCompanyProfileConfigured,
} from "@/features/company/lib/company-profile";
import { getBuyerCargoRequests } from "@/features/cargo/lib/cargo-requests-data";
import { getUnreadNotificationCount } from "@/features/notifications/lib/notifications-data";
import { getBuyerLeads } from "@/features/leads/lib/leads-data";
import { prisma } from "@/shared/lib/prisma";

export type AccountListingStats = {
  total: number;
  active: number;
  pending: number;
  rejected: number;
  archived: number;
};

export type AccountRecentListing = {
  id: string;
  title: string;
  status: ListingStatus;
  vertical: string;
};

export type AccountCompanySummary = {
  id: string;
  name: string;
  slug: string;
  companyType: CompanyType;
  verificationStatus: CompanyVerificationStatus;
  publicHref: string;
} | null;

export type AccountCargoSummary = {
  showBlock: boolean;
  hasCargoActivity: boolean;
  telegramConnected: boolean;
  notificationsEnabled: boolean;
  responseCount: number;
  cargoListingCount: number;
};

export type AccountDashboardData = {
  userName: string;
  listingStats: AccountListingStats;
  recentListings: AccountRecentListing[];
  leadsCount: number;
  recentLeadTitles: string[];
  cargoRequestsCount: number;
  recentCargoRequests: Array<{
    id: string;
    itemName: string;
    status: string;
    responseCount: number;
    fromLocation: string;
    toLocation: string;
  }>;
  company: AccountCompanySummary;
  cargo: AccountCargoSummary;
  favoritesCount: number;
  unreadNotifications: number;
};

export async function getAccountDashboardData(
  user: PublicUser,
): Promise<AccountDashboardData> {
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { user_id: user.id },
    select: {
      id: true,
      slug: true,
      company_name: true,
      company_type: true,
      verification_status: true,
      cargoRequestSubscription: {
        select: {
          enabled: true,
          notify_telegram: true,
          telegram_chat_id: true,
          telegram_connected_at: true,
        },
      },
      _count: {
        select: {
          cargoResponses: true,
        },
      },
    },
  });

  const [
    listingGroups,
    recentListings,
    leads,
    cargoRequests,
    favoritesCount,
    unreadNotifications,
    cargoListingCount,
  ] = await Promise.all([
    sellerProfile
      ? prisma.listing.groupBy({
          by: ["status"],
          where: { seller_profile_id: sellerProfile.id },
          _count: { _all: true },
        })
      : Promise.resolve([]),
    sellerProfile
      ? prisma.listing.findMany({
          where: { seller_profile_id: sellerProfile.id },
          orderBy: { updated_at: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            status: true,
            vertical: true,
          },
        })
      : Promise.resolve([]),
    getBuyerLeads(user.id),
    getBuyerCargoRequests(user.id),
    prisma.favorite.count({ where: { user_id: user.id } }),
    getUnreadNotificationCount(user.id),
    sellerProfile
      ? prisma.listing.count({
          where: {
            seller_profile_id: sellerProfile.id,
            vertical: "CARGO",
          },
        })
      : Promise.resolve(0),
  ]);

  const counts: AccountListingStats = {
    total: 0,
    active: 0,
    pending: 0,
    rejected: 0,
    archived: 0,
  };

  for (const row of listingGroups) {
    const count = row._count._all;
    counts.total += count;
    switch (row.status) {
      case ListingStatus.PUBLISHED:
        counts.active += count;
        break;
      case ListingStatus.PENDING_MODERATION:
      case ListingStatus.DRAFT:
        counts.pending += count;
        break;
      case ListingStatus.REJECTED:
        counts.rejected += count;
        break;
      case ListingStatus.ARCHIVED:
        counts.archived += count;
        break;
      default:
        break;
    }
  }

  const companyConfigured = isCompanyProfileConfigured(sellerProfile);
  const company: AccountCompanySummary =
    companyConfigured && sellerProfile && sellerProfile.company_type
      ? {
          id: sellerProfile.id,
          name: sellerProfile.company_name,
          slug: sellerProfile.slug,
          companyType: sellerProfile.company_type,
          verificationStatus: sellerProfile.verification_status,
          publicHref: buildCompanyProfileHref(sellerProfile.slug || sellerProfile.id),
        }
      : null;

  const subscription = sellerProfile?.cargoRequestSubscription ?? null;
  const telegramConnected = Boolean(
    subscription?.telegram_chat_id || subscription?.telegram_connected_at,
  );
  const notificationsEnabled = Boolean(subscription?.enabled);
  const responseCount = sellerProfile?._count.cargoResponses ?? 0;
  const hasCargoActivity =
    cargoListingCount > 0 ||
    Boolean(sellerProfile?.company_type === "CARGO") ||
    Boolean(subscription) ||
    responseCount > 0;

  return {
    userName: user.name,
    listingStats: counts,
    recentListings,
    leadsCount: leads.length,
    recentLeadTitles: leads.slice(0, 3).map((lead) => lead.listing.title),
    cargoRequestsCount: cargoRequests.length,
    recentCargoRequests: cargoRequests.slice(0, 3).map((request) => ({
      id: request.id,
      itemName: request.item_name,
      status: request.status,
      responseCount: request.responses.length,
      fromLocation: request.from_location,
      toLocation: request.to_location,
    })),
    company,
    cargo: {
      showBlock: true,
      hasCargoActivity,
      telegramConnected,
      notificationsEnabled,
      responseCount,
      cargoListingCount,
    },
    favoritesCount,
    unreadNotifications,
  };
}
