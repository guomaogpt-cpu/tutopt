import { CompanyVerificationStatus, UserRole } from "@prisma/client";
import { requireAuth } from "@/features/auth/lib/session";
import { isCompanyProfileConfigured } from "@/features/company/lib/company-profile";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";
import { getAccountRestrictedMessage, isUserBlocked } from "@/lib/security/user-restrictions";

export async function POST() {
  return withApiHandler(async () => {
    const user = await requireAuth();

    if (
      user.role !== UserRole.BUYER &&
      user.role !== UserRole.SELLER &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenError("Только владелец может отправить компанию на проверку");
    }

    if (isUserBlocked(user)) {
      throw new ForbiddenError(getAccountRestrictedMessage());
    }

    const profile = await prisma.sellerProfile.findUnique({
      where: { user_id: user.id },
      select: {
        id: true,
        company_type: true,
        verification_status: true,
      },
    });

    if (!profile || !isCompanyProfileConfigured(profile)) {
      throw new NotFoundError("Сначала создайте профиль компании");
    }

    if (profile.verification_status === CompanyVerificationStatus.VERIFIED) {
      throw new ValidationError("Компания уже проверена");
    }

    if (profile.verification_status === CompanyVerificationStatus.PENDING) {
      throw new ValidationError("Компания уже отправлена на проверку");
    }

    const updated = await prisma.sellerProfile.update({
      where: { id: profile.id },
      data: {
        verification_status: CompanyVerificationStatus.PENDING,
        verification_note: null,
        is_verified: false,
        verified_at: null,
        verified_by_id: null,
      },
      select: {
        id: true,
        verification_status: true,
      },
    });

    return jsonData({
      verificationStatus: updated.verification_status,
    });
  });
}
