import {
  ImportDraftStatus,
  ListingStatus,
  ListingUnit,
  type ListingVertical,
  Prisma,
} from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";
import { ensureSellerProfile } from "@/features/listings/lib/seller-profile";
import { generateShortId, slugifyTitle } from "@/features/listings/lib/slug";
import {
  LISTING_DESCRIPTION_MIN,
  LISTING_TITLE_MIN,
} from "@/features/listings/validators/listing.validators";
import type { ImportDraftImageList } from "@/features/import-drafts/types/import-draft";
import { validateListingContent } from "@/lib/moderation/content-checks";
import { NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

function parseImageJson(value: Prisma.JsonValue | null): ImportDraftImageList {
  if (!value || !Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

async function resolveCategoryId(params: {
  normalizedCategory: string | null;
  normalizedSubcategory: string | null;
}): Promise<{ categoryId: string; vertical: ListingVertical }> {
  const slugCandidates = [params.normalizedSubcategory, params.normalizedCategory].filter(
    (value): value is string => Boolean(value),
  );

  for (const slug of slugCandidates) {
    const category = await prisma.category.findFirst({
      where: {
        is_active: true,
        OR: [{ slug }, { slug: slug.replace(/\s+/g, "-") }],
      },
    });

    if (category) {
      return { categoryId: category.id, vertical: category.vertical };
    }
  }

  if (params.normalizedCategory) {
    const byName = await prisma.category.findFirst({
      where: {
        is_active: true,
        name: { equals: params.normalizedCategory, mode: "insensitive" },
      },
    });

    if (byName) {
      return { categoryId: byName.id, vertical: byName.vertical };
    }
  }

  throw new ValidationError("Укажите категорию перед публикацией.", {
    fieldErrors: {
      category: ["Категория не найдена. Проверьте slug или название."],
    },
  });
}

async function resolveCityId(cityName: string | null): Promise<{
  cityId: string;
  regionId: string;
}> {
  if (!cityName) {
    throw new ValidationError("Укажите город перед публикацией.", {
      fieldErrors: {
        city: ["Город обязателен для публикации"],
      },
    });
  }

  const city = await prisma.city.findFirst({
    where: {
      is_active: true,
      OR: [
        { name: { equals: cityName, mode: "insensitive" } },
        { slug: cityName.toLowerCase().replace(/\s+/g, "-") },
      ],
    },
    select: { id: true, region_id: true },
  });

  if (!city) {
    throw new ValidationError("Город не найден. Проверьте название.", {
      fieldErrors: {
        city: ["Выберите существующий город из справочника"],
      },
    });
  }

  return { cityId: city.id, regionId: city.region_id };
}

export async function publishImportDraft(params: {
  draftId: string;
  staff: PublicUser;
}): Promise<{ listingId: string; draftId: string }> {
  const draft = await prisma.importedListingDraft.findUnique({
    where: { id: params.draftId },
  });

  if (!draft) {
    throw new NotFoundError("Import draft not found");
  }

  if (draft.status === ImportDraftStatus.PUBLISHED) {
    throw new ValidationError("Черновик уже опубликован.");
  }

  if (draft.status === ImportDraftStatus.REJECTED || draft.status === ImportDraftStatus.DUPLICATE) {
    throw new ValidationError("Нельзя опубликовать отклонённый или дублирующий черновик.");
  }

  if (
    draft.status !== ImportDraftStatus.READY &&
    draft.status !== ImportDraftStatus.PENDING_REVIEW
  ) {
    throw new ValidationError("Черновик не готов к публикации.");
  }

  const title = draft.normalized_title ?? draft.raw_title;
  const description = draft.normalized_description ?? draft.raw_description ?? "";

  if (!title || title.trim().length < LISTING_TITLE_MIN) {
    throw new ValidationError("Заголовок обязателен и должен быть не короче 5 символов.");
  }

  const safeDescription =
    description.trim().length >= LISTING_DESCRIPTION_MIN
      ? description.trim()
      : `${description.trim()}\n\nИмпортировано через админ-панель.`.trim();

  const contentIssues = validateListingContent({
    title,
    description: safeDescription,
  });

  if (contentIssues.length > 0) {
    throw new ValidationError(contentIssues[0]?.message ?? "Проверьте текст объявления.");
  }

  const { categoryId, vertical } = await resolveCategoryId({
    normalizedCategory: draft.normalized_category,
    normalizedSubcategory: draft.normalized_subcategory,
  });

  const cityName = draft.normalized_city ?? draft.raw_city;
  const { cityId, regionId } = await resolveCityId(cityName);

  const sellerProfile = await ensureSellerProfile(params.staff);

  const images = parseImageJson(draft.normalized_images ?? draft.raw_images);
  const price = draft.normalized_price ?? new Prisma.Decimal(0);
  const priceNegotiable = draft.normalized_price === null;

  const listing = await prisma.$transaction(async (tx) => {
    const created = await tx.listing.create({
      data: {
        seller_profile_id: sellerProfile.id,
        category_id: categoryId,
        region_id: regionId,
        city_id: cityId,
        title,
        slug: slugifyTitle(title),
        short_id: generateShortId(),
        description: safeDescription,
        price,
        currency: draft.normalized_currency ?? "KGS",
        price_negotiable: priceNegotiable,
        unit: ListingUnit.PIECE,
        moq: 1,
        status: ListingStatus.PENDING_MODERATION,
        vertical,
        posted_as_company: false,
        ...(images.length > 0
          ? {
              images: {
                create: images.map((url, index) => ({
                  url,
                  sort_order: index,
                })),
              },
            }
          : {}),
      },
      select: { id: true },
    });

    await tx.importedListingDraft.update({
      where: { id: draft.id },
      data: {
        status: ImportDraftStatus.PUBLISHED,
        published_listing_id: created.id,
        published_at: new Date(),
        reviewed_by_id: params.staff.id,
        reviewed_at: new Date(),
      },
    });

    return created;
  });

  return { listingId: listing.id, draftId: draft.id };
}
