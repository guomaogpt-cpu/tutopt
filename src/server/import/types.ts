import type { ImportSourcePlatform } from "@/features/import-drafts/types/import-draft";

export type ExtractedFieldsFound = {
  title: boolean;
  description: boolean;
  images: number;
  price: boolean;
};

export type ExtractedListingData = {
  sourcePlatform: ImportSourcePlatform;
  sourceUrl: string;
  sourceExternalId: string | null;
  title: string | null;
  description: string | null;
  rawPrice: string | null;
  currency: string | null;
  city: string | null;
  categoryText: string | null;
  subcategoryText: string | null;
  breadcrumbSlugs?: string[];
  images: string[];
  rawContact: string | null;
  partial?: boolean;
  fieldsFound?: ExtractedFieldsFound;
};

export type ExtractedListingResult =
  | { ok: true; data: ExtractedListingData }
  | { ok: false; error: string; code?: string };
