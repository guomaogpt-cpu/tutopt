"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
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
  parseIdentity,
  registerRequest,
  type AuthFormErrors,
} from "@/features/auth/lib/auth-client";
import { resolveNextParam } from "@/features/auth/lib/login-redirect";
import type { RegisterInput } from "@/features/auth/validators/auth.validators";

const emptyErrors: AuthFormErrors = { form: [], fields: {} };

type RegisterRole = "BUYER" | "SELLER";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = resolveNextParam(searchParams.get("next"));
  const initialRole = searchParams.get("role") === "SELLER" ? "SELLER" : "BUYER";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RegisterRole>(initialRole);
  const [companyName, setCompanyName] = useState("");
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
    setIsSubmitting(true);

    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    const payload: RegisterInput = {
      name: name.trim(),
      password,
      role: role as RegisterInput["role"],
      ...(trimmedEmail ? { email: trimmedEmail } : {}),
      ...(trimmedPhone ? parseIdentity(trimmedPhone) : {}),
      ...(role === "SELLER" ? { company_name: companyName.trim() } : {}),
    };

    try {
      await registerRequest(payload);
      setSuccessMessage("Регистрация успешна. Перенаправление...");
      window.setTimeout(() => {
        router.push(nextPath);
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

      <FormField label="Имя" htmlFor="register-name">
        <input
          id="register-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Ваше имя"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
        />
        {getFieldError(errors, "name") ? (
          <p className="text-xs text-red-600">{getFieldError(errors, "name")}</p>
        ) : null}
      </FormField>

      <FormField label="Email" htmlFor="register-email" hint="Укажите email или телефон">
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@company.kg"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
        />
        {getFieldError(errors, "email") ? (
          <p className="text-xs text-red-600">{getFieldError(errors, "email")}</p>
        ) : null}
      </FormField>

      <FormField label="Телефон" htmlFor="register-phone">
        <input
          id="register-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+996XXXXXXXXX"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
        />
        {getFieldError(errors, "phone") ? (
          <p className="text-xs text-red-600">{getFieldError(errors, "phone")}</p>
        ) : null}
      </FormField>

      <FormField label="Пароль" htmlFor="register-password">
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Минимум 8 символов"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
        />
        {getFieldError(errors, "password") ? (
          <p className="text-xs text-red-600">{getFieldError(errors, "password")}</p>
        ) : null}
      </FormField>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-700">Тип аккаунта</legend>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
          <input
            type="radio"
            name="role"
            value="BUYER"
            checked={role === "BUYER"}
            onChange={() => setRole("BUYER")}
            disabled={isSubmitting}
            className="text-blue-600"
          />
          <span className="text-sm text-slate-700">Покупатель — ищу оптовые предложения</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
          <input
            type="radio"
            name="role"
            value="SELLER"
            checked={role === "SELLER"}
            onChange={() => setRole("SELLER")}
            disabled={isSubmitting}
            className="text-blue-600"
          />
          <span className="text-sm text-slate-700">Продавец — размещаю объявления</span>
        </label>
        {getFieldError(errors, "role") ? (
          <p className="text-xs text-red-600">{getFieldError(errors, "role")}</p>
        ) : null}
      </fieldset>

      {role === "SELLER" ? (
        <FormField label="Название компании" htmlFor="register-company">
          <input
            id="register-company"
            name="company_name"
            type="text"
            placeholder="ОсОО «Ваша компания»"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            className={inputClassName}
            disabled={isSubmitting}
          />
          {getFieldError(errors, "company_name") ? (
            <p className="text-xs text-red-600">{getFieldError(errors, "company_name")}</p>
          ) : null}
        </FormField>
      ) : null}

      <button type="submit" disabled={isSubmitting} className={buttonPrimaryClassName}>
        {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Уже есть аккаунт?{" "}
        <Link href={loginHref} className="font-medium text-blue-600 hover:text-blue-700">
          Войти
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <main className="bg-slate-50 py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-md">
          <PublicPageHeader
            title="Регистрация"
            description="Создайте аккаунт покупателя или продавца для работы с оптовыми объявлениями."
          />

          <Suspense
            fallback={
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <p className="text-sm text-slate-500">Загрузка формы...</p>
              </div>
            }
          >
            <RegisterForm />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}
