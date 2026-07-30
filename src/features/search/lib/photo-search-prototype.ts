import { ListingStatus, type ListingVertical, type Prisma } from "@prisma/client";
import { formatListingCardPrice } from "@/features/listings/lib/listing-display";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import {
  PHOTO_SEARCH_API_LIMIT,
  type PhotoSearchResultItem,
} from "@/features/search/lib/photo-search-types";
import { buildNotExpiredListingFilter } from "@/lib/listings/listing-expiration";
import { prisma } from "@/shared/lib/prisma";

const STOP_WORDS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "img",
  "image",
  "photo",
  "foto",
  "фото",
  "сүрөт",
  "the",
  "and",
  "для",
  "или",
  "это",
  "что",
]);

/**
 * Hybrid photo-search prototype.
 * Does NOT analyze image pixels (no AI / embeddings / OCR / vector DB).
 * Uses optional queryHint, filename tokens, vertical, and category for ranking.
 * Uploaded file is validated by the route and discarded.
 */
export async function searchPhotoHybridPrototype(input: {
  vertical: ListingVertical | null;
  categoryId: string | null;
  queryHint: string | null;
  fileName: string | null;
  limit?: number;
}): Promise<PhotoSearchResultItem[]> {
  const limit = Math.max(1, Math.min(input.limit ?? PHOTO_SEARCH_API_LIMIT, 24));
  const tokens = collectSearchTokens(input.queryHint, input.fileName);

  const where: Prisma.ListingWhereInput = {
    status: ListingStatus.PUBLISHED,
    AND: [buildNotExpiredListingFilter()],
    images: { some: {} },
    ...(input.vertical ? { vertical: input.vertical } : {}),
  };

  // Fetch a wider candidate set, then score in memory.
  const rows = await prisma.listing.findMany({
    where,
    orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
    take: Math.max(limit * 4, 48),
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      currency: true,
      vertical: true,
      published_at: true,
      created_at: true,
      category: { select: { id: true, name: true } },
      city: { select: { name: true } },
      images: {
        orderBy: { sort_order: "asc" },
        take: 1,
        select: { url: true },
      },
    },
  });

  const scored = rows
    .map((row) => {
      const haystack = [
        row.title,
        row.description,
        row.category.name,
        row.city?.name ?? "",
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;

      if (row.images.length > 0) {
        score += 20;
      }

      if (input.vertical && row.vertical === input.vertical) {
        score += 40;
      }

      if (input.categoryId && row.category.id === input.categoryId) {
        score += 50;
      }

      for (const token of tokens) {
        if (row.title.toLowerCase().includes(token)) {
          score += 30;
        }
        if (row.category.name.toLowerCase().includes(token)) {
          score += 20;
        }
        if ((row.city?.name ?? "").toLowerCase().includes(token)) {
          score += 10;
        }
        if (row.description.toLowerCase().includes(token)) {
          score += 8;
        }
        if (haystack.includes(token)) {
          score += 2;
        }
      }

      const publishedAt = row.published_at ?? row.created_at;
      const ageHours = Math.max(
        0,
        (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60),
      );
      // Mild recency boost for newer listings.
      score += Math.max(0, 15 - Math.min(ageHours / 24, 15));

      return { row, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const aDate = a.row.published_at ?? a.row.created_at;
      const bDate = b.row.published_at ?? b.row.created_at;
      return bDate.getTime() - aDate.getTime();
    })
    .slice(0, limit);

  return scored.map(({ row }) => {
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

export function collectSearchTokens(
  queryHint: string | null,
  fileName: string | null,
): string[] {
  const parts: string[] = [];

  if (queryHint?.trim()) {
    parts.push(queryHint);
  }

  if (fileName?.trim()) {
    const base = fileName
      .replace(/\.[^.]+$/, "")
      .replace(/[_+.\-]+/g, " ")
      .replace(/\d{4,}/g, " ");
    parts.push(base);
  }

  const tokens = parts
    .join(" ")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));

  return [...new Set(tokens)].slice(0, 12);
}

export function buildPhotoSearchExplanation(input: {
  hasQueryHint: boolean;
  hasVertical: boolean;
  hasCategory: boolean;
}): string {
  const parts = [
    "hybrid-prototype",
    "visualSearch=false",
    "public listings with photos",
  ];

  if (input.hasVertical) {
    parts.push("vertical filter");
  }
  if (input.hasCategory) {
    parts.push("category boost");
  }
  if (input.hasQueryHint) {
    parts.push("text relevance from queryHint/filename");
  } else {
    parts.push("recency fallback without queryHint");
  }

  return parts.join("; ");
}
