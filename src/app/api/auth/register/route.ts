import { hashPassword } from "@/features/auth/lib/password";
import { createSession, publicUserSelect } from "@/features/auth/lib/session";
import { registerSchema } from "@/features/auth/validators/auth.validators";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ConflictError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const input = await parseJsonBody(request, registerSchema);

    if (input.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email: input.email } });
      if (existingEmail) {
        throw new ConflictError("Email is already registered");
      }
    }

    if (input.phone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone: input.phone } });
      if (existingPhone) {
        throw new ConflictError("Phone is already registered");
      }
    }

    const password_hash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email ?? null,
        phone: input.phone ?? null,
        password_hash,
        name: input.name,
        role: input.role,
      },
      select: publicUserSelect,
    });

    await createSession(user.id);

    logger.info("User registered", { userId: user.id, role: user.role });

    return jsonData({ user }, 201);
  });
}
