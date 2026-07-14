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

type SellerUpgradeFormProps = {
  currentName: string;
  currentPhone: string | null;
  phoneVerified: boolean;
  nextPath?: string;
  isDev: boolean;
};

export function SellerUpgradeForm({
  currentName,
  currentPhone,
  phoneVerified,
  nextPath,
  isDev,
}: SellerUpgradeFormProps) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState(currentName);
  const [phone, setPhone] = useState("");
  const [phoneVerificationToken, setPhoneVerificationToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<AuthFormErrors>(emptyErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(emptyErrors);

    if (!phoneVerified && !phoneVerificationToken) {
      setErrors({
        form: ["Подтвердите телефон по коду из SMS"],
        fields: { phoneVerificationToken: "Подтвердите телефон по коду из SMS" },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/seller/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName.trim(),
          ...(phoneVerified
            ? {}
            : {
                phone: phone.trim(),
                phoneVerificationToken,
              }),
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
        throw new AuthRequestError(body.error?.message ?? "Не удалось стать продавцом", {
          form: body.error?.message ? [body.error.message] : ["Не удалось стать продавцом"],
          fields,
        });
      }

      router.push(body.data?.redirectTo ?? "/seller/dashboard");
      router.refresh();
    } catch (error) {
      if (error instanceof AuthRequestError) {
        setErrors(error.formErrors);
      } else {
        setErrors({
          form: ["Не удалось стать продавцом. Попробуйте позже."],
          fields: {},
        });
      }
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormCard
      title="Стать продавцом"
      description="Заполните данные продавца, чтобы публиковать товары и получать заявки."
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="min-w-0 space-y-5">
        <AuthAlert variant="error" messages={errors.form} />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-900">Текущий аккаунт:</span> {currentName}
          </p>
          {currentPhone ? (
            <p className="mt-1">
              <span className="font-medium text-slate-900">Телефон:</span> {currentPhone}
              {phoneVerified ? " · подтверждён" : ""}
            </p>
          ) : (
            <p className="mt-1 text-slate-500">Телефон пока не указан</p>
          )}
        </div>

        <AuthFormField
          label="Название компании или имя продавца"
          htmlFor="upgrade-company"
          error={getFieldError(errors, "company_name")}
        >
          <input
            id="upgrade-company"
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

        {phoneVerified && currentPhone ? (
          <AuthFormField label="Телефон" htmlFor="upgrade-phone-readonly">
            <input
              id="upgrade-phone-readonly"
              type="tel"
              value={currentPhone}
              readOnly
              className={cn(authInputClassName, "bg-slate-50 text-[#64748B]")}
            />
          </AuthFormField>
        ) : (
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
        )}

        <button
          type="submit"
          disabled={isSubmitting || (!phoneVerified && !phoneVerificationToken)}
          className={authButtonClassName}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Сохранение...
            </>
          ) : (
            "Стать продавцом"
          )}
        </button>
      </form>
    </AuthFormCard>
  );
}
