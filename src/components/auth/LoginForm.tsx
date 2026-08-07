"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { AuthAlert, AuthFormCard, AuthFormField } from "@/components/auth/AuthFormCard";
import { AuthDivider, GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { authButtonClassName, authInputClassName } from "@/components/auth/auth-form-styles";
import {
  AuthRequestError,
  getFieldError,
  loginRequest,
  type AuthFormErrors,
} from "@/features/auth/lib/auth-client";
import { resolveNextParam } from "@/features/auth/lib/login-redirect";
import { defaultPostAuthPath } from "@/features/auth/validators/seller-onboarding.validators";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const emptyErrors: AuthFormErrors = { form: [], fields: {} };

type LoginFormProps = {
  googleEnabled: boolean;
};

function sanitizeLoginError(raw: string, invalidCredentials: string, tryAgain: string): string {
  const lower = raw.toLowerCase();
  if (
    lower.includes("неверный") ||
    lower.includes("invalid") ||
    lower.includes("password") ||
    lower.includes("телефон")
  ) {
    return invalidCredentials;
  }
  if (raw.includes("Prisma") || raw.includes("\n") || raw.length > 160) {
    return tryAgain;
  }
  return raw;
}

export function LoginForm({ googleEnabled }: LoginFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const nextPath = resolveNextParam(searchParams.get("next"));
  const oauthError = searchParams.get("error");

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<AuthFormErrors>(emptyErrors);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (oauthError) {
      setErrors({
        form: [
          sanitizeLoginError(oauthError, t("auth.invalidCredentials"), t("auth.tryAgainLater")),
        ],
        fields: {},
      });
    }
  }, [oauthError, t]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(emptyErrors);
    setSuccessMessage("");

    if (!phone.trim() || !password) {
      setErrors({ form: [t("auth.requiredFields")], fields: {} });
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginRequest(phone, password, rememberMe);
      setSuccessMessage(t("auth.loginSuccess"));
      const destination = defaultPostAuthPath(data.user.role, nextPath);
      window.setTimeout(() => {
        router.push(destination);
        router.refresh();
      }, 800);
    } catch (error) {
      if (error instanceof AuthRequestError) {
        const formMessages = error.formErrors.form.map((message) =>
          sanitizeLoginError(message, t("auth.invalidCredentials"), t("auth.tryAgainLater")),
        );
        setErrors({
          form: formMessages.length > 0 ? formMessages : [t("auth.invalidCredentials")],
          fields: error.formErrors.fields,
        });
      } else {
        setErrors({ form: [t("auth.tryAgainLater")], fields: {} });
      }
      setIsSubmitting(false);
    }
  }

  const registerHref =
    searchParams.get("next") && resolveNextParam(searchParams.get("next")) !== "/"
      ? `/register?next=${encodeURIComponent(resolveNextParam(searchParams.get("next")))}`
      : "/register";

  const phoneError = getFieldError(errors, "phone");
  const passwordError = getFieldError(errors, "password");

  return (
    <AuthFormCard title={t("auth.loginTitle")} description={t("auth.loginDescription")}>
      <form onSubmit={(event) => void handleSubmit(event)} autoComplete="on" className="min-w-0 space-y-4 sm:space-y-5">
        {successMessage ? <AuthAlert variant="success" messages={[successMessage]} /> : null}
        <AuthAlert variant="error" messages={errors.form} />

        <AuthFormField label={t("auth.phone")} htmlFor="login-phone" error={phoneError}>
          <input
            id="login-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+996 XXX XXX XXX"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={cn(
              authInputClassName,
              phoneError && "border-red-200 focus:border-red-600 focus:ring-red-200",
            )}
            disabled={isSubmitting}
            required
          />
        </AuthFormField>

        <AuthFormField label={t("auth.password")} htmlFor="login-password" error={passwordError}>
          <PasswordInput
            id="login-password"
            name="password"
            value={password}
            onChange={setPassword}
            placeholder={t("auth.password")}
            autoComplete="current-password"
            disabled={isSubmitting}
            hasError={Boolean(passwordError)}
          />
        </AuthFormField>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              disabled={isSubmitting}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-600/20"
            />
            {t("auth.rememberMe")}
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
          >
            {t("auth.forgotPassword")}
          </Link>
        </div>

        <button type="submit" disabled={isSubmitting} className={cn(authButtonClassName, "mobile-scroll-target")}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {t("auth.signingIn")}
            </>
          ) : (
            t("auth.login")
          )}
        </button>

        {googleEnabled ? (
          <>
            <AuthDivider />
            <GoogleAuthButton enabled={googleEnabled} next={nextPath} disabled={isSubmitting} />
          </>
        ) : null}

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {t("auth.noAccount")}{" "}
          <Link
            href={registerHref}
            className="font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
          >
            {t("auth.register")}
          </Link>
        </p>
      </form>
    </AuthFormCard>
  );
}
