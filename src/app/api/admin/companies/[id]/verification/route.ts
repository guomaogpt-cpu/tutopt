import { requireAdmin } from "@/features/admin/lib/require-admin";
import { notifyCompanyVerificationResult } from "@/features/company/lib/company-verification-notify";
import {
  adminCompanyVerificationSchema,
  resolveVerificationStatusFromAction,
} from "@/features/company/validators/company-verification.validators";
import { createAuditLog } from "@/lib/audit/audit-log";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";
import { CompanyVerificationStatus } from "@prisma/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const admin = await requireAdmin();
    const { id } = await context.params;
    const input = await parseJsonBody(request, adminCompanyVerificationSchema);

    const profile = await prisma.sellerProfile.findUnique({
      where: { id },
      select: {
        id: true,
        user_id: true,
        company_name: true,
        company_type: true,
        verification_status: true,
      },
    });

    if (!profile) {
      throw new NotFoundError("Company not found");
    }

    if (!profile.company_type) {
      throw new ValidationError("Профиль компании ещё не заполнен");
    }

    const nextStatus = resolveVerificationStatusFromAction(input.action);
    const now = new Date();
    const isVerified = nextStatus === CompanyVerificationStatus.VERIFIED;

    const updated = await prisma.sellerProfile.update({
      where: { id: profile.id },
      data: {
        verification_status: nextStatus,
        verification_note: input.note,
        is_verified: isVerified,
        verified_at: isVerified ? now : null,
        verified_by_id: isVerified || nextStatus === CompanyVerificationStatus.REJECTED
          ? admin.id
          : null,
      },
      select: {
        id: true,
        company_name: true,
        verification_status: true,
        verified_at: true,
        is_verified: true,
      },
    });

    await createAuditLog({
      actorId: admin.id,
      actorRole: admin.role,
      action: `company.verification.${input.action}`,
      targetType: "seller_profile",
      targetId: profile.id,
      metadata: {
        status_before: profile.verification_status,
        status_after: nextStatus,
        has_note: Boolean(input.note),
      },
    });

    await notifyCompanyVerificationResult({
      recipientId: profile.user_id,
      actorId: admin.id,
      status: nextStatus,
      companyName: profile.company_name,
    });

    return jsonData({ company: updated });
  });
}
