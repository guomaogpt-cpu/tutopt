import { requireAuth } from "@/features/auth/lib/session";
import { createReportSchema } from "@/features/reports/validators/report.validators";
import { assertReportCreateRateLimit } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    assertReportCreateRateLimit(user.id);

    const input = await parseJsonBody(request, createReportSchema);
    const message = input.message?.trim() || null;

    const listingId: string | null = input.listingId ?? null;
    let sellerProfileId: string | null = input.sellerId ?? null;
    let listingVertical: string | null = null;

    if (listingId) {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: {
          id: true,
          vertical: true,
          seller_profile_id: true,
          sellerProfile: { select: { user_id: true } },
        },
      });

      if (!listing) {
        throw new NotFoundError("Объявление не найдено");
      }

      if (listing.sellerProfile.user_id === user.id) {
        throw new ForbiddenError("Нельзя пожаловаться на своё объявление");
      }

      listingVertical = listing.vertical;

      if (!sellerProfileId) {
        sellerProfileId = listing.seller_profile_id;
      }
    }

    if (input.sellerId) {
      const seller = await prisma.sellerProfile.findUnique({
        where: { id: input.sellerId },
        select: { id: true, user_id: true },
      });

      if (!seller) {
        throw new NotFoundError("Продавец не найден");
      }

      if (seller.user_id === user.id) {
        throw new ForbiddenError("Нельзя пожаловаться на свой профиль");
      }

      sellerProfileId = seller.id;
    }

    if (!listingId && !sellerProfileId) {
      throw new ValidationError("Укажите объявление или продавца");
    }

    const report = await prisma.report.create({
      data: {
        listing_id: listingId,
        seller_profile_id: sellerProfileId,
        reporter_id: user.id,
        reason: input.reason,
        comment: message,
      },
      select: {
        id: true,
        reason: true,
        status: true,
        created_at: true,
      },
    });

    return jsonData(
      {
        report,
        meta: {
          targetType: listingId ? "listing" : "seller",
          vertical: listingVertical,
        },
      },
      201,
    );
  });
}
