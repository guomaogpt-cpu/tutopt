import { jsonDataNoStore, withApiHandler } from "@/shared/lib/api-route";
import { getSearchSuggestions } from "@/features/search/lib/search-suggest-data";
import { EMPTY_SEARCH_SUGGEST_RESPONSE } from "@/features/search/lib/search-suggest-types";
import { parseListingVerticalParam } from "@/features/verticals/verticals";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return withApiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") ?? "").trim();
    const vertical = parseListingVerticalParam(searchParams.get("vertical"));

    if (!query) {
      return jsonDataNoStore(EMPTY_SEARCH_SUGGEST_RESPONSE);
    }

    const suggestions = await getSearchSuggestions(query, vertical);
    return jsonDataNoStore(suggestions);
  });
}
