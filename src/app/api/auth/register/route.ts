import { AuthProvider, UserRole } from "@prisma/client";
import { hashPassword } from "@/features/auth/lib/password";
import { verifyPhoneVerificationToken } from "@/features/auth/lib/phone-otp";
import { createSession, publicUserSelect } from "@/features/auth/lib/session";
import { registerSchema } from "@/features/auth/validators/auth.validators";
import { getClientIpFromRequest } from "@/lib/security/client-ip";
import { assertRegisterRateLimit } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ConflictError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const ip = getClientIpFromRequest(request);
    assertRegisterRateLimit(ip);

    const input = await parseJsonBody(request, registerSchema);

    verifyPhoneVerificationToken(input.phoneVerificationToken, input.phone);

    const existingPhone = await prisma.user.findUnique({ where: { phone: input.phone } });
    if (existingPhone) {
      throw new ConflictError("Этот телефон уже зарегистрирован");
    }

    const password_hash = await hashPassword(input.password);

    // Phase 78: registration always creates a normal account (BUYER in DB).
    // Publishing capability is granted later via soft SellerProfile creation.
    const user = await prisma.user.create({
      data: {
        phone: input.phone,
        email: null,
        password_hash,
        auth_provider: AuthProvider.PASSWORD,
        name: input.name,
        role: UserRole.BUYER,
        phone_verified_at: new Date(),
      },
      select: publicUserSelect,
    });

    await createSession(user.id);

    logger.info("User registered", { userId: user.id, role: user.role });

    return jsonData({ user }, 201);
  });
}
