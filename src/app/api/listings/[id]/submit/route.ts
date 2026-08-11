import { ListingStatus, UserRole } from "@prisma/client";
import { requireAuth } from "@/features/auth/lib/session";
import { notifyListingSubmittedIfNeeded } from "@/features/notifications/lib/notifications-data";
import { createAuditLog } from "@/lib/audit/audit-log";
import { isUserBlocked, getEditListingRestrictionMessage } from "@/lib/security/user-restrictions";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const SUBMITTABLE_STATUSES: ListingStatus[] = [
  ListingStatus.DRAFT,
  ListingStatus.REJECTED,
];

export async function POST(_request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const { id } = await context.params;

    if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Отправить объявление может только продавец.");
    }
    if (isUserBlocked(user)) {
      throw new ForbiddenError("Аккаунт заблокирован. Действие недоступно.");
    }

    const restrictionMessage = getEditListingRestrictionMessage(user);
    if (restrictionMessage) {
      throw new ForbiddenError(restrictionMessage);
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        vertical: true,
        description: true,
        sellerProfile: { select: { user_id: true } },
        _count: { select: { images: true } },
      },
    });

    if (!listing || listing.sellerProfile.user_id !== user.id) {
      throw new NotFoundError("Объявление не найдено.");
    }

    if (listing.status === ListingStatus.PENDING_MODERATION) {
      throw new ValidationError("Объявление уже на модерации.");
    }

    if (!SUBMITTABLE_STATUSES.includes(listing.status)) {
      throw new ValidationError("Это объявление нельзя отправить на модерацию.");
    }

    if (!listing.title.trim() || !listing.description.trim()) {
      throw new ValidationError("Заполните название и описание перед отправкой.");
    }

    if (listing._count.images === 0) {
      throw new ValidationError("Добавьте хотя бы одно фото перед отправкой.");
    }

    const previousStatus = listing.status;
    const updatedListing = await prisma.listing.update({
      where: { id: listing.id },
      data: {
        status: ListingStatus.PENDING_MODERATION,
        rejection_reason: null,
        published_at: null,
      },
      select: {
        id: true,
        title: true,
        status: true,
        vertical: true,
      },
    });

    await createAuditLog({
      actorId: user.id,
      actorRole: user.role,
      action: "listing.submit",
      targetType: "listing",
      targetId: listing.id,
      metadata: {
        vertical: listing.vertical,
        status_before: previousStatus,
        status_after: ListingStatus.PENDING_MODERATION,
      },
    });

    await notifyListingSubmittedIfNeeded({
      recipientId: user.id,
      listingTitle: listing.title,
      previousStatus,
      nextStatus: ListingStatus.PENDING_MODERATION,
    });

    return jsonData({
      listing: updatedListing,
      message: "Объявление отправлено на модерацию.",
    });
  });
}
