import { createHmac, timingSafeEqual } from "crypto";
import { AuthProvider, UserRole } from "@prisma/client";
import { isSafeInternalPath } from "@/features/auth/lib/login-redirect";
import { isPublicAuthRole, type PublicAuthRole } from "@/features/auth/validators/auth.validators";
import { getEnv, isGoogleAuthConfigured } from "@/shared/config/env";
import { ValidationError } from "@/shared/lib/errors";

export type GoogleOAuthState = {
  role: PublicAuthRole;
  next: string;
  nonce: string;
};

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleUserInfo = {
  id: string;
  email: string;
  verified_email?: boolean;
  name?: string;
  picture?: string;
};

function getStateSecret(): string {
  const env = getEnv();
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  if (!clientSecret) {
    throw new ValidationError("Google OAuth не настроен");
  }
  return clientSecret;
}

function signPayload(payload: string): string {
  return createHmac("sha256", getStateSecret()).update(payload).digest("base64url");
}

export function createGoogleOAuthState(input: {
  role?: string | null;
  next?: string | null;
}): string {
  // Only BUYER|SELLER — never ADMIN/MODERATOR via OAuth state
  const role: PublicAuthRole =
    input.role && isPublicAuthRole(input.role) ? input.role : UserRole.BUYER;

  const next =
    input.next && isSafeInternalPath(input.next) && input.next !== "/"
      ? input.next
      : "/";

  const state: GoogleOAuthState = {
    role,
    next,
    nonce: createHmac("sha256", getStateSecret())
      .update(`${Date.now()}-${Math.random()}`)
      .digest("hex")
      .slice(0, 24),
  };

  const payload = Buffer.from(JSON.stringify(state), "utf8").toString("base64url");
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function parseGoogleOAuthState(raw: string | null): GoogleOAuthState {
  if (!raw || !raw.includes(".")) {
    throw new ValidationError("Некорректный OAuth state");
  }

  const [payload, signature] = raw.split(".");
  if (!payload || !signature) {
    throw new ValidationError("Некорректный OAuth state");
  }

  const expected = signPayload(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new ValidationError("OAuth state подпись недействительна");
  }

  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as GoogleOAuthState;

  if (!isPublicAuthRole(decoded.role)) {
    throw new ValidationError("Недопустимая роль OAuth");
  }

  if (typeof decoded.next !== "string" || !decoded.next.startsWith("/") || decoded.next.startsWith("//")) {
    decoded.next = "/";
  }

  return decoded;
}

export function buildGoogleAuthorizationUrl(state: string): string {
  if (!isGoogleAuthConfigured()) {
    throw new ValidationError("Google OAuth не настроен");
  }

  const env = getEnv();
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID!,
    redirect_uri: env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    include_granted_scopes: "true",
    state,
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string): Promise<string> {
  if (!isGoogleAuthConfigured()) {
    throw new ValidationError("Google OAuth не настроен");
  }

  const env = getEnv();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID!,
      client_secret: env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  const data = (await response.json()) as GoogleTokenResponse;

  if (!response.ok || !data.access_token) {
    throw new ValidationError(data.error_description ?? "Не удалось получить токен Google");
  }

  return data.access_token;
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new ValidationError("Не удалось получить профиль Google");
  }

  const data = (await response.json()) as GoogleUserInfo;

  if (!data.id || !data.email) {
    throw new ValidationError("Google не вернул email или id");
  }

  return data;
}

export { AuthProvider };
