import { requireStaff } from "@/features/admin/lib/require-admin";
import { processImportBatch } from "@/features/import-batches/lib/process-import-batch";
import { processImportBatchSchema } from "@/features/import-batches/validators/import-batch.validators";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const { id } = await context.params;

    let limit: number | undefined;
    try {
      const input = await parseJsonBody(request, processImportBatchSchema);
      limit = input.limit;
    } catch {
      limit = undefined;
    }

    const batch = await processImportBatch({
      batchId: id,
      staff,
      limit,
    });

    return jsonData({ batch });
  });
}
