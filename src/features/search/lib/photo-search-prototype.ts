import { ListingStatus, type ListingVertical } from "@prisma/client";
import { formatListingCardPrice } from "@/features/listings/lib/listing-display";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import type { PhotoSearchResultItem } from "@/features/search/lib/photo-search-types";
import { prisma } from "@/shared/lib/prisma";

/**
 * Prototype photo search: returns recent published listings that have images.
 * Does NOT analyze image content (no AI / embeddings / OCR).
 * The uploaded file is validated by the route and discarded.
 */
export async function searchPhotoPrototype(input: {
  vertical: ListingVertical | null;
  limit: number;
}): Promise<PhotoSearchResultItem[]> {
  const rows = await prisma.listing.findMany({
    where: {
      status: ListingStatus.PUBLISHED,
      ...(input.vertical ? { vertical: input.vertical } : {}),
      images: { some: {} },
    },
    orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
    take: Math.max(1, Math.min(input.limit, 24)),
    select: {
      id: true,
      title: true,
      price: true,
      currency: true,
      vertical: true,
      city: { select: { name: true } },
      images: {
        orderBy: { sort_order: "asc" },
        take: 1,
        select: { url: true },
      },
    },
  });

  return rows.map((row) => {
    const rawImage = row.images[0]?.url ?? null;
    return {
      id: row.id,
      title: row.title,
      priceLabel: formatListingCardPrice({
        price: row.price,
        currency: row.currency,
        vertical: row.vertical,
      }),
      city: row.city?.name ?? null,
      vertical: row.vertical,
      imageUrl: rawImage ? normalizeListingImageUrl(rawImage) : null,
    };
  });
}
