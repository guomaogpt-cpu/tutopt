import type { ListingVertical } from "@prisma/client";
import {
  EMPTY_SEARCH_SUGGEST_RESPONSE,
  type SearchSuggestResponse,
} from "@/features/search/lib/search-suggest-types";

type ApiSuccessBody<T> = {
  data: T;
};

type ApiErrorBody = {
  error: {
    message: string;
  };
};

export async function fetchSearchSuggestions(
  query: string,
  signal?: AbortSignal,
  vertical?: ListingVertical | null,
): Promise<SearchSuggestResponse> {
  const trimmed = query.trim();

  if (!trimmed) {
    return EMPTY_SEARCH_SUGGEST_RESPONSE;
  }

  const params = new URLSearchParams({ q: trimmed });
  if (vertical) {
    params.set("vertical", vertical);
  }

  const response = await fetch(`/api/search/suggest?${params.toString()}`, {
    cache: "no-store",
    signal,
    headers: {
      "Cache-Control": "no-cache",
    },
  });

  const body = (await response.json()) as ApiSuccessBody<SearchSuggestResponse> | ApiErrorBody;

  if (!response.ok) {
    const message =
      "error" in body && body.error.message ? body.error.message : "Не удалось загрузить подсказки";
    throw new Error(message);
  }

  return (body as ApiSuccessBody<SearchSuggestResponse>).data;
}
