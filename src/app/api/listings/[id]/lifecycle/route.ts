import { ListingStatus, UserRole } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "@/features/auth/lib/session";
import { createAuditLog } from "@/lib/audit/audit-log";
import { isUserBlocked } from "@/lib/security/user-restrictions";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, NotFoundError, ValidationError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const lifecycleSchema = z.object({
  action: z.enum(["archive", "restore"]),
});

const ARCHIVABLE_STATUSES: ListingStatus[] = [
  ListingStatus.PUBLISHED,
  ListingStatus.PENDING_MODERATION,
  ListingStatus.REJECTED,
];

export async function POST(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const { id } = await context.params;

    if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Управлять объявлениями может только продавец.");
    }
    if (isUserBlocked(user)) {
      throw new ForbiddenError("Аккаунт заблокирован. Действие недоступно.");
    }

    const input = await parseJsonBody(request, lifecycleSchema);

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        vertical: true,
        sellerProfile: { select: { user_id: true } },
      },
    });

    if (!listing || listing.sellerProfile.user_id !== user.id) {
      throw new NotFoundError("Объявление не найдено.");
    }

    let nextStatus: ListingStatus;

    if (input.action === "archive") {
      if (!ARCHIVABLE_STATUSES.includes(listing.status)) {
        throw new ValidationError("Это объявление нельзя архивировать.");
      }
      nextStatus = ListingStatus.ARCHIVED;
    } else {
      if (listing.status !== ListingStatus.ARCHIVED) {
        throw new ValidationError("Восстановить можно только объявление из архива.");
      }
      // Restored listings go through moderation again; approve will refresh
      // expires_at if the publication window has already passed.
      nextStatus = ListingStatus.PENDING_MODERATION;
    }

    const updatedListing = await prisma.listing.update({
      where: { id: listing.id },
      data: {
        status: nextStatus,
        ...(input.action === "archive" ? {} : { published_at: null }),
      },
      select: { id: true, status: true, vertical: true },
    });

    await createAuditLog({
      actorId: user.id,
      actorRole: user.role,
      action: input.action === "archive" ? "listing.archive" : "listing.restore",
      targetType: "listing",
      targetId: listing.id,
      metadata: {
        vertical: listing.vertical,
        status_before: listing.status,
        status_after: nextStatus,
      },
    });

    logger.info("Listing lifecycle action", {
      listingId: listing.id,
      sellerId: user.id,
      action: input.action,
      status: nextStatus,
    });

    return jsonData({
      listing: updatedListing,
      statusBefore: listing.status,
    });
  });
}
