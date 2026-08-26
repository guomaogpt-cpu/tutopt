import { Prisma } from "@prisma/client";
import {
  LISTING_DESCRIPTION_MAX,
  LISTING_TITLE_MAX,
} from "@/features/listings/validators/listing.validators";
import type { ImportDraftImageList } from "@/features/import-drafts/types/import-draft";

export type RawImportDraftFields = {
  sourceUrl?: string | null;
  title?: string | null;
  description?: string | null;
  price?: string | null;
  currency?: string | null;
  city?: string | null;
  category?: string | null;
  subcategory?: string | null;
  imageUrlsText?: string | null;
};

export type NormalizedImportDraftFields = {
  sourceUrl: string | null;
  normalizedTitle: string | null;
  normalizedDescription: string | null;
  normalizedPrice: Prisma.Decimal | null;
  normalizedCurrency: string | null;
  normalizedCity: string | null;
  normalizedCategory: string | null;
  normalizedSubcategory: string | null;
  normalizedImages: ImportDraftImageList;
  rawImages: ImportDraftImageList;
};

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }
  return value.slice(0, maxLength).trim();
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseImageUrlsFromTextarea(value: string | null | undefined): ImportDraftImageList {
  if (!value) {
    return [];
  }

  const urls: string[] = [];

  for (const line of value.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    if (isValidHttpUrl(trimmed)) {
      urls.push(trimmed);
    }
  }

  return urls.slice(0, 10);
}

function normalizePriceString(value: string | null | undefined): Prisma.Decimal | null {
  if (!value) {
    return null;
  }

  const cleaned = value
    .replace(/\s/g, "")
    .replace(/,/g, ".")
    .replace(/[^\d.]/g, "");

  if (!cleaned) {
    return null;
  }

  const parsed = Number.parseFloat(cleaned);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return new Prisma.Decimal(parsed.toFixed(2));
}

function normalizeCurrency(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const upper = value.trim().toUpperCase();
  if (upper.length === 3) {
    return upper;
  }

  if (upper === "СОМ" || upper === "SOM") {
    return "KGS";
  }

  return null;
}

function normalizeSlugLike(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = collapseWhitespace(value);
  return trimmed.length > 0 ? trimmed.toLowerCase() : null;
}

export function normalizeImportDraftFields(
  input: RawImportDraftFields,
): NormalizedImportDraftFields {
  const sourceUrl =
    input.sourceUrl && isValidHttpUrl(input.sourceUrl.trim()) ? input.sourceUrl.trim() : null;

  const normalizedTitle = input.title
    ? truncate(collapseWhitespace(input.title), LISTING_TITLE_MAX)
    : null;

  const normalizedDescription = input.description
    ? truncate(collapseWhitespace(input.description), LISTING_DESCRIPTION_MAX)
    : null;

  const normalizedCity = input.city ? collapseWhitespace(input.city) : null;
  const normalizedCategory = normalizeSlugLike(input.category);
  const normalizedSubcategory = normalizeSlugLike(input.subcategory);
  const rawImages = parseImageUrlsFromTextarea(input.imageUrlsText);

  return {
    sourceUrl,
    normalizedTitle,
    normalizedDescription,
    normalizedPrice: normalizePriceString(input.price),
    normalizedCurrency: normalizeCurrency(input.currency) ?? "KGS",
    normalizedCity,
    normalizedCategory,
    normalizedSubcategory,
    normalizedImages: rawImages,
    rawImages,
  };
}

export function isImportDraftReadyForReview(fields: {
  normalizedTitle: string | null;
  normalizedCategory: string | null;
  normalizedSubcategory: string | null;
  normalizedCity: string | null;
  rawCity: string | null;
}): boolean {
  const hasCategory = Boolean(fields.normalizedCategory || fields.normalizedSubcategory);
  const hasCity = Boolean(fields.normalizedCity || fields.rawCity);
  return Boolean(fields.normalizedTitle && hasCategory && hasCity);
}
