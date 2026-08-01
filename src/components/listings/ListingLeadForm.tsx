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
import {
  LEAD_MESSAGE_MAX,
  LEAD_MESSAGE_MIN,
  LEAD_QUANTITY_MAX,
} from "@/features/leads/validators/lead.validators";
import { trackLeadSubmit } from "@/lib/analytics/events";
import {
  buildLoginUrl,
  buildRegisterUrl,
  getCurrentPathFromWindow,
} from "@/features/auth/lib/login-redirect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n/useTranslation";

const leadCardClassName =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none";

type ListingLeadFormProps = {
  listingId: string;
  listingTitle: string;
  sellerName: string;
  moq: number;
  unitLabel: string;
  vertical: ListingVertical;
  isAuthenticated: boolean;
  isOwner: boolean;
  restrictionMessage?: string | null;
  defaultPhone?: string | null;
  defaultEmail?: string | null;
};

export function ListingLeadForm({
  listingId,
  listingTitle,
  sellerName,
  moq,
  unitLabel,
  vertical,
  isAuthenticated,
  isOwner,
  restrictionMessage = null,
  defaultPhone = "",
  defaultEmail = "",
}: ListingLeadFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const config = getLeadFormConfig(vertical);
  const defaultMessage = t("lead.messagePlaceholder");
  const [quantity, setQuantity] = useState(String(Math.max(1, moq)));
  const [message, setMessage] = useState(defaultMessage);
  const [contactPhone, setContactPhone] = useState(defaultPhone ?? "");
  const [contactEmail, setContactEmail] = useState(defaultEmail ?? "");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function returnPath(): string {
    return getCurrentPathFromWindow();
  }

  function handleLoginRedirect() {
    router.push(buildLoginUrl(returnPath()));
  }

  function handleRegisterRedirect() {
    router.push(buildRegisterUrl({ returnPath: returnPath() }));
  }

  function mapServerError(error: LeadRequestError): string {
    const code = error.formErrors.messageCode ?? error.message;

    switch (code) {
      case "LEAD_ALREADY_SENT":
        return t("lead.alreadySent");
      case "LEAD_OWN_LISTING":
        return t("lead.error.ownListing");
      case "LEAD_UNAVAILABLE_LISTING":
        return t("lead.error.unavailableListing");
      case "LEAD_MESSAGE_TOO_SHORT":
        return t("lead.validation.messageTooShort");
      case "LEAD_MESSAGE_TOO_LONG":
        return t("lead.validation.messageTooLong");
      case "LEAD_QUANTITY_INVALID":
        return t("lead.validation.quantityInvalid");
      default:
        break;
    }

    if (error.formErrors.code === "CONFLICT") {
      return t("lead.alreadySent");
    }

    if (error.formErrors.fields.message) {
      const fieldCode = error.formErrors.fields.message;
      if (fieldCode === "LEAD_MESSAGE_TOO_SHORT") {
        return t("lead.validation.messageTooShort");
      }
      if (fieldCode === "LEAD_MESSAGE_TOO_LONG") {
        return t("lead.validation.messageTooLong");
      }
    }

    if (error.formErrors.fields.quantity === "LEAD_QUANTITY_INVALID") {
      return t("lead.validation.quantityInvalid");
    }

    return t("lead.error.generic");
  }

  function applyTemplate(template: string) {
    setMessage((current) => {
      const trimmed = current.trim();
      if (!trimmed || trimmed === defaultMessage) {
        return template;
      }
      return `${trimmed}\n${template}`;
    });
  }

  function resetFormForAnotherLead() {
    setQuantity(String(Math.max(1, moq)));
    setMessage(defaultMessage);
    setContactPhone(defaultPhone ?? "");
    setContactEmail(defaultEmail ?? "");
    setFormError(null);
    setFieldErrors({});
    setIsSuccess(false);
  }

  function validateClient(): boolean {
    const nextFieldErrors: Record<string, string> = {};
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      nextFieldErrors.message = t("lead.validation.messageRequired");
    } else if (trimmedMessage.length < LEAD_MESSAGE_MIN) {
      nextFieldErrors.message = t("lead.validation.messageTooShort");
    } else if (trimmedMessage.length > LEAD_MESSAGE_MAX) {
      nextFieldErrors.message = t("lead.validation.messageTooLong");
    }

    if (config.showQuantity) {
      const resolvedQuantity = Number(quantity);
      if (
        !Number.isFinite(resolvedQuantity) ||
        !Number.isInteger(resolvedQuantity) ||
        resolvedQuantity < 1 ||
        resolvedQuantity > LEAD_QUANTITY_MAX
      ) {
        nextFieldErrors.quantity = t("lead.validation.quantityInvalid");
      }
    }

    setFieldErrors(nextFieldErrors);
    return Object.keys(nextFieldErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!isAuthenticated) {
      router.push(buildLoginUrl(returnPath()));
      return;
    }

    if (isOwner) {
      setFormError(t("lead.error.ownListing"));
      return;
    }

    if (!validateClient()) {
      return;
    }

    const resolvedQuantity = config.showQuantity
      ? Number(quantity)
      : Math.max(1, moq || 1);

    setIsPending(true);

    try {
      await createLeadRequest(listingId, {
        quantity: resolvedQuantity,
        message: message.trim(),
        contact_phone: contactPhone.trim() || null,
        contact_email: contactEmail.trim() || null,
      });
      trackLeadSubmit(vertical);
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof LeadRequestError) {
        setFormError(mapServerError(error));
        const mappedFields: Record<string, string> = {};
        for (const [field, value] of Object.entries(error.formErrors.fields)) {
          if (value === "LEAD_MESSAGE_TOO_SHORT") {
            mappedFields[field] = t("lead.validation.messageTooShort");
          } else if (value === "LEAD_MESSAGE_TOO_LONG") {
            mappedFields[field] = t("lead.validation.messageTooLong");
          } else if (value === "LEAD_QUANTITY_INVALID") {
            mappedFields[field] = t("lead.validation.quantityInvalid");
          } else if (!value.startsWith("LEAD_")) {
            mappedFields[field] = value;
          }
        }
        setFieldErrors(mappedFields);
      } else {
        setFormError(t("lead.error.generic"));
      }
    } finally {
      setIsPending(false);
    }
  }

  const listingSummary = (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {t("lead.listingLabel")}
      </p>
      <p className="mt-1 break-words font-semibold text-slate-900 dark:text-slate-100">
        {listingTitle}
      </p>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        {t("lead.sellerLabel")}: {sellerName}
      </p>
    </div>
  );

  if (isSuccess) {
    return (
      <Section
        spacing="none"
        id="listing-seller-message"
        className="scroll-mt-28"
        aria-labelledby="listing-lead-success-title"
      >
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 sm:p-6 dark:border-green-900/60 dark:bg-green-950/30">
          <h3
            id="listing-lead-success-title"
            className="text-lg font-semibold text-green-900 dark:text-green-200"
          >
            {t("lead.successTitle")}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-green-800 dark:text-green-300">
            {t("lead.successDescription")}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl border-green-300 bg-white text-green-900 hover:bg-green-100 sm:w-auto dark:border-green-800 dark:bg-slate-950 dark:text-green-200"
              onClick={resetFormForAnotherLead}
            >
              {t("lead.close")}
            </Button>
            <Button
              type="button"
              className="h-11 w-full rounded-xl bg-blue-600 hover:bg-blue-700 sm:w-auto"
              asChild
            >
              <Link href="/listings">{t("lead.continueBrowsing")}</Link>
            </Button>
          </div>
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
          <h3
            id="listing-lead-login-title"
            className="text-lg font-semibold text-slate-900 dark:text-slate-100"
          >
            {t("lead.loginRequiredTitle")}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t("listing.mobile.signInToRequest")}
          </p>
          {listingSummary}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button
              className="h-11 w-full rounded-xl bg-blue-600 hover:bg-blue-700 sm:w-auto"
              onClick={handleLoginRedirect}
            >
              {t("lead.signIn")}
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-auto"
              onClick={handleRegisterRedirect}
            >
              {t("lead.register")}
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  if (!isOwner && restrictionMessage) {
    return (
      <Section
        spacing="none"
        id="listing-seller-message"
        className="scroll-mt-28"
        aria-labelledby="listing-lead-restricted-title"
      >
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6 dark:border-amber-900/50 dark:bg-amber-950/30">
          <h3
            id="listing-lead-restricted-title"
            className="text-lg font-semibold text-amber-900 dark:text-amber-200"
          >
            {t("lead.title")}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
            {restrictionMessage}
          </p>
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
          <h3
            id="listing-lead-owner-title"
            className="text-lg font-semibold text-slate-900 dark:text-slate-100"
          >
            {t("lead.title")}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {t("form.ownListingLeadNotice")}
          </p>
          <Button variant="outline" className="mt-5 h-11 rounded-xl" asChild>
            <Link href="/account/requests">{t("form.goToLeads")}</Link>
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
      <h2
        id="listing-lead-form-title"
        className="mb-4 text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100"
      >
        {t("lead.title")}
      </h2>

      <div className={leadCardClassName}>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("lead.description")}</p>
        <div className="mt-4">{listingSummary}</div>

        <form onSubmit={(event) => void handleSubmit(event)} className="mt-5 space-y-4">
          <div
            className={
              config.showQuantity ? "grid gap-4 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-1"
            }
          >
            {config.showQuantity ? (
              <div className="space-y-2">
                <label
                  htmlFor="lead-quantity"
                  className="text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  {t("lead.quantityLabel")}
                </label>
                <Input
                  id="lead-quantity"
                  type="number"
                  min={1}
                  max={LEAD_QUANTITY_MAX}
                  step={1}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {config.quantityHint ??
                    `${t("lead.minQuantityHint")} ${moq} ${unitLabel.toLowerCase()}`}
                </p>
                {fieldErrors.quantity ? (
                  <p className="text-xs text-destructive">{fieldErrors.quantity}</p>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-2">
              <label
                htmlFor="lead-phone"
                className="text-sm font-medium text-slate-900 dark:text-slate-100"
              >
                {t("form.phone")}
              </label>
              <Input
                id="lead-phone"
                type="tel"
                value={contactPhone}
                onChange={(event) => setContactPhone(event.target.value)}
                placeholder="+996700000000"
                className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              {fieldErrors.contact_phone ? (
                <p className="text-xs text-destructive">{fieldErrors.contact_phone}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lead-email"
              className="text-sm font-medium text-slate-900 dark:text-slate-100"
            >
              {t("form.email")}
            </label>
            <Input
              id="lead-email"
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              placeholder="buyer@company.kg"
              className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {fieldErrors.contact_email ? (
              <p className="text-xs text-destructive">{fieldErrors.contact_email}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lead-message"
              className="text-sm font-medium text-slate-900 dark:text-slate-100"
            >
              {t("lead.messageLabel")}
            </label>
            <Textarea
              id="lead-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              maxLength={LEAD_MESSAGE_MAX}
              placeholder={t("lead.messagePlaceholder")}
              className="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {fieldErrors.message ? (
              <p className="text-xs text-destructive">{fieldErrors.message}</p>
            ) : null}
          </div>

          {config.templates.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {config.templates.map((template) => (
                <Badge
                  key={template}
                  variant="secondary"
                  className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-slate-800"
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
          ) : null}

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <Button
            type="submit"
            disabled={isPending}
            className="h-11 w-full rounded-xl bg-blue-600 hover:bg-blue-700 sm:w-auto"
          >
            {isPending ? t("lead.sending") : t("lead.submit")}
          </Button>
        </form>
      </div>
    </Section>
  );
}
