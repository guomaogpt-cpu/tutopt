import { requireStaff } from "@/features/admin/lib/require-admin";
import { createImportBatch } from "@/features/import-batches/lib/create-import-batch";
import {
  createBulkImportSchema,
  parseBulkImportUrls,
} from "@/features/import-batches/validators/import-batch.validators";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const input = await parseJsonBody(request, createBulkImportSchema);
    const urls = parseBulkImportUrls(input.urlsText);
    const batch = await createImportBatch({
      urls,
      sourcePlatform: input.sourcePlatform,
      staff,
    });

    return jsonData({ batch }, 201);
  });
}
