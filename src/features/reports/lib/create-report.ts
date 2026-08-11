import type { ReportReason, User } from "@prisma/client";
import { ReportStatus } from "@prisma/client";
import { ForbiddenError, NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

type CreateReportInput = {
  listingId?: string | null;
  sellerId?: string | null;
  reason: ReportReason;
  message?: string | null;
};

type CreateReportResult = {
  report: {
    id: string;
    reason: ReportReason;
    status: ReportStatus;
    created_at: Date;
  };
  meta: {
    targetType: "listing" | "seller";
    vertical: string | null;
  };
};

export async function createUserReport(
  user: Pick<User, "id">,
  input: CreateReportInput,
): Promise<CreateReportResult> {
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

    const existingOpenReport = await prisma.report.findFirst({
      where: {
        listing_id: listingId,
        reporter_id: user.id,
        status: ReportStatus.OPEN,
      },
      select: { id: true },
    });

    if (existingOpenReport) {
      throw new ValidationError(
        "Вы уже отправили жалобу на это объявление. Мы её проверим.",
      );
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

    if (!listingId) {
      const existingOpenReport = await prisma.report.findFirst({
        where: {
          seller_profile_id: seller.id,
          reporter_id: user.id,
          status: ReportStatus.OPEN,
        },
        select: { id: true },
      });

      if (existingOpenReport) {
        throw new ValidationError(
          "Вы уже отправили жалобу на этого продавца. Мы её проверим.",
        );
      }
    }
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

  return {
    report,
    meta: {
      targetType: listingId ? "listing" : "seller",
      vertical: listingVertical,
    },
  };
}
