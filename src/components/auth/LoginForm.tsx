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
import { cn } from "@/lib/utils";

const emptyErrors: AuthFormErrors = { form: [], fields: {} };

type LoginFormProps = {
  googleEnabled: boolean;
};

export function LoginForm({ googleEnabled }: LoginFormProps) {
  const router = useRouter();
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
      setErrors({ form: [oauthError], fields: {} });
    }
  }, [oauthError]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(emptyErrors);
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await loginRequest(phone, password, rememberMe);
      setSuccessMessage("Вход выполнен успешно. Перенаправление...");
      window.setTimeout(() => {
        router.push(nextPath);
        router.refresh();
      }, 800);
    } catch (error) {
      if (error instanceof AuthRequestError) {
        setErrors(error.formErrors);
      } else {
        setErrors({ form: ["Не удалось выполнить вход. Попробуйте позже."], fields: {} });
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
    <AuthFormCard
      title="Вход"
      description="Войдите по телефону и паролю или через Google."
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="min-w-0 space-y-5">
        {successMessage ? <AuthAlert variant="success" messages={[successMessage]} /> : null}
        <AuthAlert variant="error" messages={errors.form} />

        <AuthFormField label="Телефон" htmlFor="login-phone" error={phoneError}>
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
              phoneError && "border-[#FECACA] focus:border-[#DC2626] focus:ring-[#FECACA]",
            )}
            disabled={isSubmitting}
            required
          />
        </AuthFormField>

        <AuthFormField label="Пароль" htmlFor="login-password" error={passwordError}>
          <PasswordInput
            id="login-password"
            name="password"
            value={password}
            onChange={setPassword}
            placeholder="Введите пароль"
            autoComplete="current-password"
            disabled={isSubmitting}
            hasError={Boolean(passwordError)}
          />
        </AuthFormField>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm text-[#64748B]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              disabled={isSubmitting}
              className="rounded border-[rgba(148,163,184,0.4)] text-[#2563EB] focus:ring-[#2563EB]/20"
            />
            Запомнить меня
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#2563EB] transition hover:text-[#1D4ED8]"
          >
            Забыли пароль?
          </Link>
        </div>

        <button type="submit" disabled={isSubmitting} className={authButtonClassName}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Вход...
            </>
          ) : (
            "Войти"
          )}
        </button>

        <AuthDivider />

        <GoogleAuthButton enabled={googleEnabled} next={nextPath} disabled={isSubmitting} />

        <p className="text-center text-sm text-[#64748B]">
          Нет аккаунта?{" "}
          <Link
            href={registerHref}
            className="font-medium text-[#2563EB] transition hover:text-[#1D4ED8]"
          >
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </AuthFormCard>
  );
}
