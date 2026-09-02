import { requireStaff } from "@/features/admin/lib/require-admin";
import { importListingDraftFromBrowserPage } from "@/server/import/import-by-url-service";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const payload = await request.json();
    const result = await importListingDraftFromBrowserPage({ payload, staff });
    return jsonData(result, 201);
  });
}
