import { requireStaff } from "@/features/admin/lib/require-admin";
import { getImportBatchDetail } from "@/features/import-batches/lib/process-import-batch";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    await requireStaff();
    const { id } = await context.params;
    const batch = await getImportBatchDetail(id);
    return jsonData({ batch });
  });
}
