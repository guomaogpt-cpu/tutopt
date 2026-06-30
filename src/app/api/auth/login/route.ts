import { verifyPassword } from "@/features/auth/lib/password";
import { createSession, publicUserSelect } from "@/features/auth/lib/session";
import { loginSchema } from "@/features/auth/validators/auth.validators";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, UnauthorizedError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const input = await parseJsonBody(request, loginSchema);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(input.email ? [{ email: input.email }] : []),
          ...(input.phone ? [{ phone: input.phone }] : []),
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (user.is_blocked) {
      throw new ForbiddenError("Account is blocked");
    }

    const isValidPassword = await verifyPassword(input.password, user.password_hash);

    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    await createSession(user.id, { rememberMe: input.remember_me });

    const publicUser = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: publicUserSelect,
    });

    logger.info("User logged in", { userId: user.id });

    return jsonData({ user: publicUser });
  });
}
