"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { Container } from "@/components/layout/Container";
import {
  FormField,
  buttonPrimaryClassName,
  inputClassName,
} from "@/components/public/FormField";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import {
  AuthRequestError,
  getFieldError,
  resetPasswordRequest,
  type AuthFormErrors,
} from "@/features/auth/lib/auth-client";

const emptyErrors: AuthFormErrors = { form: [], fields: {} };

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<AuthFormErrors>(emptyErrors);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(emptyErrors);
    setSuccessMessage("");

    if (!token) {
      setErrors({ form: ["Ссылка для сброса пароля недействительна."], fields: {} });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ form: [], fields: { password: "Пароли не совпадают" } });
      return;
    }

    setIsSubmitting(true);

    try {
      const { message } = await resetPasswordRequest(token, password);
      setSuccessMessage(message);
      window.setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1200);
    } catch (error) {
      if (error instanceof AuthRequestError) {
        setErrors(error.formErrors);
      } else {
        setErrors({
          form: ["Не удалось изменить пароль. Попробуйте позже."],
          fields: {},
        });
      }
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm text-red-800">Ссылка для сброса пароля недействительна или устарела.</p>
        <Link
          href="/forgot-password"
          className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Запросить новую ссылку
        </Link>
      </div>
    );
  }

  return (
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

      <FormField label="Новый пароль" htmlFor="reset-password">
        <input
          id="reset-password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Минимум 8 символов"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
          required
        />
        {getFieldError(errors, "password") ? (
          <p className="text-xs text-red-600">{getFieldError(errors, "password")}</p>
        ) : null}
      </FormField>

      <FormField label="Повторите пароль" htmlFor="reset-password-confirm">
        <input
          id="reset-password-confirm"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
          required
        />
      </FormField>

      <button type="submit" disabled={isSubmitting} className={buttonPrimaryClassName}>
        {isSubmitting ? "Сохранение..." : "Сохранить новый пароль"}
      </button>

      <p className="text-center text-sm text-slate-600">
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
          Вернуться ко входу
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="bg-slate-50 py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-md">
          <PublicPageHeader
            title="Новый пароль"
            description="Придумайте новый пароль для входа в аккаунт."
          />

          <Suspense
            fallback={
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <p className="text-sm text-slate-500">Загрузка формы...</p>
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}
