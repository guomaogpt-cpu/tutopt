import { ListingStatus, UserRole } from "@prisma/client";
import { requireAuth } from "@/features/auth/lib/session";
import { slugifyTitle } from "@/features/listings/lib/slug";
import { updateListingSchema } from "@/features/listings/validators/listing.validators";
import { createAuditLog } from "@/lib/audit/audit-log";
import { validateListingContent } from "@/lib/moderation/content-checks";
import { getEditListingRestrictionMessage } from "@/lib/security/user-restrictions";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function arraysEqual(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export async function PATCH(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const { id } = await context.params;

    if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
    throw new ForbiddenError("Редактировать объявления может только продавец.");
  }

    const restrictionMessage = getEditListingRestrictionMessage(user);
    if (restrictionMessage) {
      throw new ForbiddenError(restrictionMessage);
    }

    const input = await parseJsonBody(request, updateListingSchema);
    const vertical = input.vertical;

    if (!vertical) {
      throw new ValidationError("Выберите раздел объявления");
    }

    const contentIssues = validateListingContent({
      title: input.title,
      description: input.description,
    });

    if (contentIssues.length > 0) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of contentIssues) {
        fieldErrors[issue.field] = [...(fieldErrors[issue.field] ?? []), issue.message];
      }
      throw new ValidationError(contentIssues[0]?.message ?? "Проверьте текст объявления", {
        fieldErrors,
      });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        currency: true,
        moq: true,
        unit: true,
        category_id: true,
        city_id: true,
        brand_id: true,
        stock_quantity: true,
        vertical: true,
        status: true,
        sellerProfile: { select: { user_id: true } },
        images: {
          orderBy: { sort_order: "asc" },
          select: { url: true },
        },
      },
    });

    if (!listing) {
      throw new NotFoundError("Объявление не найдено.");
    }
    if (listing.sellerProfile.user_id !== user.id) {
      throw new ForbiddenError("Нет доступа к редактированию этого объявления.");
    }

    const [category, city, brand] = await Promise.all([
      prisma.category.findFirst({
        where: { id: input.category_id, is_active: true },
        select: { id: true, vertical: true },
      }),
      prisma.city.findFirst({
        where: { id: input.city_id, is_active: true },
        select: { id: true, region_id: true },
      }),
      input.brand_id
        ? prisma.brand.findFirst({
            where: { id: input.brand_id, is_active: true },
            select: { id: true },
          })
        : Promise.resolve(null),
    ]);

    if (!category) {
      throw new NotFoundError("Категория не найдена.");
    }
    if (category.vertical !== vertical) {
      throw new ValidationError("Категория не принадлежит выбранному разделу", {
        fieldErrors: {
          category_id: ["Выберите категорию из выбранного раздела"],
        },
      });
    }
    if (!city) {
      throw new NotFoundError("Город не найден.");
    }
    if (input.brand_id && !brand) {
      throw new NotFoundError("Бренд не найден.");
    }

    const oldImages = listing.images.map((image) => image.url);
    const changedFields: string[] = [];
    const comparisons: Array<[string, boolean]> = [
      ["title", listing.title !== input.title],
      ["description", listing.description !== input.description],
      ["price", Number(listing.price.toString()) !== input.price],
      ["currency", listing.currency !== input.currency],
      ["moq", listing.moq !== input.moq],
      ["unit", listing.unit !== input.unit],
      ["category", listing.category_id !== input.category_id],
      ["vertical", listing.vertical !== vertical],
      ["city", listing.city_id !== input.city_id],
      ["brand", listing.brand_id !== (input.brand_id ?? null)],
      ["stock", listing.stock_quantity !== (input.stock_quantity ?? null)],
      ["images", !arraysEqual(oldImages, input.image_urls)],
    ];

    for (const [field, changed] of comparisons) {
      if (changed) {
        changedFields.push(field);
      }
    }

    const requiresModeration =
      changedFields.length > 0 &&
      (listing.status === ListingStatus.PUBLISHED ||
        listing.status === ListingStatus.REJECTED);
    const nextStatus = requiresModeration
      ? ListingStatus.PENDING_MODERATION
      : listing.status;
    const imagesChanged = changedFields.includes("images");

    const updatedListing = await prisma.$transaction(async (tx) => {
      if (imagesChanged) {
        await tx.listingImage.deleteMany({ where: { listing_id: listing.id } });
      }

      return tx.listing.update({
        where: { id: listing.id },
        data: {
          category_id: category.id,
          region_id: city.region_id,
          city_id: city.id,
          brand_id: brand?.id ?? null,
          title: input.title,
          slug: slugifyTitle(input.title),
          description: input.description,
          price: input.price,
          currency: input.currency,
          unit: input.unit,
          moq: input.moq,
          stock_quantity: input.stock_quantity ?? null,
          vertical,
          status: nextStatus,
          ...(requiresModeration ? { published_at: null, rejection_reason: null } : {}),
          ...(imagesChanged
            ? {
                images: {
                  create: input.image_urls.map((url, index) => ({
                    url,
                    sort_order: index,
                  })),
                },
              }
            : {}),
        },
        select: {
          id: true,
          status: true,
          vertical: true,
          updated_at: true,
        },
      });
    });

    await createAuditLog({
      actorId: user.id,
      actorRole: user.role,
      action: "listing.update",
      targetType: "listing",
      targetId: listing.id,
      metadata: {
        status_before: listing.status,
        status_after: updatedListing.status,
        changed_fields: changedFields.join(","),
        vertical: updatedListing.vertical,
      },
    });

    logger.info("Listing updated", {
      listingId: listing.id,
      sellerId: user.id,
      changedFields,
      status: updatedListing.status,
    });

    return jsonData({ listing: updatedListing });
  });
}
