"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { AuthFormField } from "@/components/auth/AuthFormCard";
import { authButtonClassName, authInputClassName } from "@/components/auth/auth-form-styles";
import {
  AuthRequestError,
  getFieldError,
  sendOtpRequest,
  verifyOtpRequest,
  type AuthFormErrors,
} from "@/features/auth/lib/auth-client";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type PhoneOtpFieldsProps = {
  phone: string;
  onPhoneChange: (value: string) => void;
  phoneVerificationToken: string | null;
  onVerified: (token: string) => void;
  onTokenReset: () => void;
  errors: AuthFormErrors;
  disabled?: boolean;
  phoneHint?: string;
  showDevHint?: boolean;
};

function sanitizeOtpError(raw: string, fallback: string): string {
  if (
    raw.includes("Prisma") ||
    raw.includes("\n") ||
    raw.toLowerCase().includes("stack") ||
    raw.length > 160
  ) {
    return fallback;
  }
  return raw;
}

export function PhoneOtpFields({
  phone,
  onPhoneChange,
  phoneVerificationToken,
  onVerified,
  onTokenReset,
  errors,
  disabled = false,
  phoneHint,
  showDevHint = false,
}: PhoneOtpFieldsProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [devToastCode, setDevToastCode] = useState<string | null>(null);
  const [demoModeToast, setDemoModeToast] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }
    const timer = window.setInterval(() => {
      setCooldown((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!devToastCode) {
      return;
    }
    const timer = window.setTimeout(() => {
      setDevToastCode(null);
      setDemoModeToast(false);
    }, 10000);
    return () => window.clearTimeout(timer);
  }, [devToastCode]);

  async function handleSendCode() {
    setOtpError("");
    setOtpMessage("");
    setDevToastCode(null);
    setDemoModeToast(false);
    setIsSending(true);
    onTokenReset();

    try {
      const result = await sendOtpRequest(phone);
      setOtpMessage(t("auth.codeSent"));
      setCodeSent(true);
      setCooldown(result.resendAvailableInSeconds || 60);
      setCode("");
      if (result.devOtpCode) {
        setDevToastCode(result.devOtpCode);
        setDemoModeToast(Boolean(result.demoMode));
      }
    } catch (error) {
      if (error instanceof AuthRequestError) {
        setOtpError(sanitizeOtpError(error.message, t("auth.tryAgainLater")));
      } else {
        setOtpError(t("auth.tryAgainLater"));
      }
    } finally {
      setIsSending(false);
    }
  }

  async function handleVerifyCode() {
    setOtpError("");
    setIsVerifying(true);

    try {
      const result = await verifyOtpRequest(phone, code);
      onVerified(result.phoneVerificationToken);
      setOtpMessage(result.message);
      setDevToastCode(null);
    } catch (error) {
      if (error instanceof AuthRequestError) {
        const raw = error.message.toLowerCase();
        if (raw.includes("истёк") || raw.includes("expired")) {
          setOtpError(t("auth.codeExpired"));
        } else if (raw.includes("неверн") || raw.includes("invalid")) {
          setOtpError(t("auth.invalidCode"));
        } else {
          setOtpError(sanitizeOtpError(error.message, t("auth.invalidCode")));
        }
      } else {
        setOtpError(t("auth.tryAgainLater"));
      }
    } finally {
      setIsVerifying(false);
    }
  }

  const phoneError = getFieldError(errors, "phone");
  const tokenError = getFieldError(errors, "phoneVerificationToken");
  const verified = Boolean(phoneVerificationToken);

  return (
    <div className="min-w-0 space-y-4">
      {devToastCode ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "fixed top-4 right-4 z-50 w-[min(100%-2rem,320px)]",
            "rounded-2xl border border-slate-200 bg-white p-4 shadow-lg",
            "dark:border-slate-700 dark:bg-slate-950",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t("auth.confirmCode")}
              </p>
              <p className="mt-1 text-base font-bold tracking-wider text-slate-900 dark:text-slate-50">
                Dev: {devToastCode}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {demoModeToast
                  ? "Демо-режим: код показан только для тестирования"
                  : "Только для локального тестирования"}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => {
                setDevToastCode(null);
                setDemoModeToast(false);
              }}
              className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <AuthFormField
        label={t("auth.phone")}
        htmlFor="otp-phone"
        hint={phoneHint}
        error={phoneError}
      >
        <input
          id="otp-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+996 XXX XXX XXX"
          value={phone}
          onChange={(event) => {
            onPhoneChange(event.target.value);
            onTokenReset();
            setOtpMessage("");
            setOtpError("");
            setCodeSent(false);
            setDevToastCode(null);
            setDemoModeToast(false);
          }}
          className={cn(
            authInputClassName,
            phoneError && "border-red-200 focus:border-red-600 focus:ring-red-200",
          )}
          disabled={disabled || verified}
          required
        />
      </AuthFormField>

      <button
        type="button"
        onClick={() => void handleSendCode()}
        disabled={disabled || isSending || cooldown > 0 || !phone.trim() || verified}
        className={cn(
          authButtonClassName,
          "bg-white text-slate-900 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-900",
        )}
      >
        {isSending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            {t("auth.sendCode")}...
          </>
        ) : cooldown > 0 ? (
          `${t("auth.resendCode")} (${cooldown}с)`
        ) : codeSent ? (
          t("auth.resendCode")
        ) : (
          t("auth.sendCode")
        )}
      </button>

      {otpMessage ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{otpMessage}</p>
      ) : null}
      {otpError ? <p className="text-sm text-red-600 dark:text-red-400">{otpError}</p> : null}
      {tokenError && !verified ? (
        <p className="text-sm text-red-600 dark:text-red-400">{tokenError}</p>
      ) : null}

      {!verified ? (
        <AuthFormField
          label={t("auth.confirmCode")}
          htmlFor="otp-code"
          hint={codeSent ? t("auth.enterSmsCode") : undefined}
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="otp-code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="••••••"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className={cn(
                authInputClassName,
                "text-center text-xl font-semibold tracking-[0.35em] sm:flex-1 sm:text-left sm:text-base sm:font-normal sm:tracking-normal",
              )}
              disabled={disabled || isVerifying}
            />
            <button
              type="button"
              onClick={() => void handleVerifyCode()}
              disabled={disabled || isVerifying || code.length !== 6}
              className={cn(authButtonClassName, "sm:w-auto sm:min-w-[180px]")}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ...
                </>
              ) : (
                t("auth.confirmCode")
              )}
            </button>
          </div>
        </AuthFormField>
      ) : (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          {t("auth.phoneVerified")}
        </p>
      )}

      {showDevHint ? (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Dev: код также появляется справа сверху и в server console
        </p>
      ) : null}
    </div>
  );
}
