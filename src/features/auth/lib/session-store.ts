import { generateSecureToken, hashToken } from "@/features/auth/lib/tokens";
import { prisma } from "@/shared/lib/prisma";

export async function createSessionRecord(
  userId: string,
  maxAgeSeconds: number,
): Promise<{ token: string; expiresAt: Date }> {
  const token = generateSecureToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000);

  await prisma.session.create({
    data: {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function revokeSessionByToken(token: string): Promise<void> {
  const tokenHash = hashToken(token);

  await prisma.session.deleteMany({
    where: { token_hash: tokenHash },
  });
}
