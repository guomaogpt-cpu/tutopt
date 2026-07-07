"use client";

import { SearchWithSuggest, type SearchWithSuggestProps } from "@/components/search/SearchWithSuggest";

type HomeHeroSearchProps = Omit<SearchWithSuggestProps, "variant">;

export function HomeHeroSearch(props: HomeHeroSearchProps) {
  return <SearchWithSuggest variant="hero" {...props} />;
}
