import { NextResponse } from "next/server";
import {
  buildGoogleAuthorizationUrl,
  createGoogleOAuthState,
} from "@/features/auth/lib/google-oauth";
import { isGoogleAuthConfigured } from "@/shared/config/env";
import { withApiHandler } from "@/shared/lib/api-route";
import { ValidationError } from "@/shared/lib/errors";

export async function GET(request: Request) {
  return withApiHandler(async () => {
    if (!isGoogleAuthConfigured()) {
      throw new ValidationError(
        "Google-вход ещё не настроен. Добавьте GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET и GOOGLE_REDIRECT_URI.",
      );
    }

    const url = new URL(request.url);
    const role = url.searchParams.get("role");
    const next = url.searchParams.get("next");

    const state = createGoogleOAuthState({ role, next });
    const authorizationUrl = buildGoogleAuthorizationUrl(state);

    return NextResponse.redirect(authorizationUrl);
  });
}
