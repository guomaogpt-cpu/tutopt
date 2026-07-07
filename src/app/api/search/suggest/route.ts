import { jsonDataNoStore, withApiHandler } from "@/shared/lib/api-route";
import { getSearchSuggestions } from "@/features/search/lib/search-suggest-data";
import { EMPTY_SEARCH_SUGGEST_RESPONSE } from "@/features/search/lib/search-suggest-types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return withApiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") ?? "").trim();

    if (!query) {
      return jsonDataNoStore(EMPTY_SEARCH_SUGGEST_RESPONSE);
    }

    const suggestions = await getSearchSuggestions(query);
    return jsonDataNoStore(suggestions);
  });
}
