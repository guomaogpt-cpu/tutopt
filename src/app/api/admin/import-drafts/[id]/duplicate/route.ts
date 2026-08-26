import { ImportDraftStatus } from "@prisma/client";
import { requireStaff } from "@/features/admin/lib/require-admin";
import { setImportDraftStatus } from "@/features/import-drafts/lib/import-draft-service";
import { markDuplicateImportDraftSchema } from "@/features/import-drafts/validators/import-draft.validators";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const { id } = await context.params;
    const input = await parseJsonBody(request, markDuplicateImportDraftSchema);
    const draft = await setImportDraftStatus({
      draftId: id,
      status: ImportDraftStatus.DUPLICATE,
      staff,
      duplicateOfListingId: input.duplicateOfListingId,
    });
    return jsonData({ draft });
  });
}
