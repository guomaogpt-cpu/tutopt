import { AuthProvider, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  exchangeGoogleCode,
  fetchGoogleUserInfo,
  parseGoogleOAuthState,
} from "@/features/auth/lib/google-oauth";
import { needsSellerOnboarding } from "@/features/auth/lib/seller-onboarding";
import { createSession } from "@/features/auth/lib/session";
import {
  buildSellerOnboardingUrl,
  defaultPostAuthPath,
} from "@/features/auth/validators/seller-onboarding.validators";
import { getEnv, isGoogleAuthConfigured } from "@/shared/config/env";
import { ForbiddenError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";

function appOrigin(): string {
  return getEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
}

function redirectWithError(message: string): NextResponse {
  const url = new URL("/login", appOrigin());
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  try {
    if (!isGoogleAuthConfigured()) {
      return redirectWithError("Google OAuth не настроен");
    }

    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const stateRaw = url.searchParams.get("state");
    const oauthError = url.searchParams.get("error");

    if (oauthError) {
      return redirectWithError("Вход через Google отменён");
    }

    if (!code) {
      return redirectWithError("Код авторизации Google отсутствует");
    }

    let state;
    try {
      state = parseGoogleOAuthState(stateRaw);
    } catch {
      return redirectWithError("Некорректный OAuth state");
    }

    const accessToken = await exchangeGoogleCode(code);
    const googleUser = await fetchGoogleUserInfo(accessToken);
    const email = googleUser.email.toLowerCase();

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ google_id: googleUser.id }, { email }],
      },
    });

    if (user?.is_blocked) {
      throw new ForbiddenError("Аккаунт заблокирован");
    }

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          google_id: user.google_id ?? googleUser.id,
          auth_provider: user.auth_provider ?? AuthProvider.GOOGLE,
          email: user.email ?? email,
          avatar_url: user.avatar_url ?? googleUser.picture ?? null,
          email_verified_at: user.email_verified_at ?? new Date(),
          last_login_at: new Date(),
          name: user.name || googleUser.name || email.split("@")[0] || "User",
        },
      });
    } else {
      const role =
        state.role === UserRole.SELLER || state.role === UserRole.BUYER
          ? state.role
          : UserRole.BUYER;

      user = await prisma.user.create({
        data: {
          email,
          google_id: googleUser.id,
          auth_provider: AuthProvider.GOOGLE,
          password_hash: null,
          phone: null,
          name: googleUser.name?.trim() || email.split("@")[0] || "User",
          avatar_url: googleUser.picture ?? null,
          role,
          email_verified_at: new Date(),
          last_login_at: new Date(),
        },
      });

      // SellerProfile intentionally NOT created here — contact_phone is required in Prisma.
      // SELLER completes profile (real phone + company) on /seller/onboarding.
    }

    await createSession(user.id);

    logger.info("User logged in via Google", { userId: user.id, role: user.role });

    if (needsSellerOnboarding({ role: user.role, phone: user.phone })) {
      const onboardingPath = buildSellerOnboardingUrl(state.next);
      return NextResponse.redirect(new URL(onboardingPath, appOrigin()));
    }

    const nextPath = defaultPostAuthPath(user.role, state.next);
    return NextResponse.redirect(new URL(nextPath, appOrigin()));
  } catch (error) {
    logger.error("Google OAuth callback failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    const message =
      error instanceof ForbiddenError
        ? error.message
        : "Не удалось войти через Google. Попробуйте снова.";
    return redirectWithError(message);
  }
}
