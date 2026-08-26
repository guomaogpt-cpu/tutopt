import { requireStaff } from "@/features/admin/lib/require-admin";
import { serializeImportDraft } from "@/features/import-drafts/lib/import-draft-serializer";
import { updateImportDraftRecord } from "@/features/import-drafts/lib/import-draft-service";
import { updateImportDraftSchema } from "@/features/import-drafts/validators/import-draft.validators";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { NotFoundError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    await requireStaff();
    const { id } = await context.params;

    const draft = await prisma.importedListingDraft.findUnique({
      where: { id },
    });

    if (!draft) {
      throw new NotFoundError("Import draft not found");
    }

    return jsonData({ draft: serializeImportDraft(draft) });
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const { id } = await context.params;
    const input = await parseJsonBody(request, updateImportDraftSchema);
    const draft = await updateImportDraftRecord({ draftId: id, input, staff });
    return jsonData({ draft });
  });
}
