import { requireStaff } from "@/features/admin/lib/require-admin";
import { importByUrlSchema } from "@/features/import-drafts/validators/import-draft.validators";
import { importListingDraftFromUrl } from "@/server/import/import-by-url-service";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const input = await parseJsonBody(request, importByUrlSchema);
    const result = await importListingDraftFromUrl({
      url: input.url,
      sourcePlatform: input.sourcePlatform,
      staff,
    });

    return jsonData(
      {
        ...result,
        debug: result.debug,
      },
      result.duplicate ? 200 : 201,
    );
  });
}
