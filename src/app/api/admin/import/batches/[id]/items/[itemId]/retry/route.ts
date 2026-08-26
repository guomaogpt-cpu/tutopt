import { requireStaff } from "@/features/admin/lib/require-admin";
import { retryImportQueueItem } from "@/features/import-batches/lib/process-import-batch";
import { serializeImportQueueItem } from "@/features/import-batches/lib/import-batch-serializer";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";

type RouteContext = {
  params: Promise<{ id: string; itemId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const { id, itemId } = await context.params;
    const item = await retryImportQueueItem({
      batchId: id,
      itemId,
      staff,
    });

    return jsonData({ item: serializeImportQueueItem(item) });
  });
}
