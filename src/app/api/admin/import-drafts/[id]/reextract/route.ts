import { requireStaff } from "@/features/admin/lib/require-admin";
import { reextractImportDraft } from "@/server/import/import-by-url-service";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const { id } = await context.params;
    const result = await reextractImportDraft({ draftId: id, staff });
    return jsonData(result);
  });
}
