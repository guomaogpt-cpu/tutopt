"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { AuthAlert, AuthFormCard, AuthFormField } from "@/components/auth/AuthFormCard";
import { PhoneOtpFields } from "@/components/auth/PhoneOtpFields";
import { authButtonClassName, authInputClassName } from "@/components/auth/auth-form-styles";
import {
  AuthRequestError,
  getFieldError,
  type AuthFormErrors,
} from "@/features/auth/lib/auth-client";
import { cn } from "@/lib/utils";

const emptyErrors: AuthFormErrors = { form: [], fields: {} };

type SellerOnboardingFormProps = {
  initialCompanyName: string;
  email: string | null;
  nextPath?: string;
  isDev: boolean;
};

export function SellerOnboardingForm({
  initialCompanyName,
  email,
  nextPath,
  isDev,
}: SellerOnboardingFormProps) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [phone, setPhone] = useState("");
  const [phoneVerificationToken, setPhoneVerificationToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<AuthFormErrors>(emptyErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(emptyErrors);

    if (!phoneVerificationToken) {
      setErrors({
        form: ["Подтвердите телефон по коду из SMS"],
        fields: { phoneVerificationToken: "Подтвердите телефон по коду из SMS" },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/seller/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName.trim(),
          phone: phone.trim(),
          phoneVerificationToken,
          ...(nextPath ? { next: nextPath } : {}),
        }),
      });

      const body = (await response.json()) as {
        data?: { redirectTo?: string };
        error?: {
          message: string;
          details?: { fieldErrors?: Record<string, string[]> };
        };
      };

      if (!response.ok) {
        const fields: Record<string, string> = {};
        if (body.error?.details?.fieldErrors) {
          for (const [key, messages] of Object.entries(body.error.details.fieldErrors)) {
            if (messages[0]) {
              fields[key] = messages[0];
            }
          }
        }
        throw new AuthRequestError(body.error?.message ?? "Не удалось сохранить профиль", {
          form: body.error?.message ? [body.error.message] : ["Не удалось сохранить профиль"],
          fields,
        });
      }

      const redirectTo = body.data?.redirectTo ?? "/seller/dashboard";
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      if (error instanceof AuthRequestError) {
        setErrors(error.formErrors);
      } else {
        setErrors({
          form: ["Не удалось сохранить профиль. Попробуйте позже."],
          fields: {},
        });
      }
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormCard
      title="Завершите профиль продавца"
      description="Укажите и подтвердите телефон, чтобы покупатели могли связаться с вами."
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="min-w-0 space-y-5">
        <AuthAlert variant="error" messages={errors.form} />

        <AuthFormField
          label="Название компании или имя продавца"
          htmlFor="onboarding-company"
          error={getFieldError(errors, "company_name")}
        >
          <input
            id="onboarding-company"
            name="company_name"
            type="text"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            className={cn(
              authInputClassName,
              getFieldError(errors, "company_name") &&
                "border-[#FECACA] focus:border-[#DC2626] focus:ring-[#FECACA]",
            )}
            disabled={isSubmitting}
            required
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
          showDevHint={isDev}
        />

        {email ? (
          <AuthFormField label="Email (из Google)" htmlFor="onboarding-email">
            <input
              id="onboarding-email"
              type="email"
              value={email}
              readOnly
              className={cn(authInputClassName, "bg-slate-50 text-[#64748B]")}
            />
          </AuthFormField>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || !phoneVerificationToken}
          className={authButtonClassName}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Сохранение...
            </>
          ) : (
            "Сохранить и перейти в кабинет"
          )}
        </button>
      </form>
    </AuthFormCard>
  );
}
