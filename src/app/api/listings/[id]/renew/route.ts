import { ListingStatus, UserRole } from "@prisma/client";
import { requireAuth } from "@/features/auth/lib/session";
import { createAuditLog } from "@/lib/audit/audit-log";
import {
  canOwnerRenewListing,
  getRenewedExpirationDate,
  isListingExpired,
} from "@/lib/listings/listing-expiration";
import { isUserBlocked, getEditListingRestrictionMessage } from "@/lib/security/user-restrictions";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, NotFoundError, ValidationError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const { id } = await context.params;

    if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Продлевать объявления может только продавец.");
    }
    if (isUserBlocked(user)) {
      throw new ForbiddenError("Аккаунт заблокирован. Продление объявлений недоступно.");
    }
    const restrictionMessage = getEditListingRestrictionMessage(user);
    if (restrictionMessage) {
      throw new ForbiddenError(restrictionMessage);
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        vertical: true,
        expires_at: true,
        sellerProfile: { select: { user_id: true } },
      },
    });

    if (!listing || listing.sellerProfile.user_id !== user.id) {
      throw new NotFoundError("Объявление не найдено.");
    }

    if (!canOwnerRenewListing(user, listing)) {
      if (listing.status === ListingStatus.ARCHIVED) {
        throw new ValidationError("Объявление в архиве. Сначала восстановите его.");
      }
      throw new ValidationError("Это объявление нельзя продлить.");
    }

    const now = new Date();
    const wasExpired = isListingExpired(listing, now);
    // Expired listings were invisible to buyers for a while, so a renewal
    // goes back through moderation before republishing.
    const nextStatus =
      wasExpired && listing.status === ListingStatus.PUBLISHED
        ? ListingStatus.PENDING_MODERATION
        : listing.status;
    const nextExpiresAt = getRenewedExpirationDate(now);

    const updatedListing = await prisma.listing.update({
      where: { id: listing.id },
      data: {
        expires_at: nextExpiresAt,
        renewed_at: now,
        status: nextStatus,
        ...(nextStatus === ListingStatus.PENDING_MODERATION &&
        listing.status === ListingStatus.PUBLISHED
          ? { published_at: null }
          : {}),
      },
      select: {
        id: true,
        status: true,
        vertical: true,
        expires_at: true,
        renewed_at: true,
      },
    });

    await createAuditLog({
      actorId: user.id,
      actorRole: user.role,
      action: "listing.renew",
      targetType: "listing",
      targetId: listing.id,
      metadata: {
        vertical: listing.vertical,
        expires_before: listing.expires_at?.toISOString() ?? null,
        expires_after: nextExpiresAt.toISOString(),
        status_before: listing.status,
        status_after: nextStatus,
      },
    });

    logger.info("Listing renewed", {
      listingId: listing.id,
      sellerId: user.id,
      wasExpired,
      status: nextStatus,
    });

    return jsonData({
      listing: updatedListing,
      wasExpired,
      statusBefore: listing.status,
    });
  });
}
