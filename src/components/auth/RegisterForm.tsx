"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { AuthAlert, AuthFormCard, AuthFormField } from "@/components/auth/AuthFormCard";
import { AuthDivider, GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PhoneOtpFields } from "@/components/auth/PhoneOtpFields";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { authButtonClassName } from "@/components/auth/auth-form-styles";
import {
  AuthRequestError,
  getFieldError,
  registerRequest,
  type AuthFormErrors,
} from "@/features/auth/lib/auth-client";
import { resolveNextParam } from "@/features/auth/lib/login-redirect";
import type { RegisterInput } from "@/features/auth/validators/auth.validators";
import { defaultPostAuthPath } from "@/features/auth/validators/seller-onboarding.validators";
import { cn } from "@/lib/utils";
import { authInputClassName } from "@/components/auth/auth-form-styles";

const emptyErrors: AuthFormErrors = { form: [], fields: {} };

type RegisterRole = "BUYER" | "SELLER";

type RegisterFormProps = {
  googleEnabled: boolean;
  isDev: boolean;
};

export function RegisterForm({ googleEnabled, isDev }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = resolveNextParam(searchParams.get("next"));
  const initialRole = searchParams.get("role") === "SELLER" ? "SELLER" : "BUYER";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RegisterRole>(initialRole);
  const [phoneVerificationToken, setPhoneVerificationToken] = useState<string | null>(null);
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

    if (!phoneVerificationToken) {
      setErrors({
        form: ["Подтвердите телефон по коду из SMS"],
        fields: { phoneVerificationToken: "Подтвердите телефон по коду из SMS" },
      });
      return;
    }

    setIsSubmitting(true);

    const payload: RegisterInput = {
      name: name.trim(),
      phone: phone.trim(),
      password,
      role: role as RegisterInput["role"],
      phoneVerificationToken,
    };

    try {
      const data = await registerRequest(payload);
      setSuccessMessage("Регистрация успешна. Перенаправление...");
      const destination = defaultPostAuthPath(data.user.role, nextPath);
      window.setTimeout(() => {
        router.push(destination);
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
      description="Создайте аккаунт по телефону. Альтернатива — вход через Google."
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="min-w-0 space-y-5">
        {successMessage ? <AuthAlert variant="success" messages={[successMessage]} /> : null}
        <AuthAlert variant="error" messages={errors.form} />

        <RoleSelector
          value={role}
          onChange={setRole}
          disabled={isSubmitting}
          error={getFieldError(errors, "role")}
        />

        <AuthFormField
          label={role === "SELLER" ? "Название компании или имя продавца" : "Ваше имя"}
          htmlFor="register-name"
          error={getFieldError(errors, "name")}
        >
          <input
            id="register-name"
            name="name"
            type="text"
            autoComplete="organization"
            placeholder={
              role === "SELLER" ? "ОсОО «Ваша компания» или ваше имя" : "Ваше имя"
            }
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

        <PhoneOtpFields
          phone={phone}
          onPhoneChange={setPhone}
          phoneVerificationToken={phoneVerificationToken}
          onVerified={setPhoneVerificationToken}
          onTokenReset={() => setPhoneVerificationToken(null)}
          errors={errors}
          disabled={isSubmitting}
          phoneHint={
            role === "SELLER"
              ? "На этот номер покупатели смогут связаться с вами."
              : "На этот номер будет привязан ваш аккаунт."
          }
          showDevHint={isDev}
        />

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

        <button
          type="submit"
          disabled={isSubmitting || !phoneVerificationToken}
          className={authButtonClassName}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Создание аккаунта...
            </>
          ) : (
            "Создать аккаунт"
          )}
        </button>

        <AuthDivider />

        <GoogleAuthButton
          enabled={googleEnabled}
          role={role}
          next={nextPath}
          disabled={isSubmitting}
        />

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
