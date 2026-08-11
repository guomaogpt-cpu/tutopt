import { requireAuth } from "@/features/auth/lib/session";
import { createUserReport } from "@/features/reports/lib/create-report";
import { createReportSchema } from "@/features/reports/validators/report.validators";
import { assertReportCreateRateLimit } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    assertReportCreateRateLimit(user.id);

    const input = await parseJsonBody(request, createReportSchema);
    const result = await createUserReport(user, input);

    return jsonData(result, 201);
  });
}
