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

export function PhoneOtpFields({
  phone,
  onPhoneChange,
  phoneVerificationToken,
  onVerified,
  onTokenReset,
  errors,
  disabled = false,
  phoneHint = "На этот номер покупатели смогут связаться с вами.",
  showDevHint = false,
}: PhoneOtpFieldsProps) {
  const [code, setCode] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [devToastCode, setDevToastCode] = useState<string | null>(null);
  const [demoModeToast, setDemoModeToast] = useState(false);

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
      setOtpMessage(result.message);
      setCooldown(result.resendAvailableInSeconds || 60);
      setCode("");
      if (result.devOtpCode) {
        setDevToastCode(result.devOtpCode);
        setDemoModeToast(Boolean(result.demoMode));
      }
    } catch (error) {
      if (error instanceof AuthRequestError) {
        setOtpError(error.message);
      } else {
        setOtpError("Не удалось отправить код");
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
        setOtpError(error.message);
      } else {
        setOtpError("Не удалось подтвердить код");
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
                Код подтверждения
              </p>
              <p className="mt-1 text-base font-bold tracking-wider text-slate-900 dark:text-slate-50">
                Dev-код: {devToastCode}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {demoModeToast
                  ? "Демо-режим: код показан только для тестирования"
                  : "Только для локального тестирования"}
              </p>
              {demoModeToast ? (
                <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-400">
                  Демо-режим production. Отключите DEMO_OTP_ENABLED перед реальным запуском.
                </p>
              ) : null}
            </div>
            <button
              type="button"
              aria-label="Закрыть"
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
        label="Телефон"
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
            setDevToastCode(null);
            setDemoModeToast(false);
          }}
          className={cn(
            authInputClassName,
            phoneError && "border-[#FECACA] focus:border-[#DC2626] focus:ring-[#FECACA]",
          )}
          disabled={disabled || verified}
          required
        />
      </AuthFormField>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => void handleSendCode()}
          disabled={disabled || isSending || cooldown > 0 || !phone.trim() || verified}
          className={cn(
            authButtonClassName,
            "bg-white text-[#0F172A] ring-1 ring-inset ring-slate-200 hover:bg-slate-50 sm:w-auto sm:min-w-[160px]",
          )}
        >
          {isSending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Отправка...
            </>
          ) : cooldown > 0 ? (
            `Повтор через ${cooldown}с`
          ) : (
            "Получить код"
          )}
        </button>
      </div>

      {otpMessage ? <p className="text-sm text-[#059669]">{otpMessage}</p> : null}
      {otpError ? <p className="text-sm text-[#DC2626]">{otpError}</p> : null}
      {tokenError && !verified ? <p className="text-sm text-[#DC2626]">{tokenError}</p> : null}

      {!verified ? (
        <AuthFormField label="Код подтверждения" htmlFor="otp-code">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="otp-code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="6 цифр"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              className={cn(authInputClassName, "sm:flex-1")}
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
                  Проверка...
                </>
              ) : (
                "Подтвердить телефон"
              )}
            </button>
          </div>
        </AuthFormField>
      ) : (
        <p className="rounded-xl bg-[#ECFDF5] px-3 py-2 text-sm font-medium text-[#047857]">
          Телефон подтверждён
        </p>
      )}

      {showDevHint ? (
        <p className="text-xs text-[#94A3B8]">
          В режиме разработки код также появляется справа сверху и в server console
        </p>
      ) : null}
    </div>
  );
}
