export const SEARCH_SUGGEST_MIN_LENGTH = 2;
export const SEARCH_SUGGEST_DEBOUNCE_MS = 300;

export const SEARCH_SUGGEST_LIMITS = {
  listings: 4,
  categories: 2,
  brands: 2,
  sellers: 2,
} as const;

export type SearchSuggestListing = {
  id: string;
  title: string;
  imageUrl: string | null;
  priceLabel: string;
};

export type SearchSuggestCategory = {
  id: string;
  name: string;
};

export type SearchSuggestBrand = {
  id: string;
  name: string;
};

export type SearchSuggestSeller = {
  id: string;
  companyName: string;
};

export type SearchSuggestResponse = {
  listings: SearchSuggestListing[];
  categories: SearchSuggestCategory[];
  brands: SearchSuggestBrand[];
  sellers: SearchSuggestSeller[];
};

export const EMPTY_SEARCH_SUGGEST_RESPONSE: SearchSuggestResponse = {
  listings: [],
  categories: [],
  brands: [],
  sellers: [],
};

export function hasSearchSuggestions(response: SearchSuggestResponse): boolean {
  return (
    response.listings.length > 0 ||
    response.categories.length > 0 ||
    response.brands.length > 0 ||
    response.sellers.length > 0
  );
}
