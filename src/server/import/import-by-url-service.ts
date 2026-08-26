import { ImportDraftStatus, Prisma } from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";
import { checkImportDraftDuplicates } from "@/features/import-drafts/lib/duplicate-check";
import {
  buildImportDraftCreateData,
  serializeImportDraft,
} from "@/features/import-drafts/lib/import-draft-serializer";
import {
  isImportDraftReadyForReview,
  normalizeImportDraftFields,
} from "@/features/import-drafts/lib/normalize-import-draft";
import { validateImportCategorySlugs } from "@/features/import-drafts/lib/resolve-import-category";
import type { ImportSourcePlatform } from "@/features/import-drafts/types/import-draft";
import { mapExternalCategory, parsePriceText } from "@/server/import/category-mapper";
import { detectImportPlatform } from "@/server/import/detect-platform";
import { extractListingFromHtml } from "@/server/import/extractors";
import { safeFetchImportPage, validateImportUrl } from "@/server/import/safe-fetch-url";
import { ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

export async function importListingDraftFromUrl(params: {
  url: string;
  sourcePlatform?: ImportSourcePlatform | null;
  staff: PublicUser;
}) {
  const parsedUrl = await validateImportUrl(params.url);
  const platform = detectImportPlatform(parsedUrl, params.sourcePlatform ?? null);
  const canonicalUrl = parsedUrl.toString();

  const existingDraft = await prisma.importedListingDraft.findFirst({
    where: { source_url: canonicalUrl },
    orderBy: { created_at: "desc" },
  });

  if (existingDraft) {
    return {
      draft: serializeImportDraft(existingDraft, ["Такой источник уже импортировался."]),
      autoExtracted: false,
      duplicate: true,
    };
  }

  const { finalUrl, html } = await safeFetchImportPage(canonicalUrl);
  const extracted = extractListingFromHtml({
    platform,
    html,
    finalUrl,
  });

  if (!extracted.ok) {
    throw new ValidationError(extracted.error);
  }

  const mappedCategory = mapExternalCategory({
    categoryText: extracted.data.categoryText,
    subcategoryText: extracted.data.subcategoryText,
    title: extracted.data.title,
    description: extracted.data.description,
    breadcrumbSlugs: extracted.data.breadcrumbSlugs,
  });

  const priceParsed = parsePriceText(extracted.data.rawPrice);

  const normalized = normalizeImportDraftFields({
    sourceUrl: extracted.data.sourceUrl,
    title: extracted.data.title,
    description: extracted.data.description,
    price: priceParsed.normalizedPrice ?? extracted.data.rawPrice,
    currency: extracted.data.currency ?? priceParsed.normalizedCurrency,
    city: extracted.data.city,
    category: mappedCategory.normalizedCategory,
    subcategory: mappedCategory.normalizedSubcategory,
    imageUrlsText: extracted.data.images.join("\n"),
  });

  const hasValidCategory = await validateImportCategorySlugs({
    normalizedCategory: normalized.normalizedCategory,
    normalizedSubcategory: normalized.normalizedSubcategory,
  });

  const duplicateCheck = await checkImportDraftDuplicates({
    sourceUrl: extracted.data.sourceUrl,
    sourceExternalId: extracted.data.sourceExternalId,
    title: normalized.normalizedTitle ?? extracted.data.title,
    price: priceParsed.rawPrice,
    city: normalized.normalizedCity ?? extracted.data.city,
  });

  let status: ImportDraftStatus = ImportDraftStatus.PENDING_REVIEW;
  if (duplicateCheck.isDefiniteDuplicate) {
    status = ImportDraftStatus.DUPLICATE;
  } else if (
    hasValidCategory &&
    isImportDraftReadyForReview({
      normalizedTitle: normalized.normalizedTitle,
      normalizedCategory: normalized.normalizedCategory,
      normalizedSubcategory: normalized.normalizedSubcategory,
      normalizedCity: normalized.normalizedCity,
      rawCity: extracted.data.city,
    })
  ) {
    status = ImportDraftStatus.READY;
  }

  const draft = await prisma.importedListingDraft.create({
    data: buildImportDraftCreateData({
      input: {
        sourcePlatform: extracted.data.sourcePlatform,
        sourceUrl: extracted.data.sourceUrl,
        sourceExternalId: extracted.data.sourceExternalId,
        title: extracted.data.title,
        description: extracted.data.description,
        price: extracted.data.rawPrice,
        currency: extracted.data.currency,
        city: extracted.data.city,
        category: mappedCategory.normalizedCategory,
        subcategory: mappedCategory.normalizedSubcategory,
        rawContact: extracted.data.rawContact,
        notes: "Данные получены автоматически по ссылке.",
      },
      normalized: {
        ...normalized,
        normalizedPrice: priceParsed.normalizedPrice
          ? new Prisma.Decimal(priceParsed.normalizedPrice)
          : normalized.normalizedPrice,
        normalizedCurrency: priceParsed.normalizedCurrency ?? normalized.normalizedCurrency,
      },
      status,
      createdById: params.staff.id,
      duplicateOfListingId: duplicateCheck.duplicateListingId,
    }),
  });

  const warnings = [...duplicateCheck.warnings];
  if (!hasValidCategory) {
    warnings.push("Укажите категорию перед публикацией.");
  }

  return {
    draft: serializeImportDraft(draft, warnings),
    autoExtracted: true,
  };
}
