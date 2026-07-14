import { UserRole } from "@prisma/client";
import { requireAuth } from "@/features/auth/lib/session";
import { hasVerifiedSellerPhone, isSellerPhoneComplete } from "@/features/auth/lib/seller-onboarding";
import { verifyPhoneVerificationToken } from "@/features/auth/lib/phone-otp";
import { generateShortId, slugifyTitle } from "@/features/listings/lib/slug";
import { isSafeInternalPath } from "@/features/auth/lib/login-redirect";
import { defaultPostAuthPath } from "@/features/auth/validators/seller-onboarding.validators";
import { sellerUpgradeSchema } from "@/features/auth/validators/seller-upgrade.validators";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ConflictError, ForbiddenError, ValidationError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const input = await parseJsonBody(request, sellerUpgradeSchema);

    if (user.role === UserRole.SELLER) {
      const next =
        input.next && isSafeInternalPath(input.next)
          ? input.next
          : defaultPostAuthPath(UserRole.SELLER, null);
      return jsonData({
        alreadySeller: true,
        redirectTo: next === "/seller/upgrade" ? "/seller/dashboard" : next,
      });
    }

    if (user.role !== UserRole.BUYER) {
      throw new ForbiddenError("Стать продавцом можно только из аккаунта покупателя");
    }

    const phoneAlreadyVerified = hasVerifiedSellerPhone({
      phone: user.phone,
      phone_verified_at: user.phone_verified_at,
    });

    let nextPhone = user.phone;
    let setVerifiedAt = false;

    if (!phoneAlreadyVerified) {
      if (!input.phone || !input.phoneVerificationToken) {
        throw new ValidationError("Подтвердите телефон по коду из SMS");
      }

      verifyPhoneVerificationToken(input.phoneVerificationToken, input.phone);

      const phoneOwner = await prisma.user.findUnique({
        where: { phone: input.phone },
        select: { id: true },
      });

      if (phoneOwner && phoneOwner.id !== user.id) {
        throw new ConflictError("Этот телефон уже зарегистрирован");
      }

      nextPhone = input.phone;
      setVerifiedAt = true;
    }

    if (!isSellerPhoneComplete(nextPhone) || !nextPhone) {
      throw new ValidationError("Укажите корректный телефон продавца");
    }

    const contactPhone: string = nextPhone;

    const updatedUser = await prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id: user.id },
        data: {
          role: UserRole.SELLER,
          name: input.company_name,
          phone: contactPhone,
          ...(setVerifiedAt ? { phone_verified_at: new Date() } : {}),
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      });

      const existingProfile = await tx.sellerProfile.findUnique({
        where: { user_id: user.id },
      });

      if (existingProfile) {
        await tx.sellerProfile.update({
          where: { id: existingProfile.id },
          data: {
            company_name: input.company_name,
            contact_phone: contactPhone,
            contact_email: user.email ?? existingProfile.contact_email,
          },
        });
      } else {
        const defaultRegion = await tx.region.findFirst({
          where: { slug: "bishkek" },
        });

        if (!defaultRegion) {
          throw new ValidationError("Default region not found. Run database seed first.");
        }

        const baseSlug = slugifyTitle(input.company_name);
        const slug = `${baseSlug}-${generateShortId().slice(0, 6)}`;

        await tx.sellerProfile.create({
          data: {
            user_id: user.id,
            company_name: input.company_name,
            slug,
            contact_phone: contactPhone,
            contact_email: user.email,
            region_id: defaultRegion.id,
          },
        });
      }

      return updated;
    });

    logger.info("Buyer upgraded to seller", { userId: user.id });

    const next =
      input.next && isSafeInternalPath(input.next)
        ? input.next
        : defaultPostAuthPath(UserRole.SELLER, null);

    return jsonData({
      user: updatedUser,
      redirectTo: next === "/seller/upgrade" ? "/seller/dashboard" : next,
    });
  });
}
