import type { Prisma, UserRole } from "@prisma/client";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

export type AuditTargetType = "listing" | "user" | "report";

export type AuditMetadata = Record<string, string | number | boolean | null>;

export type CreateAuditLogInput = {
  actorId: string;
  actorRole: UserRole;
  action: string;
  targetType: AuditTargetType;
  targetId: string;
  metadata?: AuditMetadata;
};

/**
 * Записывает событие в audit log. Никогда не выбрасывает ошибку наружу:
 * сбой аудита не должен ломать основное admin-действие.
 */
export async function createAuditLog(input: CreateAuditLogInput): Promise<void> {
  try {
    const metadata: AuditMetadata = {
      actor_role: input.actorRole,
      ...(input.metadata ?? {}),
    };

    await prisma.auditLog.create({
      data: {
        actor_id: input.actorId,
        action: input.action,
        entity_type: input.targetType,
        entity_id: input.targetId,
        metadata: metadata as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    logger.error("Failed to create audit log", {
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
