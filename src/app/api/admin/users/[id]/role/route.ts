import { UserRole } from "@prisma/client";
import { requireAdmin } from "@/features/admin/lib/require-admin";
import { createAuditLog } from "@/lib/audit/audit-log";
import { changeUserRoleSchema } from "@/features/admin/validators/user-role.validators";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, NotFoundError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function resolveRoleAfterModeratorRemoval(hasSellerProfile: boolean): UserRole {
  return hasSellerProfile ? UserRole.SELLER : UserRole.BUYER;
}

export async function PATCH(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const admin = await requireAdmin();
    const { id: targetUserId } = await context.params;
    const input = await parseJsonBody(request, changeUserRoleSchema);

    if (targetUserId === admin.id) {
      throw new ForbiddenError("You cannot change your own role");
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        role: true,
        sellerProfile: {
          select: { id: true },
        },
      },
    });

    if (!targetUser) {
      throw new NotFoundError("User not found");
    }

    if (targetUser.role === UserRole.ADMIN) {
      throw new ForbiddenError("Admin role cannot be changed through this API");
    }

    if (targetUser.role === UserRole.SELLER) {
      throw new ForbiddenError("Seller role cannot be changed through this API");
    }

    let nextRole: UserRole = input.role;

    if (targetUser.role === UserRole.MODERATOR && input.role === UserRole.BUYER) {
      nextRole = resolveRoleAfterModeratorRemoval(Boolean(targetUser.sellerProfile));
    }

    if (input.role === UserRole.MODERATOR && targetUser.role !== UserRole.BUYER) {
      throw new ForbiddenError("Only buyers can be promoted to moderator");
    }

    if (targetUser.role === nextRole) {
      return jsonData({
        user: await prisma.user.findUniqueOrThrow({
          where: { id: targetUserId },
          select: {
            id: true,
            email: true,
            phone: true,
            name: true,
            role: true,
            is_blocked: true,
            created_at: true,
          },
        }),
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: nextRole },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        is_blocked: true,
        created_at: true,
      },
    });

    await createAuditLog({
      actorId: admin.id,
      actorRole: admin.role,
      action: "user.role_change",
      targetType: "user",
      targetId: targetUserId,
      metadata: {
        old_role: targetUser.role,
        new_role: nextRole,
      },
    });

    return jsonData({ user: updatedUser });
  });
}
