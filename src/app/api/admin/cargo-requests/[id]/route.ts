import { z } from "zod";
import { requireAdmin } from "@/features/admin/lib/require-admin";
import { updateCargoRequestStatusSchema } from "@/features/cargo/validators/cargo-response.validators";
import { createAuditLog } from "@/lib/audit/audit-log";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { NotFoundError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

const requestIdSchema = z.string().uuid();

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const admin = await requireAdmin();
    const { id } = await context.params;
    const requestId = requestIdSchema.safeParse(id);

    if (!requestId.success) {
      throw new NotFoundError("Cargo request not found");
    }

    const input = await parseJsonBody(request, updateCargoRequestStatusSchema);

    const existing = await prisma.cargoRequest.findUnique({
      where: { id: requestId.data },
      select: { id: true, status: true },
    });

    if (!existing) {
      throw new NotFoundError("Cargo request not found");
    }

    const updated = await prisma.cargoRequest.update({
      where: { id: existing.id },
      data: { status: input.status },
      select: {
        id: true,
        status: true,
        updated_at: true,
      },
    });

    await createAuditLog({
      actorId: admin.id,
      actorRole: admin.role,
      action: "cargo_request.status_update",
      targetType: "cargo_request",
      targetId: updated.id,
      metadata: {
        from_status: existing.status,
        to_status: updated.status,
      },
    });

    return jsonData({ request: updated });
  });
}
