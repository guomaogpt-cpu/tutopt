import { requireAuth } from "@/features/auth/lib/session";
import { createUserReport } from "@/features/reports/lib/create-report";
import { listingReportSchema } from "@/features/reports/validators/report.validators";
import { assertReportCreateRateLimit } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { isUuid } from "@/shared/lib/is-uuid";
import { ValidationError } from "@/shared/lib/errors";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const { id } = await context.params;

    if (!isUuid(id)) {
      throw new ValidationError("Некорректное объявление");
    }

    assertReportCreateRateLimit(user.id);

    const input = await parseJsonBody(request, listingReportSchema);
    await createUserReport(user, {
      listingId: id,
      reason: input.reason,
      message: input.message,
    });

    return jsonData({
      ok: true,
      message: "Жалоба отправлена. Мы проверим объявление.",
    });
  });
}
