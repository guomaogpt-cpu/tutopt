import { generatePasswordResetToken } from "@/features/auth/lib/tokens";
import { forgotPasswordSchema } from "@/features/auth/validators/auth.validators";
import { getClientIpFromRequest } from "@/lib/security/client-ip";
import { assertForgotPasswordRateLimits } from "@/lib/security/rate-limit";
import { getEnv } from "@/shared/config/env";
import { jsonMessage, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

const GENERIC_MESSAGE =
  "Если аккаунт с таким email существует, инструкции по сбросу пароля отправлены";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const input = await parseJsonBody(request, forgotPasswordSchema);
    const ip = getClientIpFromRequest(request);
    assertForgotPasswordRateLimits(input.email, ip);

    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (user && !user.is_blocked) {
      await generatePasswordResetToken(user.id);

      if (getEnv().NODE_ENV === "development") {
        logger.info("Password reset token generated", {
          userId: user.id,
          resetPath: "/auth/reset-password",
        });
      }
    }

    return jsonMessage(GENERIC_MESSAGE);
  });
}
