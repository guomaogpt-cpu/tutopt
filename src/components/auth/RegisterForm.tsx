"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { AuthAlert, AuthFormCard, AuthFormField } from "@/components/auth/AuthFormCard";
import { AuthDivider, GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PhoneOtpFields } from "@/components/auth/PhoneOtpFields";
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
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { authInputClassName } from "@/components/auth/auth-form-styles";

const emptyErrors: AuthFormErrors = { form: [], fields: {} };

type RegisterFormProps = {
  googleEnabled: boolean;
  isDev: boolean;
};

export function RegisterForm({ googleEnabled, isDev }: RegisterFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const nextPath = resolveNextParam(searchParams.get("next"));

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneVerificationToken, setPhoneVerificationToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<AuthFormErrors>(emptyErrors);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(emptyErrors);
    setSuccessMessage("");

    if (!phoneVerificationToken) {
      setErrors({
        form: [t("auth.confirmPhoneRequired")],
        fields: { phoneVerificationToken: t("auth.confirmPhoneRequired") },
      });
      return;
    }

    setIsSubmitting(true);

    const payload: RegisterInput = {
      name: name.trim(),
      phone: phone.trim(),
      password,
      role: "BUYER",
      phoneVerificationToken,
    };

    try {
      const data = await registerRequest(payload);
      setSuccessMessage(t("auth.registerSuccess"));
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
          form: [t("auth.registerGenericError")],
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
    <AuthFormCard title={t("auth.createAccount")} description={t("auth.registerDescription")}>
      <form onSubmit={(event) => void handleSubmit(event)} className="min-w-0 space-y-4 sm:space-y-5">
        {successMessage ? <AuthAlert variant="success" messages={[successMessage]} /> : null}
        <AuthAlert variant="error" messages={errors.form} />

        <AuthFormField
          label={t("auth.buyerNameLabel")}
          htmlFor="register-name"
          error={getFieldError(errors, "name")}
        >
          <input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t("auth.buyerNameLabel")}
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
          phoneHint="На этот номер будет привязан ваш аккаунт."
          showDevHint={isDev}
        />

        <AuthFormField
          label={t("auth.password")}
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
              {t("auth.creatingAccount")}
            </>
          ) : (
            t("auth.createAccount")
          )}
        </button>

        {googleEnabled ? (
          <>
            <AuthDivider />
            <GoogleAuthButton enabled={googleEnabled} next={nextPath} />
          </>
        ) : null}

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {t("auth.haveAccount")}{" "}
          <Link href={loginHref} className="font-semibold text-blue-600 hover:underline">
            {t("auth.loginTitle")}
          </Link>
        </p>
      </form>
    </AuthFormCard>
  );
}
