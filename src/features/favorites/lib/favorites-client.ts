import type { ListingCardData } from "@/features/listings/lib/listings-catalog";

type FavoriteToggleResponse = {
  listingId: string;
  favorited: boolean;
};

type FavoritesListResponse = {
  listings: ListingCardData[];
};

type ApiSuccessBody<T> = {
  data: T;
};

type ApiErrorBody = {
  error: {
    code: string;
    message: string;
  };
};

async function parseFavoriteResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as ApiSuccessBody<T> | ApiErrorBody;

  if (!response.ok) {
    const message =
      "error" in body && body.error.message ? body.error.message : "Request failed";
    throw new Error(message);
  }

  return (body as ApiSuccessBody<T>).data;
}

export async function addFavoriteRequest(listingId: string): Promise<FavoriteToggleResponse> {
  const response = await fetch(`/api/favorites/${listingId}`, {
    method: "POST",
  });

  return parseFavoriteResponse<FavoriteToggleResponse>(response);
}

export async function removeFavoriteRequest(listingId: string): Promise<FavoriteToggleResponse> {
  const response = await fetch(`/api/favorites/${listingId}`, {
    method: "DELETE",
  });

  return parseFavoriteResponse<FavoriteToggleResponse>(response);
}

export async function getFavoritesRequest(): Promise<FavoritesListResponse> {
  const response = await fetch("/api/favorites", {
    method: "GET",
    cache: "no-store",
  });

  return parseFavoriteResponse<FavoritesListResponse>(response);
}
