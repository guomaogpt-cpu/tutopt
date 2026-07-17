import { ListingStatus } from "@prisma/client";
import { requireStaff } from "@/features/admin/lib/require-admin";
import { listingModerationSchema } from "@/features/admin/validators/listing-moderation.validators";
import { createAuditLog } from "@/lib/audit/audit-log";
import {
  getDefaultListingExpirationDate,
  isListingExpired,
} from "@/lib/listings/listing-expiration";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const { id } = await context.params;
    const input = await parseJsonBody(request, listingModerationSchema);

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true, status: true, vertical: true, expires_at: true },
    });

    if (!listing) {
      throw new NotFoundError("Listing not found");
    }

    if (listing.status !== ListingStatus.PENDING_MODERATION) {
      throw new ValidationError("Only listings pending moderation can be approved or rejected");
    }

    const nextStatus =
      input.action === "approve" ? ListingStatus.PUBLISHED : ListingStatus.REJECTED;

    const now = new Date();
    const needsFreshExpiration =
      input.action === "approve" && (!listing.expires_at || isListingExpired(listing, now));

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        status: nextStatus,
        ...(input.action === "approve" ? { published_at: now } : {}),
        ...(needsFreshExpiration
          ? { expires_at: getDefaultListingExpirationDate(now) }
          : {}),
      },
      select: {
        id: true,
        title: true,
        status: true,
        published_at: true,
        expires_at: true,
        updated_at: true,
      },
    });

    await createAuditLog({
      actorId: staff.id,
      actorRole: staff.role,
      action: input.action === "approve" ? "listing.approve" : "listing.reject",
      targetType: "listing",
      targetId: listing.id,
      metadata: {
        vertical: listing.vertical,
        status_before: listing.status,
        status_after: nextStatus,
      },
    });

    if (needsFreshExpiration) {
      await createAuditLog({
        actorId: staff.id,
        actorRole: staff.role,
        action: "listing.expire_publish_date_set",
        targetType: "listing",
        targetId: listing.id,
        metadata: {
          vertical: listing.vertical,
          expires_before: listing.expires_at?.toISOString() ?? null,
          expires_after: updatedListing.expires_at?.toISOString() ?? null,
          status_before: listing.status,
          status_after: nextStatus,
        },
      });
    }

    return jsonData({ listing: updatedListing });
  });
}
