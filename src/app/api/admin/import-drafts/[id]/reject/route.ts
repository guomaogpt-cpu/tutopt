import { ImportDraftStatus } from "@prisma/client";
import { requireStaff } from "@/features/admin/lib/require-admin";
import { setImportDraftStatus } from "@/features/import-drafts/lib/import-draft-service";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const { id } = await context.params;
    const draft = await setImportDraftStatus({
      draftId: id,
      status: ImportDraftStatus.REJECTED,
      staff,
    });
    return jsonData({ draft });
  });
}
