import type { ImportSourcePlatform } from "@/features/import-drafts/types/import-draft";
import { extractInstagramListing } from "@/server/import/extractors/instagram";
import { extractLalafoListing } from "@/server/import/extractors/lalafo";
import { extractWebsiteListing } from "@/server/import/extractors/website";
import type { ExtractedListingResult } from "@/server/import/types";

export function extractListingFromHtml(params: {
  platform: ImportSourcePlatform;
  html: string;
  finalUrl: string;
}): ExtractedListingResult {
  switch (params.platform) {
    case "LALAFO":
      return extractLalafoListing(params.html, params.finalUrl);
    case "INSTAGRAM":
      return extractInstagramListing(params.html, params.finalUrl);
    case "WEBSITE":
    case "OTHER":
    case "MANUAL":
    case "SCREENSHOT":
    default:
      return extractWebsiteListing(params.html, params.finalUrl);
  }
}
