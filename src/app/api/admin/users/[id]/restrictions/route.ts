import { UserRole } from "@prisma/client";
import { requireAdmin } from "@/features/admin/lib/require-admin";
import { userRestrictionActionSchema } from "@/features/admin/validators/user-restriction.validators";
import { createAuditLog } from "@/lib/audit/audit-log";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, NotFoundError, ValidationError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const admin = await requireAdmin();
    const { id: targetUserId } = await context.params;
    const input = await parseJsonBody(request, userRestrictionActionSchema);

    if (targetUserId === admin.id) {
      throw new ForbiddenError("Нельзя ограничить свой аккаунт");
    }

    const target = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        role: true,
        is_blocked: true,
        blocked_at: true,
        listing_restricted_at: true,
        lead_restricted_at: true,
      },
    });

    if (!target) {
      throw new NotFoundError("Пользователь не найден");
    }

    if (target.role === UserRole.ADMIN) {
      throw new ForbiddenError("Нельзя ограничить другого администратора");
    }

    const now = new Date();
    const reason = input.reason?.trim() || null;

    let data: {
      is_blocked?: boolean;
      blocked_at?: Date | null;
      blocked_reason?: string | null;
      blocked_by_id?: string | null;
      listing_restricted_at?: Date | null;
      lead_restricted_at?: Date | null;
    } = {};

    switch (input.action) {
      case "block":
        data = {
          is_blocked: true,
          blocked_at: now,
          blocked_reason: reason,
          blocked_by_id: admin.id,
        };
        break;
      case "unblock":
        data = {
          is_blocked: false,
          blocked_at: null,
          blocked_reason: null,
          blocked_by_id: null,
        };
        break;
      case "restrict_listings":
        data = { listing_restricted_at: now };
        break;
      case "unrestrict_listings":
        data = { listing_restricted_at: null };
        break;
      case "restrict_leads":
        data = { lead_restricted_at: now };
        break;
      case "unrestrict_leads":
        data = { lead_restricted_at: null };
        break;
      default:
        throw new ValidationError("Неизвестное действие");
    }

    const updated = await prisma.user.update({
      where: { id: target.id },
      data,
      select: {
        id: true,
        name: true,
        role: true,
        is_blocked: true,
        blocked_at: true,
        blocked_reason: true,
        listing_restricted_at: true,
        lead_restricted_at: true,
      },
    });

    logger.info("Admin user restriction updated", {
      adminId: admin.id,
      targetUserId: target.id,
      action: input.action,
    });

    await createAuditLog({
      actorId: admin.id,
      actorRole: admin.role,
      action: `user.${input.action}`,
      targetType: "user",
      targetId: target.id,
      metadata: {
        ...(input.action === "block" ? { reason } : {}),
      },
    });

    return jsonData({ user: updated });
  });
}
