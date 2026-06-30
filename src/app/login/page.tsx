"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  getFieldError,
  loginRequest,
  type AuthFormErrors,
} from "@/features/auth/lib/auth-client";

const emptyErrors: AuthFormErrors = { form: [], fields: {} };

export default function LoginPage() {
  const router = useRouter();
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<AuthFormErrors>(emptyErrors);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(emptyErrors);
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await loginRequest(identity, password, rememberMe);
      setSuccessMessage("Вход выполнен успешно. Перенаправление на главную...");
      window.setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 800);
    } catch (error) {
      if (error instanceof AuthRequestError) {
        setErrors(error.formErrors);
      } else {
        setErrors({ form: ["Не удалось выполнить вход. Попробуйте позже."], fields: {} });
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
            title="Вход"
            description="Войдите в аккаунт, чтобы видеть контакты продавцов и отправлять заявки."
          />

          <form
            onSubmit={handleSubmit}
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

            <FormField label="Email или телефон" htmlFor="login-identity">
              <input
                id="login-identity"
                name="identity"
                type="text"
                autoComplete="username"
                placeholder="name@company.kg или +996..."
                value={identity}
                onChange={(event) => setIdentity(event.target.value)}
                className={inputClassName}
                disabled={isSubmitting}
              />
              {getFieldError(errors, "email") || getFieldError(errors, "phone") ? (
                <p className="text-xs text-red-600">
                  {getFieldError(errors, "email") ?? getFieldError(errors, "phone")}
                </p>
              ) : null}
            </FormField>

            <FormField label="Пароль" htmlFor="login-password">
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Введите пароль"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClassName}
                disabled={isSubmitting}
              />
              {getFieldError(errors, "password") ? (
                <p className="text-xs text-red-600">{getFieldError(errors, "password")}</p>
              ) : null}
            </FormField>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                disabled={isSubmitting}
                className="rounded border-slate-300 text-blue-600"
              />
              Запомнить меня
            </label>

            <button type="submit" disabled={isSubmitting} className={buttonPrimaryClassName}>
              {isSubmitting ? "Вход..." : "Войти"}
            </button>

            <p className="text-center text-sm text-slate-600">
              Нет аккаунта?{" "}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700">
                Зарегистрироваться
              </Link>
            </p>
          </form>
        </div>
      </Container>
    </main>
  );
}
