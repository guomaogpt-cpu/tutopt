import { requireStaff } from "@/features/admin/lib/require-admin";
import { createImportDraftRecord } from "@/features/import-drafts/lib/import-draft-service";
import { createImportDraftSchema } from "@/features/import-drafts/validators/import-draft.validators";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const input = await parseJsonBody(request, createImportDraftSchema);
    const draft = await createImportDraftRecord({ input, staff });
    return jsonData({ draft }, 201);
  });
}
