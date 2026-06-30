import type { User } from "@prisma/client";
import { cookies } from "next/headers";
import { createSessionRecord, revokeSessionByToken } from "@/features/auth/lib/session-store";
import { hashToken } from "@/features/auth/lib/tokens";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  SESSION_REMEMBER_MAX_AGE_SECONDS,
} from "@/shared/constants/auth";
import { getEnv } from "@/shared/config/env";
import { UnauthorizedError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

export const publicUserSelect = {
  id: true,
  email: true,
  phone: true,
  role: true,
  name: true,
  avatar_url: true,
  city: true,
  region_id: true,
  email_verified_at: true,
  phone_verified_at: true,
  is_blocked: true,
  last_login_at: true,
  created_at: true,
  updated_at: true,
} as const;

export type PublicUser = {
  id: string;
  email: string | null;
  phone: string | null;
  role: User["role"];
  name: string;
  avatar_url: string | null;
  city: string | null;
  region_id: string | null;
  email_verified_at: Date | null;
  phone_verified_at: Date | null;
  is_blocked: boolean;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

type CreateSessionOptions = {
  rememberMe?: boolean;
};

export async function createSession(
  userId: string,
  options: CreateSessionOptions = {},
): Promise<{ token: string; expiresAt: Date }> {
  const rememberMe = options.rememberMe ?? false;
  const maxAgeSeconds = rememberMe ? SESSION_REMEMBER_MAX_AGE_SECONDS : SESSION_MAX_AGE_SECONDS;
  const { token, expiresAt } = await createSessionRecord(userId, maxAgeSeconds);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: getEnv().NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return { token, expiresAt };
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findFirst({
    where: {
      token_hash: hashToken(token),
      expires_at: { gt: new Date() },
    },
    include: {
      user: {
        select: publicUserSelect,
      },
    },
  });

  if (!session?.user || session.user.is_blocked) {
    return null;
  }

  return session.user;
}

export async function requireAuth(): Promise<PublicUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await revokeSessionByToken(token);
  }

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: getEnv().NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
