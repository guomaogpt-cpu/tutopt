import { AuthProvider } from "@prisma/client";
import { hashPassword } from "@/features/auth/lib/password";
import { hashToken } from "@/features/auth/lib/tokens";
import { resetPasswordSchema } from "@/features/auth/validators/auth.validators";
import { jsonMessage, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ValidationError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const input = await parseJsonBody(request, resetPasswordSchema);
    const tokenHash = hashToken(input.token);

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token_hash: tokenHash,
        used_at: null,
        expires_at: { gt: new Date() },
      },
    });

    if (!resetToken) {
      throw new ValidationError("Ссылка для сброса пароля недействительна или устарела");
    }

    const password_hash = await hashPassword(input.password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.user_id },
        data: {
          password_hash,
          auth_provider: AuthProvider.PASSWORD,
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used_at: new Date() },
      }),
      prisma.session.deleteMany({
        where: { user_id: resetToken.user_id },
      }),
    ]);

    logger.info("Password reset completed", { userId: resetToken.user_id });

    return jsonMessage("Пароль успешно изменён");
  });
}
