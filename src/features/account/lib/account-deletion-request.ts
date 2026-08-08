import type { UserRole } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";
import type { AccountDeletionRequestInput } from "@/features/account/validators/account-deletion.validators";

const DELETION_ACTION = "account_deletion_requested";
const DUPLICATE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export class AccountDeletionDuplicateError extends Error {
  constructor() {
    super("Запрос на удаление аккаунта уже отправлен. Мы обработаем его в ближайшее время.");
    this.name = "AccountDeletionDuplicateError";
  }
}

export async function submitAccountDeletionRequest(
  userId: string,
  userRole: UserRole,
  input: AccountDeletionRequestInput,
): Promise<{ requestId: string; createdAt: Date }> {
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS);

  const existing = await prisma.auditLog.findFirst({
    where: {
      actor_id: userId,
      action: DELETION_ACTION,
      created_at: { gte: since },
    },
    select: { id: true },
  });

  if (existing) {
    throw new AccountDeletionDuplicateError();
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { phone: true, email: true, name: true },
  });

  const metadata: Prisma.InputJsonValue = {
    status: "PENDING",
    actor_role: userRole,
    reason: input.reason?.trim() || null,
    phone: user?.phone ?? null,
    email: user?.email ?? null,
    name: user?.name ?? null,
    source: "account_delete_page",
  };

  const auditEntry = await prisma.auditLog.create({
    data: {
      actor_id: userId,
      action: DELETION_ACTION,
      entity_type: "user",
      entity_id: userId,
      metadata,
    },
    select: { id: true, created_at: true },
  });

  return { requestId: auditEntry.id, createdAt: auditEntry.created_at };
}
