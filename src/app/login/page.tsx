"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthAlert, AuthFormCard, AuthFormField } from "@/components/auth/AuthFormCard";
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = resolveNextParam(searchParams.get("next"));

  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<AuthFormErrors>(emptyErrors);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(emptyErrors);
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await loginRequest(identity, password, rememberMe);
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

  const identityError = getFieldError(errors, "email") ?? getFieldError(errors, "phone");
  const passwordError = getFieldError(errors, "password");

  return (
    <AuthFormCard
      title="Вход"
      description="Войдите, чтобы отправлять заявки, сохранять товары и управлять объявлениями."
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
        {successMessage ? <AuthAlert variant="success" messages={[successMessage]} /> : null}
        <AuthAlert variant="error" messages={errors.form} />

        <AuthFormField
          label="Email или телефон"
          htmlFor="login-identity"
          error={identityError}
        >
          <input
            id="login-identity"
            name="identity"
            type="text"
            autoComplete="username"
            placeholder="name@company.kg или +996..."
            value={identity}
            onChange={(event) => setIdentity(event.target.value)}
            className={cn(
              authInputClassName,
              identityError && "border-[#FECACA] focus:border-[#DC2626] focus:ring-[#FECACA]",
            )}
            disabled={isSubmitting}
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

function LoginFormFallback() {
  return (
    <AuthFormCard title="Вход" description="Загрузка формы...">
      <p className="text-sm text-[#64748B]">Загрузка формы...</p>
    </AuthFormCard>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
