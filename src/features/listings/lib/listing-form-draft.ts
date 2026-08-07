import type { ListingUnit, ListingVertical } from "@prisma/client";
import type { CharacteristicValuesState } from "@/features/listings/lib/listing-characteristics";

export const LISTING_FORM_DRAFT_VERSION = 1;
export const LISTING_FORM_DRAFT_DEBOUNCE_MS = 800;

export type ListingFormDraft = {
  version: typeof LISTING_FORM_DRAFT_VERSION;
  savedAt: string;
  vertical: ListingVertical;
  categoryId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  moq: string;
  unit: ListingUnit;
  cityId: string;
  brandId: string;
  stockQuantity: string;
  priceNegotiable: boolean;
  postedAsCompany: boolean;
  imageUrls: string[];
  characteristicValues: CharacteristicValuesState;
  dismissedAutosuggestKeys: string[];
};

function draftStorageKey(userId: string): string {
  return `vsetut-listing-form-draft:${userId}`;
}

function isServerUploadUrl(url: string): boolean {
  return (
    url.startsWith("/api/uploads/listings/") || url.startsWith("/uploads/listings/")
  );
}

export function readListingFormDraft(userId: string): ListingFormDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(draftStorageKey(userId));
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as ListingFormDraft;
    if (parsed.version !== LISTING_FORM_DRAFT_VERSION) {
      return null;
    }

    if (!parsed.vertical || typeof parsed.title !== "string") {
      return null;
    }

    return {
      ...parsed,
      imageUrls: (parsed.imageUrls ?? []).filter(isServerUploadUrl),
    };
  } catch {
    return null;
  }
}

export function writeListingFormDraft(userId: string, draft: ListingFormDraft): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(draftStorageKey(userId), JSON.stringify(draft));
  } catch {
    // Storage full or unavailable — ignore silently.
  }
}

export function clearListingFormDraft(userId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(draftStorageKey(userId));
}

export function listingFormDraftHasContent(draft: ListingFormDraft): boolean {
  return Boolean(
    draft.title.trim() ||
      draft.description.trim() ||
      draft.categoryId ||
      draft.cityId ||
      draft.price.trim() ||
      draft.imageUrls.length > 0 ||
      Object.values(draft.characteristicValues ?? {}).some((value) => {
        if (!value || typeof value !== "object") {
          return false;
        }
        if ("text" in value && typeof value.text === "string") {
          return value.text.trim().length > 0;
        }
        if ("optionId" in value && typeof value.optionId === "string") {
          return value.optionId.length > 0;
        }
        if ("optionIds" in value && Array.isArray(value.optionIds)) {
          return value.optionIds.length > 0;
        }
        if ("enabled" in value) {
          return value.enabled !== null;
        }
        return false;
      }),
  );
}
