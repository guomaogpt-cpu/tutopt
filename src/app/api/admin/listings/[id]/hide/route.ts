import { ListingStatus } from "@prisma/client";
import { requireStaff } from "@/features/admin/lib/require-admin";
import { createListingModerationNotification } from "@/features/notifications/lib/notifications-data";
import { adminHideListingSchema } from "@/features/reports/validators/report.validators";
import { createAuditLog } from "@/lib/audit/audit-log";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const HIDABLE_STATUSES: ListingStatus[] = [
  ListingStatus.PUBLISHED,
  ListingStatus.PENDING_MODERATION,
];

export async function POST(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const { id } = await context.params;
    const input = await parseJsonBody(request, adminHideListingSchema);

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        vertical: true,
        sellerProfile: { select: { user_id: true } },
      },
    });

    if (!listing) {
      throw new NotFoundError("Объявление не найдено");
    }

    if (!HIDABLE_STATUSES.includes(listing.status)) {
      throw new ValidationError("Это объявление уже скрыто или недоступно для публикации");
    }

    const rejectionReason = input.reason?.trim() || "Жалоба пользователей";

    const updatedListing = await prisma.listing.update({
      where: { id: listing.id },
      data: { status: ListingStatus.REJECTED },
      select: {
        id: true,
        title: true,
        status: true,
        updated_at: true,
      },
    });

    await createAuditLog({
      actorId: staff.id,
      actorRole: staff.role,
      action: "listing.reject",
      targetType: "listing",
      targetId: listing.id,
      metadata: {
        vertical: listing.vertical,
        status_before: listing.status,
        status_after: ListingStatus.REJECTED,
        source: "report_review",
        rejection_reason: rejectionReason,
      },
    });

    try {
      await createListingModerationNotification({
        recipientId: listing.sellerProfile.user_id,
        actorId: staff.id,
        listingId: listing.id,
        listingTitle: listing.title,
        approved: false,
        rejectionReason,
      });
    } catch {
      // Notification must not block moderation action.
    }

    return jsonData({
      listing: updatedListing,
      message: "Объявление скрыто. Автор получит уведомление.",
    });
  });
}
