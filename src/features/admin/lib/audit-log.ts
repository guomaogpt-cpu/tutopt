import { prisma } from "@/shared/lib/prisma";
import type { UserRole } from "@prisma/client";

type RoleChangeMetadata = {
  target_user_id: string;
  old_role: UserRole;
  new_role: UserRole;
};

export async function logUserRoleChanged(
  actorId: string,
  targetUserId: string,
  oldRole: UserRole,
  newRole: UserRole,
): Promise<void> {
  const metadata: RoleChangeMetadata = {
    target_user_id: targetUserId,
    old_role: oldRole,
    new_role: newRole,
  };

  await prisma.auditLog.create({
    data: {
      actor_id: actorId,
      action: "USER_ROLE_CHANGED",
      entity_type: "User",
      entity_id: targetUserId,
      metadata,
    },
  });
}
