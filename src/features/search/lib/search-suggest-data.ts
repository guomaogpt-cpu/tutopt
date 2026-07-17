import { ListingStatus, type ListingVertical } from "@prisma/client";
import { buildNotExpiredListingFilter } from "@/lib/listings/listing-expiration";
import { formatListingPrice } from "@/features/listings/lib/format-listing-price";
import {
  EMPTY_SEARCH_SUGGEST_RESPONSE,
  SEARCH_SUGGEST_LIMITS,
  SEARCH_SUGGEST_MIN_LENGTH,
  type SearchSuggestResponse,
} from "@/features/search/lib/search-suggest-types";
import { prisma } from "@/shared/lib/prisma";

function buildContainsFilter(query: string) {
  return { contains: query, mode: "insensitive" as const };
}

export async function getSearchSuggestions(
  query: string,
  vertical: ListingVertical | null = null,
): Promise<SearchSuggestResponse> {
  const trimmed = query.trim();

  if (trimmed.length < SEARCH_SUGGEST_MIN_LENGTH) {
    return EMPTY_SEARCH_SUGGEST_RESPONSE;
  }

  const contains = buildContainsFilter(trimmed);
  const verticalFilter = vertical ? { vertical } : {};
  const notExpired = buildNotExpiredListingFilter();

  const [listings, categories, brands, sellers] = await Promise.all([
    prisma.listing.findMany({
      where: {
        status: ListingStatus.PUBLISHED,
        ...verticalFilter,
        AND: [notExpired],
        OR: [
          { title: contains },
          { description: contains },
          { category: { name: contains } },
          { brand: { name: contains } },
          { sellerProfile: { company_name: contains } },
        ],
      },
      orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
      take: SEARCH_SUGGEST_LIMITS.listings,
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        images: {
          orderBy: { sort_order: "asc" },
          take: 1,
          select: { url: true },
        },
      },
    }),
    prisma.category.findMany({
      where: {
        is_active: true,
        name: contains,
        ...verticalFilter,
      },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      take: SEARCH_SUGGEST_LIMITS.categories,
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.brand.findMany({
      where: {
        is_active: true,
        name: contains,
      },
      orderBy: { name: "asc" },
      take: SEARCH_SUGGEST_LIMITS.brands,
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.sellerProfile.findMany({
      where: {
        company_name: contains,
        listings: {
          some: {
            status: ListingStatus.PUBLISHED,
            ...verticalFilter,
            AND: [notExpired],
          },
        },
      },
      orderBy: { company_name: "asc" },
      take: SEARCH_SUGGEST_LIMITS.sellers,
      select: {
        id: true,
        company_name: true,
      },
    }),
  ]);

  return {
    listings: listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      imageUrl: listing.images[0]?.url ?? null,
      priceLabel: formatListingPrice(listing.price, listing.currency),
    })),
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
    })),
    brands: brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
    })),
    sellers: sellers.map((seller) => ({
      id: seller.id,
      companyName: seller.company_name,
    })),
  };
}
