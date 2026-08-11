import {
  CompanyVerificationStatus,
  ListingStatus,
  LeadStatus,
  ReportStatus,
} from "@prisma/client";
import {
  getAuditActionLabel,
  getAuditTargetTypeLabel,
} from "@/features/admin/lib/audit-labels";
import { prisma } from "@/shared/lib/prisma";

export type MarketplaceEventType =
  | "listing_created"
  | "listing_moderated"
  | "lead_created"
  | "report_created";

export type MarketplaceEvent = {
  id: string;
  type: MarketplaceEventType;
  title: string;
  subtitle: string;
  created_at: Date;
  href: string;
};

export async function getLatestMarketplaceEvents(limit = 10): Promise<MarketplaceEvent[]> {
  const perSource = Math.max(4, Math.ceil(limit / 2));

  const [listings, leads, reports, auditLogs] = await Promise.all([
    prisma.listing.findMany({
      orderBy: { created_at: "desc" },
      take: perSource,
      select: {
        id: true,
        title: true,
        created_at: true,
      },
    }),
    prisma.lead.findMany({
      orderBy: { created_at: "desc" },
      take: perSource,
      select: {
        id: true,
        created_at: true,
        listing: { select: { title: true } },
      },
    }),
    prisma.report.findMany({
      orderBy: { created_at: "desc" },
      take: perSource,
      select: {
        id: true,
        status: true,
        created_at: true,
        listing: { select: { title: true } },
      },
    }),
    prisma.auditLog.findMany({
      orderBy: { created_at: "desc" },
      take: perSource,
      select: {
        id: true,
        action: true,
        entity_type: true,
        created_at: true,
        actor: { select: { name: true } },
      },
    }),
  ]);

  const events: MarketplaceEvent[] = [];

  for (const listing of listings) {
    events.push({
      id: `listing-${listing.id}`,
      type: "listing_created",
      title: "Новое объявление",
      subtitle: listing.title,
      created_at: listing.created_at,
      href: "/admin/moderation/listings",
    });
  }

  for (const lead of leads) {
    events.push({
      id: `lead-${lead.id}`,
      type: "lead_created",
      title: "Новая заявка",
      subtitle: lead.listing.title,
      created_at: lead.created_at,
      href: "/admin",
    });
  }

  for (const report of reports) {
    events.push({
      id: `report-${report.id}`,
      type: "report_created",
      title: report.status === ReportStatus.OPEN ? "Новая жалоба" : "Жалоба",
      subtitle: report.listing?.title ?? "Профиль или объявление",
      created_at: report.created_at,
      href: "/admin/reports",
    });
  }

  for (const log of auditLogs) {
    events.push({
      id: `audit-${log.id}`,
      type: "listing_moderated",
      title: getAuditActionLabel(log.action),
      subtitle: `${getAuditTargetTypeLabel(log.entity_type)} · ${log.actor.name}`,
      created_at: log.created_at,
      href: "/admin/audit",
    });
  }

  return events
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, limit);
}

export async function getAdminMarketplaceMetrics(isAdmin: boolean) {
  const now = new Date();

  const [
    pendingCount,
    openReportsCount,
    publishedListingsCount,
    rejectedListingsCount,
    archivedListingsCount,
    newLeadsCount,
    pendingCompaniesCount,
    usersCount,
  ] = await Promise.all([
    prisma.listing.count({ where: { status: ListingStatus.PENDING_MODERATION } }),
    prisma.report.count({ where: { status: ReportStatus.OPEN } }),
    prisma.listing.count({
      where: {
        status: ListingStatus.PUBLISHED,
        OR: [{ expires_at: null }, { expires_at: { gt: now } }],
      },
    }),
    prisma.listing.count({ where: { status: ListingStatus.REJECTED } }),
    prisma.listing.count({ where: { status: ListingStatus.ARCHIVED } }),
    prisma.lead.count({ where: { status: LeadStatus.NEW } }),
    prisma.sellerProfile.count({
      where: {
        company_type: { not: null },
        verification_status: CompanyVerificationStatus.PENDING,
      },
    }),
    isAdmin ? prisma.user.count() : Promise.resolve(0),
  ]);

  return {
    usersCount,
    publishedListingsCount,
    pendingCount,
    rejectedListingsCount,
    archivedListingsCount,
    newLeadsCount,
    openReportsCount,
    pendingCompaniesCount,
  };
}
