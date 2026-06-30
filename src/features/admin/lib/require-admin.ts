import { UserRole } from "@prisma/client";
import { requireAuth } from "@/features/auth/lib/session";
import { ForbiddenError } from "@/shared/lib/errors";
import type { PublicUser } from "@/features/auth/lib/session";

export async function requireAdmin(): Promise<PublicUser> {
  const user = await requireAuth();

  if (user.role !== UserRole.ADMIN) {
    throw new ForbiddenError("Admin access required");
  }

  return user;
}

export async function requireStaff(): Promise<PublicUser> {
  const user = await requireAuth();

  if (user.role !== UserRole.ADMIN && user.role !== UserRole.MODERATOR) {
    throw new ForbiddenError("Staff access required");
  }

  return user;
}

export function isStaffRole(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.MODERATOR;
}
