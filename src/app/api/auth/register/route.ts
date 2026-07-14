import { AuthProvider, UserRole } from "@prisma/client";
import { hashPassword } from "@/features/auth/lib/password";
import { verifyPhoneVerificationToken } from "@/features/auth/lib/phone-otp";
import { createSession, publicUserSelect } from "@/features/auth/lib/session";
import { createSellerProfileForUser } from "@/features/listings/lib/seller-profile";
import { registerSchema } from "@/features/auth/validators/auth.validators";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ConflictError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const input = await parseJsonBody(request, registerSchema);

    if (input.role !== UserRole.BUYER && input.role !== UserRole.SELLER) {
      throw new ConflictError("Недопустимая роль");
    }

    verifyPhoneVerificationToken(input.phoneVerificationToken, input.phone);

    const existingPhone = await prisma.user.findUnique({ where: { phone: input.phone } });
    if (existingPhone) {
      throw new ConflictError("Этот телефон уже зарегистрирован");
    }

    const password_hash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        phone: input.phone,
        email: null,
        password_hash,
        auth_provider: AuthProvider.PASSWORD,
        name: input.name,
        role: input.role,
        phone_verified_at: new Date(),
      },
      select: publicUserSelect,
    });

    if (input.role === UserRole.SELLER) {
      await createSellerProfileForUser({
        userId: user.id,
        companyName: input.name,
        contactPhone: input.phone,
        contactEmail: null,
      });
    }

    await createSession(user.id);

    logger.info("User registered", { userId: user.id, role: user.role });

    return jsonData({ user }, 201);
  });
}
