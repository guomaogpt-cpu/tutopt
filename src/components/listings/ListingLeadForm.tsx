"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { ListingVertical } from "@prisma/client";
import {
  LeadRequestError,
  createLeadRequest,
} from "@/features/leads/lib/leads-client";
import { getLeadFormConfig } from "@/features/leads/lib/lead-form-config";
import { trackLeadSubmit } from "@/lib/analytics/events";
import { buildLoginUrl, getCurrentPathFromWindow } from "@/features/auth/lib/login-redirect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { Textarea } from "@/components/ui/textarea";

const leadCardClassName =
  "rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-sm sm:p-6";

type ListingLeadFormProps = {
  listingId: string;
  sellerName: string;
  moq: number;
  unitLabel: string;
  vertical: ListingVertical;
  isAuthenticated: boolean;
  isOwner: boolean;
  defaultPhone?: string | null;
  defaultEmail?: string | null;
};

export function ListingLeadForm({
  listingId,
  sellerName,
  moq,
  unitLabel,
  vertical,
  isAuthenticated,
  isOwner,
  defaultPhone = "",
  defaultEmail = "",
}: ListingLeadFormProps) {
  const router = useRouter();
  const config = getLeadFormConfig(vertical);
  const [quantity, setQuantity] = useState(String(Math.max(1, moq)));
  const [message, setMessage] = useState(config.defaultMessage);
  const [contactPhone, setContactPhone] = useState(defaultPhone ?? "");
  const [contactEmail, setContactEmail] = useState(defaultEmail ?? "");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleLoginRedirect() {
    router.push(buildLoginUrl(getCurrentPathFromWindow()));
  }

  function applyTemplate(template: string) {
    setMessage((current) => {
      const trimmed = current.trim();
      if (!trimmed || trimmed === config.defaultMessage) {
        return template;
      }
      return `${trimmed}\n${template}`;
    });
  }

  function resetFormForAnotherLead() {
    setQuantity(String(Math.max(1, moq)));
    setMessage(config.defaultMessage);
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

    const resolvedQuantity = config.showQuantity
      ? Number(quantity)
      : Math.max(1, moq || 1);

    if (!Number.isFinite(resolvedQuantity) || resolvedQuantity < 1) {
      setFormError("Укажите корректное количество");
      return;
    }

    setIsPending(true);

    try {
      await createLeadRequest(listingId, {
        quantity: resolvedQuantity,
        message,
        contact_phone: contactPhone || null,
        contact_email: contactEmail || null,
      });
      trackLeadSubmit(vertical);
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
      <Section
        spacing="none"
        id="listing-seller-message"
        className="scroll-mt-28"
        aria-labelledby="listing-lead-success-title"
      >
        <div className="rounded-[22px] border border-green-200 bg-green-50 p-5 sm:p-6">
          <h3 id="listing-lead-success-title" className="text-lg font-semibold text-green-900">
            {config.successTitle}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-green-800">
            {config.successMessage(sellerName)} Можно отправить ещё одно сообщение по этому
            объявлению.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 rounded-xl border-green-300 bg-white text-green-900 hover:bg-green-100"
            onClick={resetFormForAnotherLead}
          >
            Отправить ещё
          </Button>
        </div>
      </Section>
    );
  }

  if (!isAuthenticated) {
    return (
      <Section
        spacing="none"
        id="listing-seller-message"
        className="scroll-mt-28"
        aria-labelledby="listing-lead-login-title"
      >
        <div className={leadCardClassName}>
          <h3 id="listing-lead-login-title" className="text-lg font-semibold text-[#0F172A]">
            {config.title}
          </h3>
          <p className="mt-2 text-sm text-[#64748B]">{config.loginPrompt(sellerName)}</p>
          <Button className="mt-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]" onClick={handleLoginRedirect}>
            Войти
          </Button>
        </div>
      </Section>
    );
  }

  if (isOwner) {
    return (
      <Section
        spacing="none"
        id="listing-seller-message"
        className="scroll-mt-28"
        aria-labelledby="listing-lead-owner-title"
      >
        <div className={leadCardClassName}>
          <h3 id="listing-lead-owner-title" className="text-lg font-semibold text-[#0F172A]">
            {config.title}
          </h3>
          <p className="mt-2 text-sm text-[#64748B]">
            Это ваше объявление — заявки от клиентов появятся в разделе «Заявки».
          </p>
          <Button variant="outline" className="mt-5 rounded-xl" asChild>
            <Link href="/seller/leads">Перейти к заявкам</Link>
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section
      spacing="none"
      id="listing-seller-message"
      className="scroll-mt-28"
      aria-labelledby="listing-lead-form-title"
    >
      <h2 id="listing-lead-form-title" className="mb-4 text-lg font-bold text-[#0F172A] sm:text-xl">
        {config.title}
      </h2>

      <div className={leadCardClassName}>
        <p className="text-sm text-[#64748B]">{config.subtitle}</p>

        <form onSubmit={(event) => void handleSubmit(event)} className="mt-5 space-y-4">
          <div
            className={
              config.showQuantity ? "grid gap-4 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-1"
            }
          >
            {config.showQuantity ? (
              <div className="space-y-2">
                <label htmlFor="lead-quantity" className="text-sm font-medium text-foreground">
                  {config.quantityLabel}
                </label>
                <Input
                  id="lead-quantity"
                  type="number"
                  min={1}
                  step={1}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="rounded-xl"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {config.quantityHint ??
                    `Мин.: ${moq} ${unitLabel.toLowerCase()}`}
                </p>
                {fieldErrors.quantity ? (
                  <p className="text-xs text-destructive">{fieldErrors.quantity}</p>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="lead-phone" className="text-sm font-medium text-foreground">
                Телефон
              </label>
              <Input
                id="lead-phone"
                type="tel"
                value={contactPhone}
                onChange={(event) => setContactPhone(event.target.value)}
                placeholder="+996700000000"
                className="rounded-xl"
              />
              {fieldErrors.contact_phone ? (
                <p className="text-xs text-destructive">{fieldErrors.contact_phone}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="lead-email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="lead-email"
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              placeholder="buyer@company.kg"
              className="rounded-xl"
            />
            {fieldErrors.contact_email ? (
              <p className="text-xs text-destructive">{fieldErrors.contact_email}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="lead-message" className="text-sm font-medium text-foreground">
              {config.messageLabel}
            </label>
            <Textarea
              id="lead-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder={config.messagePlaceholder}
              className="rounded-xl"
            />
            {fieldErrors.message ? (
              <p className="text-xs text-destructive">{fieldErrors.message}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {config.templates.map((template) => (
              <Badge
                key={template}
                variant="secondary"
                className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                onClick={() => applyTemplate(template)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    applyTemplate(template);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                {template}
              </Badge>
            ))}
          </div>

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <Button
            type="submit"
            disabled={isPending}
            className="h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]"
          >
            {isPending ? "Отправка..." : config.submitLabel}
          </Button>
        </form>
      </div>
    </Section>
  );
}
