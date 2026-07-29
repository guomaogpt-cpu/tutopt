import { jsonDataNoStore, withApiHandler } from "@/shared/lib/api-route";
import { ValidationError } from "@/shared/lib/errors";
import { searchPhotoPrototype } from "@/features/search/lib/photo-search-prototype";
import {
  PHOTO_SEARCH_ACCEPTED_TYPES,
  PHOTO_SEARCH_MAX_BYTES,
  type PhotoSearchResponse,
} from "@/features/search/lib/photo-search-types";
import { parseListingVerticalParam } from "@/features/verticals/verticals";

export const dynamic = "force-dynamic";

const ACCEPTED = new Set<string>(PHOTO_SEARCH_ACCEPTED_TYPES);

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
    // Consume a tiny slice so the stream is acknowledged, then drop.
    await image.slice(0, 1).arrayBuffer().catch(() => undefined);

    const vertical = parseListingVerticalParam(
      typeof formData.get("vertical") === "string"
        ? String(formData.get("vertical"))
        : null,
    );

    const results = await searchPhotoPrototype({
      vertical,
      limit: 12,
    });

    const payload: PhotoSearchResponse = {
      prototype: true,
      results,
      total: results.length,
    };

    return jsonDataNoStore(payload);
  });
}
