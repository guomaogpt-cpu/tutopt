"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import {
  LeadRequestError,
  createLeadRequest,
} from "@/features/leads/lib/leads-client";
import { buildLoginUrl, getCurrentPathFromWindow } from "@/features/auth/lib/login-redirect";

const QUICK_TEMPLATES = [
  "Есть в наличии?",
  "Какая цена при опте?",
  "Можно получить КП?",
  "Какие условия доставки?",
] as const;

type ListingLeadFormProps = {
  listingId: string;
  sellerName: string;
  moq: number;
  unitLabel: string;
  isAuthenticated: boolean;
  isOwner: boolean;
  defaultPhone?: string | null;
  defaultEmail?: string | null;
};

const fieldClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export function ListingLeadForm({
  listingId,
  sellerName,
  moq,
  unitLabel,
  isAuthenticated,
  isOwner,
  defaultPhone = "",
  defaultEmail = "",
}: ListingLeadFormProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(String(moq));
  const [message, setMessage] = useState("Здравствуйте! Интересует товар...");
  const [contactPhone, setContactPhone] = useState(defaultPhone ?? "");
  const [contactEmail, setContactEmail] = useState(defaultEmail ?? "");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loginHref, setLoginHref] = useState("/login");

  useEffect(() => {
    setLoginHref(buildLoginUrl(getCurrentPathFromWindow()));
  }, []);

  function applyTemplate(template: string) {
    setMessage((current) => {
      const trimmed = current.trim();
      if (!trimmed || trimmed === "Здравствуйте! Интересует товар...") {
        return template;
      }
      return `${trimmed}\n${template}`;
    });
  }

  function resetFormForAnotherLead() {
    setQuantity(String(moq));
    setMessage("Здравствуйте! Интересует товар...");
    setContactPhone(defaultPhone ?? "");
    setContactEmail(defaultEmail ?? "");
    setFormError(null);
    setFieldErrors({});
    setIsSuccess(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    if (!isAuthenticated) {
      router.push(buildLoginUrl(getCurrentPathFromWindow()));
      return;
    }

    if (isOwner) {
      setFormError("Нельзя отправить заявку на своё объявление");
      return;
    }

    setIsPending(true);

    try {
      await createLeadRequest(listingId, {
        quantity: Number(quantity),
        message,
        contact_phone: contactPhone || null,
        contact_email: contactEmail || null,
      });
      setIsSuccess(true);
      router.refresh();
    } catch (error) {
      if (error instanceof LeadRequestError) {
        setFormError(error.formErrors.form[0] ?? null);
        setFieldErrors(error.formErrors.fields);
      } else {
        setFormError("Не удалось отправить заявку. Попробуйте ещё раз.");
      }
    } finally {
      setIsPending(false);
    }
  }

  if (isSuccess) {
    return (
      <section
        id="listing-seller-message"
        className="scroll-mt-28 rounded-2xl border border-green-200 bg-green-50 p-6 lg:p-8"
      >
        <h2 className="text-xl font-semibold text-green-900">Заявка отправлена</h2>
        <p className="mt-3 text-sm leading-relaxed text-green-800">
          Поставщик {sellerName} получит вашу заявку и сможет связаться с вами по указанным
          контактам. Можно отправить ещё одну заявку по этому объявлению.
        </p>
        <button
          type="button"
          onClick={resetFormForAnotherLead}
          className="mt-5 inline-flex rounded-xl border border-green-300 bg-white px-5 py-3 text-sm font-semibold text-green-900 transition hover:bg-green-100"
        >
          Отправить ещё заявку
        </button>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section
        id="listing-seller-message"
        className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 lg:p-8"
      >
        <h2 className="text-xl font-semibold text-slate-900">Отправить заявку</h2>
        <p className="mt-2 text-sm text-slate-600">
          Войдите, чтобы отправить заявку поставщику {sellerName}.
        </p>
        <Link
          href={loginHref}
          className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Войти
        </Link>
      </section>
    );
  }

  if (isOwner) {
    return (
      <section
        id="listing-seller-message"
        className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 lg:p-8"
      >
        <h2 className="text-xl font-semibold text-slate-900">Отправить заявку</h2>
        <p className="mt-2 text-sm text-slate-600">
          Это ваше объявление — заявки от покупателей появятся в разделе «Заявки».
        </p>
        <Link
          href="/seller/leads"
          className="mt-5 inline-flex rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50/40"
        >
          Перейти к заявкам
        </Link>
      </section>
    );
  }

  return (
    <section
      id="listing-seller-message"
      className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 lg:p-8"
    >
      <h2 className="text-xl font-semibold text-slate-900">Отправить заявку</h2>
      <p className="mt-2 text-sm text-slate-500">
        Опишите интерес к товару — поставщик {sellerName} получит заявку и свяжется с вами.
      </p>

      <form onSubmit={(event) => void handleSubmit(event)} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="lead-quantity" className="text-sm font-medium text-slate-700">
              Количество
            </label>
            <input
              id="lead-quantity"
              type="number"
              min={1}
              step={1}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className={fieldClassName}
              required
            />
            <p className="text-xs text-slate-500">
              Мин. партия: {moq} {unitLabel.toLowerCase()}
            </p>
            {fieldErrors.quantity ? (
              <p className="text-xs text-red-600">{fieldErrors.quantity}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="lead-phone" className="text-sm font-medium text-slate-700">
              Телефон
            </label>
            <input
              id="lead-phone"
              type="tel"
              value={contactPhone}
              onChange={(event) => setContactPhone(event.target.value)}
              placeholder="+996700000000"
              className={fieldClassName}
            />
            {fieldErrors.contact_phone ? (
              <p className="text-xs text-red-600">{fieldErrors.contact_phone}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="lead-email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="lead-email"
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            placeholder="buyer@company.kg"
            className={fieldClassName}
          />
          {fieldErrors.contact_email ? (
            <p className="text-xs text-red-600">{fieldErrors.contact_email}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="lead-message" className="text-sm font-medium text-slate-700">
            Сообщение
          </label>
          <textarea
            id="lead-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            className={fieldClassName}
            placeholder="Здравствуйте! Интересует товар..."
          />
          {fieldErrors.message ? (
            <p className="text-xs text-red-600">{fieldErrors.message}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_TEMPLATES.map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => applyTemplate(template)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50"
            >
              {template}
            </button>
          ))}
        </div>

        {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? "Отправка..." : "Отправить заявку"}
        </button>
      </form>
    </section>
  );
}
