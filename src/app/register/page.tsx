"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthAlert, AuthFormCard, AuthFormField } from "@/components/auth/AuthFormCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { authButtonClassName, authInputClassName } from "@/components/auth/auth-form-styles";
import {
  AuthRequestError,
  getFieldError,
  parseIdentity,
  registerRequest,
  type AuthFormErrors,
} from "@/features/auth/lib/auth-client";
import { resolveNextParam } from "@/features/auth/lib/login-redirect";
import type { RegisterInput } from "@/features/auth/validators/auth.validators";
import { cn } from "@/lib/utils";

const emptyErrors: AuthFormErrors = { form: [], fields: {} };

type RegisterRole = "BUYER" | "SELLER";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = resolveNextParam(searchParams.get("next"));
  const initialRole = searchParams.get("role") === "SELLER" ? "SELLER" : "BUYER";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RegisterRole>(initialRole);
  const [companyName, setCompanyName] = useState("");
  const [errors, setErrors] = useState<AuthFormErrors>(emptyErrors);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get("role") === "SELLER") {
      setRole("SELLER");
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(emptyErrors);
    setSuccessMessage("");
    setIsSubmitting(true);

    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    const payload: RegisterInput = {
      name: name.trim(),
      password,
      role: role as RegisterInput["role"],
      ...(trimmedEmail ? { email: trimmedEmail } : {}),
      ...(trimmedPhone ? parseIdentity(trimmedPhone) : {}),
      ...(role === "SELLER" ? { company_name: companyName.trim() } : {}),
    };

    try {
      await registerRequest(payload);
      setSuccessMessage("Регистрация успешна. Перенаправление...");
      window.setTimeout(() => {
        router.push(nextPath);
        router.refresh();
      }, 800);
    } catch (error) {
      if (error instanceof AuthRequestError) {
        setErrors(error.formErrors);
      } else {
        setErrors({
          form: ["Не удалось зарегистрироваться. Попробуйте позже."],
          fields: {},
        });
      }
      setIsSubmitting(false);
    }
  }

  const loginHref =
    searchParams.get("next") && resolveNextParam(searchParams.get("next")) !== "/"
      ? `/login?next=${encodeURIComponent(resolveNextParam(searchParams.get("next")))}`
      : "/login";

  return (
    <AuthFormCard
      title="Регистрация"
      description="Создайте аккаунт покупателя или продавца."
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
        {successMessage ? <AuthAlert variant="success" messages={[successMessage]} /> : null}
        <AuthAlert variant="error" messages={errors.form} />

        <RoleSelector
          value={role}
          onChange={setRole}
          disabled={isSubmitting}
          error={getFieldError(errors, "role")}
        />

        <AuthFormField
          label={role === "SELLER" ? "Имя контактного лица" : "Имя"}
          htmlFor="register-name"
          error={getFieldError(errors, "name")}
        >
          <input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={role === "SELLER" ? "Ваше имя" : "Ваше имя"}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={cn(
              authInputClassName,
              getFieldError(errors, "name") &&
                "border-[#FECACA] focus:border-[#DC2626] focus:ring-[#FECACA]",
            )}
            disabled={isSubmitting}
          />
        </AuthFormField>

        {role === "SELLER" ? (
          <AuthFormField
            label="Название компании"
            htmlFor="register-company"
            error={getFieldError(errors, "company_name")}
          >
            <input
              id="register-company"
              name="company_name"
              type="text"
              placeholder="ОсОО «Ваша компания»"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className={cn(
                authInputClassName,
                getFieldError(errors, "company_name") &&
                  "border-[#FECACA] focus:border-[#DC2626] focus:ring-[#FECACA]",
              )}
              disabled={isSubmitting}
            />
          </AuthFormField>
        ) : null}

        <AuthFormField
          label="Email"
          htmlFor="register-email"
          hint="Укажите email или телефон"
          error={getFieldError(errors, "email")}
        >
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@company.kg"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={cn(
              authInputClassName,
              getFieldError(errors, "email") &&
                "border-[#FECACA] focus:border-[#DC2626] focus:ring-[#FECACA]",
            )}
            disabled={isSubmitting}
          />
        </AuthFormField>

        <AuthFormField
          label="Телефон"
          htmlFor="register-phone"
          error={getFieldError(errors, "phone")}
        >
          <input
            id="register-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+996XXXXXXXXX"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={cn(
              authInputClassName,
              getFieldError(errors, "phone") &&
                "border-[#FECACA] focus:border-[#DC2626] focus:ring-[#FECACA]",
            )}
            disabled={isSubmitting}
          />
        </AuthFormField>

        <AuthFormField
          label="Пароль"
          htmlFor="register-password"
          error={getFieldError(errors, "password")}
        >
          <PasswordInput
            id="register-password"
            name="password"
            value={password}
            onChange={setPassword}
            placeholder="Минимум 8 символов"
            autoComplete="new-password"
            disabled={isSubmitting}
            hasError={Boolean(getFieldError(errors, "password"))}
          />
        </AuthFormField>

        <button type="submit" disabled={isSubmitting} className={authButtonClassName}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Создание аккаунта...
            </>
          ) : (
            "Создать аккаунт"
          )}
        </button>

        <p className="text-center text-sm text-[#64748B]">
          Уже есть аккаунт?{" "}
          <Link
            href={loginHref}
            className="font-medium text-[#2563EB] transition hover:text-[#1D4ED8]"
          >
            Войти
          </Link>
        </p>
      </form>
    </AuthFormCard>
  );
}

function RegisterFormFallback() {
  return (
    <AuthFormCard title="Регистрация" description="Загрузка формы...">
      <p className="text-sm text-[#64748B]">Загрузка формы...</p>
    </AuthFormCard>
  );
}

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<RegisterFormFallback />}>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}
