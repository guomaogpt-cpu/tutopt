import type { ImportDraftStatus } from "@prisma/client";

export const IMPORT_SOURCE_PLATFORMS = [
  "MANUAL",
  "LALAFO",
  "INSTAGRAM",
  "WEBSITE",
  "SCREENSHOT",
  "OTHER",
] as const;

export type ImportSourcePlatform = (typeof IMPORT_SOURCE_PLATFORMS)[number];

export type ImportDraftImageList = string[];

export type ImportDraftRow = {
  id: string;
  sourcePlatform: string;
  sourceUrl: string | null;
  rawTitle: string | null;
  rawDescription: string | null;
  rawPrice: string | null;
  rawCurrency: string | null;
  rawCity: string | null;
  rawImages: ImportDraftImageList;
  rawContact: string | null;
  normalizedTitle: string | null;
  normalizedDescription: string | null;
  normalizedPrice: string | null;
  normalizedCurrency: string | null;
  normalizedCity: string | null;
  normalizedCategory: string | null;
  normalizedSubcategory: string | null;
  normalizedImages: ImportDraftImageList;
  notes: string | null;
  status: ImportDraftStatus;
  duplicateOfListingId: string | null;
  publishedListingId: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  publishedAt: string | null;
  warnings?: string[];
};

export type ImportDraftDuplicateResult = {
  isDefiniteDuplicate: boolean;
  duplicateListingId: string | null;
  duplicateDraftId: string | null;
  warnings: string[];
};
