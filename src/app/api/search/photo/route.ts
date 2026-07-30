import { z } from "zod";
import { jsonDataNoStore, withApiHandler } from "@/shared/lib/api-route";
import { ValidationError } from "@/shared/lib/errors";
import {
  buildPhotoSearchExplanation,
  searchPhotoHybridPrototype,
} from "@/features/search/lib/photo-search-prototype";
import {
  PHOTO_SEARCH_ACCEPTED_TYPES,
  PHOTO_SEARCH_API_LIMIT,
  PHOTO_SEARCH_MAX_BYTES,
  PHOTO_SEARCH_QUERY_HINT_MAX,
  type PhotoSearchResponse,
} from "@/features/search/lib/photo-search-types";
import { parseListingVerticalParam } from "@/features/verticals/verticals";

export const dynamic = "force-dynamic";

const ACCEPTED = new Set<string>(PHOTO_SEARCH_ACCEPTED_TYPES);
const categoryIdSchema = z.string().uuid();

export async function POST(request: Request) {
  return withApiHandler(async () => {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      throw new ValidationError("Invalid form data");
    }

    const image = formData.get("image");
    if (!(image instanceof File) || image.size === 0) {
      throw new ValidationError("PHOTO_MISSING");
    }

    if (!ACCEPTED.has(image.type)) {
      throw new ValidationError("PHOTO_INVALID_TYPE");
    }

    if (image.size > PHOTO_SEARCH_MAX_BYTES) {
      throw new ValidationError("PHOTO_TOO_LARGE");
    }

    // Prototype: validate only — do not persist the upload.
    await image.slice(0, 1).arrayBuffer().catch(() => undefined);

    const vertical = parseListingVerticalParam(
      typeof formData.get("vertical") === "string"
        ? String(formData.get("vertical"))
        : null,
    );

    const rawCategory =
      typeof formData.get("category") === "string"
        ? String(formData.get("category")).trim()
        : "";
    const categoryParsed = categoryIdSchema.safeParse(rawCategory);
    const categoryId = categoryParsed.success ? categoryParsed.data : null;

    const rawHint =
      typeof formData.get("queryHint") === "string"
        ? String(formData.get("queryHint")).trim()
        : "";
    const queryHint =
      rawHint.length > 0 ? rawHint.slice(0, PHOTO_SEARCH_QUERY_HINT_MAX) : null;

    const fileName = image.name?.trim() ? image.name.trim() : null;

    const items = await searchPhotoHybridPrototype({
      vertical,
      categoryId,
      queryHint,
      fileName,
      limit: PHOTO_SEARCH_API_LIMIT,
    });

    const payload: PhotoSearchResponse = {
      ok: true,
      mode: "hybrid-prototype",
      visualSearch: false,
      prototype: true,
      items,
      results: items,
      total: items.length,
      explanation: buildPhotoSearchExplanation({
        hasQueryHint: Boolean(queryHint) || Boolean(fileName),
        hasVertical: Boolean(vertical),
        hasCategory: Boolean(categoryId),
      }),
      queryHint,
      vertical,
      categoryId,
    };

    return jsonDataNoStore(payload);
  });
}
