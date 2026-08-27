import type { ExtractedListingData } from "@/server/import/types";

export function hasMeaningfulLalafoFields(data: ExtractedListingData): boolean {
  const fields = data.fieldsFound;
  return Boolean(fields?.price || (fields?.images ?? 0) > 0 || fields?.description);
}
