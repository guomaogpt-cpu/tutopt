"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Container } from "@/components/layout/Container";
import {
  FormField,
  buttonPrimaryClassName,
  inputClassName,
} from "@/components/public/FormField";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import {
  AuthRequestError,
  forgotPasswordRequest,
  getFieldError,
  type AuthFormErrors,
} from "@/features/auth/lib/auth-client";

const emptyErrors: AuthFormErrors = { form: [], fields: {} };

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<AuthFormErrors>(emptyErrors);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(emptyErrors);
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const { message } = await forgotPasswordRequest(email.trim());
      setSuccessMessage(message);
    } catch (error) {
      if (error instanceof AuthRequestError) {
        setErrors(error.formErrors);
      } else {
        setErrors({
          form: ["Не удалось отправить запрос. Попробуйте позже."],
          fields: {},
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="bg-slate-50 py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-md">
          <PublicPageHeader
            title="Восстановление пароля"
            description="Укажите email аккаунта. Если он зарегистрирован, вы получите инструкции по сбросу пароля."
          />

          <form
            onSubmit={(event) => void handleSubmit(event)}
            className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
          >
            {successMessage ? (
              <div
                role="status"
                className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
              >
                {successMessage}
              </div>
            ) : null}

            {errors.form.length > 0 ? (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                <ul className="space-y-1">
                  {errors.form.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <FormField label="Email" htmlFor="forgot-email">
              <input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.kg"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClassName}
                disabled={isSubmitting}
                required
              />
              {getFieldError(errors, "email") ? (
                <p className="text-xs text-red-600">{getFieldError(errors, "email")}</p>
              ) : null}
            </FormField>

            <button type="submit" disabled={isSubmitting} className={buttonPrimaryClassName}>
              {isSubmitting ? "Отправка..." : "Отправить инструкции"}
            </button>

            <p className="text-center text-sm text-slate-600">
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
                Вернуться ко входу
              </Link>
            </p>
          </form>
        </div>
      </Container>
    </main>
  );
}
