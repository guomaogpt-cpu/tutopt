import { ListingStatus, UserRole } from "@prisma/client";
import { requireAuth } from "@/features/auth/lib/session";
import { findRecentDuplicateListing } from "@/features/listings/lib/listing-duplicate-check";
import { ensureSellerProfile } from "@/features/listings/lib/seller-profile";
import { generateShortId, slugifyTitle } from "@/features/listings/lib/slug";
import { createListingSchema } from "@/features/listings/validators/listing.validators";
import { createAuditLog } from "@/lib/audit/audit-log";
import { validateListingContent } from "@/lib/moderation/content-checks";
import { assertListingCreateRateLimit } from "@/lib/security/rate-limit";
import { getCreateListingRestrictionMessage } from "@/lib/security/user-restrictions";
import { DEFAULT_LISTING_VERTICAL } from "@/features/verticals/verticals";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await requireAuth();

    if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Only sellers can create listings");
    }

    const listingRestrictionMessage = getCreateListingRestrictionMessage(user);
    if (listingRestrictionMessage) {
      throw new ForbiddenError(listingRestrictionMessage);
    }

    assertListingCreateRateLimit(user.id);

    const input = await parseJsonBody(request, createListingSchema);
    const vertical = input.vertical ?? DEFAULT_LISTING_VERTICAL;

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

    const [category, city, brand] = await Promise.all([
      prisma.category.findFirst({
        where: { id: input.category_id, is_active: true },
      }),
      prisma.city.findFirst({
        where: { id: input.city_id, is_active: true },
        include: { region: true },
      }),
      input.brand_id
        ? prisma.brand.findFirst({
            where: { id: input.brand_id, is_active: true },
          })
        : Promise.resolve(null),
    ]);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    if (category.vertical !== vertical) {
      throw new ValidationError("Категория не принадлежит выбранному разделу", {
        fieldErrors: {
          category_id: ["Выберите категорию из выбранного раздела"],
        },
      });
    }

    if (!city) {
      throw new NotFoundError("City not found");
    }

    if (input.brand_id && !brand) {
      throw new NotFoundError("Brand not found");
    }

    const sellerProfile = await ensureSellerProfile(user);

    const duplicate = await findRecentDuplicateListing({
      sellerProfileId: sellerProfile.id,
      title: input.title,
      categoryId: category.id,
      vertical,
    });

    if (duplicate) {
      throw new ConflictError("Похоже, такое объявление уже было создано недавно.");
    }

    const listing = await prisma.listing.create({
      data: {
        seller_profile_id: sellerProfile.id,
        category_id: category.id,
        region_id: city.region_id,
        city_id: city.id,
        brand_id: brand?.id ?? null,
        title: input.title,
        slug: slugifyTitle(input.title),
        short_id: generateShortId(),
        description: input.description,
        price: input.price,
        currency: input.currency,
        unit: input.unit,
        moq: input.moq,
        stock_quantity: input.stock_quantity ?? null,
        status: ListingStatus.PENDING_MODERATION,
        vertical,
        images: {
          create: input.image_urls.map((url, index) => ({
            url,
            sort_order: index,
          })),
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
        vertical: true,
        created_at: true,
      },
    });

    logger.info("Listing created", {
      listingId: listing.id,
      sellerId: sellerProfile.id,
      vertical: listing.vertical,
    });

    await createAuditLog({
      actorId: user.id,
      actorRole: user.role,
      action: "listing.create",
      targetType: "listing",
      targetId: listing.id,
      metadata: {
        vertical: listing.vertical,
        status: listing.status,
      },
    });

    return jsonData({ listing }, 201);
  });
}
