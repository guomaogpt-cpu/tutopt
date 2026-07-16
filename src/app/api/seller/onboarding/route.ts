import { UserRole } from "@prisma/client";
import { requireAuth } from "@/features/auth/lib/session";
import { verifyPhoneVerificationToken } from "@/features/auth/lib/phone-otp";
import { createSellerProfileForUser } from "@/features/listings/lib/seller-profile";
import {
  defaultPostAuthPath,
  sellerOnboardingSchema,
} from "@/features/auth/validators/seller-onboarding.validators";
import { isSafeInternalPath } from "@/features/auth/lib/login-redirect";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ConflictError, ForbiddenError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";
import { getAccountRestrictedMessage, isUserBlocked } from "@/lib/security/user-restrictions";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await requireAuth();

    if (user.role !== UserRole.SELLER) {
      throw new ForbiddenError("Онбординг доступен только продавцам");
    }

    if (isUserBlocked(user)) {
      throw new ForbiddenError(getAccountRestrictedMessage());
    }

    const input = await parseJsonBody(request, sellerOnboardingSchema);

    verifyPhoneVerificationToken(input.phoneVerificationToken, input.phone);

    const phoneOwner = await prisma.user.findUnique({
      where: { phone: input.phone },
      select: { id: true },
    });

    if (phoneOwner && phoneOwner.id !== user.id) {
      throw new ConflictError("Этот телефон уже зарегистрирован");
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        phone: input.phone,
        name: input.company_name,
        phone_verified_at: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    const existingProfile = await prisma.sellerProfile.findUnique({
      where: { user_id: user.id },
    });

    if (existingProfile) {
      await prisma.sellerProfile.update({
        where: { id: existingProfile.id },
        data: {
          company_name: input.company_name,
          contact_phone: input.phone,
          contact_email: user.email ?? existingProfile.contact_email,
        },
      });
    } else {
      await createSellerProfileForUser({
        userId: user.id,
        companyName: input.company_name,
        contactPhone: input.phone,
        contactEmail: user.email,
      });
    }

    logger.info("Seller onboarding completed", { userId: user.id });

    const next =
      input.next && isSafeInternalPath(input.next)
        ? input.next
        : defaultPostAuthPath(UserRole.SELLER, null);

    return jsonData({
      user: updatedUser,
      redirectTo: next === "/seller/onboarding" ? "/seller/dashboard" : next,
    });
  });
}
