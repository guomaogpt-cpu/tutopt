"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import {
  trackSellerOnboardingComplete,
  trackSellerOnboardingStart,
} from "@/lib/analytics/events";
import { AuthAlert, AuthFormCard, AuthFormField } from "@/components/auth/AuthFormCard";
import { PhoneOtpFields } from "@/components/auth/PhoneOtpFields";
import { authButtonClassName, authInputClassName } from "@/components/auth/auth-form-styles";
import {
  AuthRequestError,
  getFieldError,
  type AuthFormErrors,
} from "@/features/auth/lib/auth-client";
import { useTranslation } from "@/lib/i18n/useTranslation";
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
  const { t } = useTranslation();
  const router = useRouter();
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [phone, setPhone] = useState("");
  const [phoneVerificationToken, setPhoneVerificationToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<AuthFormErrors>(emptyErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    trackSellerOnboardingStart();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(emptyErrors);

    if (!companyName.trim()) {
      setErrors({ form: [t("auth.requiredFields")], fields: {} });
      return;
    }

    if (!phoneVerificationToken) {
      setErrors({
        form: [t("auth.confirmPhoneRequired")],
        fields: { phoneVerificationToken: t("auth.confirmPhoneRequired") },
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
        const message = body.error?.message ?? t("auth.tryAgainLater");
        throw new AuthRequestError(message, {
          form: [message],
          fields,
        });
      }

      const redirectTo = body.data?.redirectTo ?? "/seller/dashboard";
      trackSellerOnboardingComplete();
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      if (error instanceof AuthRequestError) {
        setErrors(error.formErrors);
      } else {
        setErrors({
          form: [t("auth.tryAgainLater")],
          fields: {},
        });
      }
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormCard
      title={t("profile.completeSellerProfile")}
      description={
        email
          ? t("profile.addPhoneForSeller")
          : t("profile.sellerOnboardingDescription")
      }
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="min-w-0 space-y-4 sm:space-y-5">
        <AuthAlert variant="error" messages={errors.form} />

        <AuthFormField
          label={t("auth.sellerNameLabel")}
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
                "border-red-200 focus:border-red-600 focus:ring-red-200",
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
          phoneHint={
            email ? t("profile.addPhoneForSeller") : t("profile.sellerPhoneHint")
          }
          showDevHint={isDev}
        />

        {email ? (
          <AuthFormField label="Email (Google)" htmlFor="onboarding-email">
            <input
              id="onboarding-email"
              type="email"
              value={email}
              readOnly
              className={cn(
                authInputClassName,
                "bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400",
              )}
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
              {t("auth.signingIn")}
            </>
          ) : (
            t("profile.saveSellerProfile")
          )}
        </button>
      </form>
    </AuthFormCard>
  );
}
