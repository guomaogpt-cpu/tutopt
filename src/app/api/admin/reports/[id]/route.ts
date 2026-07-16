import { ReportStatus } from "@prisma/client";
import { requireStaff } from "@/features/admin/lib/require-admin";
import { updateReportStatusSchema } from "@/features/reports/validators/report.validators";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const staff = await requireStaff();
    const { id } = await context.params;
    const input = await parseJsonBody(request, updateReportStatusSchema);

    const report = await prisma.report.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!report) {
      throw new NotFoundError("Жалоба не найдена");
    }

    if (report.status !== ReportStatus.OPEN) {
      throw new ValidationError("Жалоба уже обработана");
    }

    const nextStatus =
      input.action === "resolve" ? ReportStatus.RESOLVED : ReportStatus.DISMISSED;

    const updated = await prisma.report.update({
      where: { id },
      data: {
        status: nextStatus,
        resolved_by: staff.id,
        reviewed_at: new Date(),
      },
      select: {
        id: true,
        status: true,
        reviewed_at: true,
        resolved_by: true,
      },
    });

    return jsonData({ report: updated });
  });
}
