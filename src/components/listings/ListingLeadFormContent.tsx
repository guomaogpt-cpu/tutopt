"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { ListingVertical } from "@prisma/client";
import {
  LeadRequestError,
  createLeadRequest,
} from "@/features/leads/lib/leads-client";
import { buildDefaultLeadMessage } from "@/features/leads/lib/build-default-lead-message";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getVerticalTheme } from "@/lib/vertical-theme";
import { cn } from "@/lib/utils";

export type ListingLeadFormContentProps = {
  listingId: string;
  listingTitle: string;
  sellerName: string;
  moq: number;
  unitLabel: string;
  vertical: ListingVertical;
  isAuthenticated: boolean;
  isOwner: boolean;
  restrictionMessage?: string | null;
  defaultName?: string | null;
  defaultPhone?: string | null;
  defaultEmail?: string | null;
  compact?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
};

export function ListingLeadFormContent({
  listingId,
  listingTitle,
  sellerName: _sellerName,
  moq,
  unitLabel,
  vertical,
  isAuthenticated,
  isOwner,
  restrictionMessage = null,
  defaultName = "",
  defaultPhone = "",
  defaultEmail = "",
  compact = false,
  onSuccess,
  onClose: _onClose,
}: ListingLeadFormContentProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = getVerticalTheme(vertical);
  const config = getLeadFormConfig(vertical);
  const defaultMessage = buildDefaultLeadMessage(listingTitle);

  const [quantity, setQuantity] = useState(String(Math.max(1, moq)));
  const [message, setMessage] = useState(defaultMessage);
  const [contactPhone, setContactPhone] = useState(defaultPhone ?? "");
  const [contactEmail, setContactEmail] = useState(defaultEmail ?? "");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const requiresPhone = !defaultPhone?.trim();

  function returnPath(): string {
    return getCurrentPathFromWindow();
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
      case "LEAD_PHONE_REQUIRED":
        return t("lead.validation.phoneRequired");
      default:
        break;
    }

    if (error.formErrors.code === "CONFLICT") {
      return t("lead.alreadySent");
    }

    return t("lead.error.generic");
  }

  function validateClient(): boolean {
    const nextFieldErrors: Record<string, string> = {};
    const trimmedMessage = message.trim();
    const trimmedPhone = contactPhone.trim();

    if (!trimmedMessage) {
      nextFieldErrors.message = t("lead.validation.messageRequired");
    } else if (trimmedMessage.length < LEAD_MESSAGE_MIN) {
      nextFieldErrors.message = t("lead.validation.messageTooShort");
    } else if (trimmedMessage.length > LEAD_MESSAGE_MAX) {
      nextFieldErrors.message = t("lead.validation.messageTooLong");
    }

    if (requiresPhone && !trimmedPhone) {
      nextFieldErrors.contact_phone = t("lead.validation.phoneRequired");
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

  async function submitLead(forceResend = false) {
    setFormError(null);
    setIsDuplicate(false);

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
        force_resend: forceResend,
      });
      trackLeadSubmit(vertical);
      setIsSuccess(true);
      onSuccess?.();
    } catch (error) {
      if (error instanceof LeadRequestError) {
        const code = error.formErrors.messageCode ?? error.message;
        if (code === "LEAD_ALREADY_SENT" || error.formErrors.code === "CONFLICT") {
          setIsDuplicate(true);
          setFormError(t("lead.alreadySent"));
          return;
        }
        setFormError(mapServerError(error));
      } else {
        setFormError(t("lead.error.generic"));
      }
    } finally {
      setIsPending(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAuthenticated) {
      router.push(buildLoginUrl(returnPath()));
      return;
    }

    if (isOwner) {
      setFormError(t("lead.error.ownListing"));
      return;
    }

    await submitLead(false);
  }

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">
            {t("lead.successTitle")}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-green-800 dark:text-green-300">
            {t("lead.successDescriptionSellerContact")}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl"
            asChild
          >
            <Link href={`/listings/${listingId}`}>{t("lead.backToListing")}</Link>
          </Button>
          <Button type="button" className={cn("h-11 w-full rounded-xl", theme.primaryButton)} asChild>
            <Link href="/listings">{t("lead.continueBrowsing")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isDuplicate) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("lead.alreadySent")}</p>
        <div className="flex flex-col gap-2">
          <Button type="button" className={cn("h-11 w-full rounded-xl", theme.primaryButton)} asChild>
            <Link href="/account/requests?tab=sent">{t("lead.openMyRequests")}</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl"
            asChild
          >
            <Link href={`/listings/${listingId}`}>{t("lead.backToListing")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t("listing.mobile.signInToRequest")}
        </p>
        <div className="flex flex-col gap-2">
          <Button
            className={cn("h-11 w-full rounded-xl", theme.primaryButton)}
            onClick={() => router.push(buildLoginUrl(returnPath()))}
          >
            {t("lead.signIn")}
          </Button>
          <Button
            variant="outline"
            className="h-11 w-full rounded-xl"
            onClick={() => router.push(buildRegisterUrl({ returnPath: returnPath() }))}
          >
            {t("lead.register")}
          </Button>
        </div>
      </div>
    );
  }

  if (!isOwner && restrictionMessage) {
    return <p className="text-sm text-amber-800 dark:text-amber-300">{restrictionMessage}</p>;
  }

  if (isOwner) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("form.ownListingLeadNotice")}</p>
        <Button variant="outline" className="h-11 w-full rounded-xl" asChild>
          <Link href="/account/requests?tab=received">{t("form.goToLeads")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
      {!compact ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("lead.description")}</p>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="lead-name" className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {t("lead.nameLabel")}
        </label>
        <Input
          id="lead-name"
          value={defaultName ?? ""}
          readOnly
          className="h-11 w-full rounded-xl border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      <div
        className={
          config.showQuantity ? "grid gap-4 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-1"
        }
      >
        {config.showQuantity ? (
          <div className="space-y-2">
            <label htmlFor="lead-quantity" className="text-sm font-medium text-slate-900 dark:text-slate-100">
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
              className="h-11 w-full rounded-xl"
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
          <label htmlFor="lead-phone" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {t("lead.phoneLabel")}
            {requiresPhone ? " *" : null}
          </label>
          <Input
            id="lead-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={contactPhone}
            onChange={(event) => setContactPhone(event.target.value)}
            placeholder="+996700000000"
            className="h-11 w-full rounded-xl"
            required={requiresPhone}
          />
          {fieldErrors.contact_phone ? (
            <p className="text-xs text-destructive">{fieldErrors.contact_phone}</p>
          ) : null}
        </div>
      </div>

      {config.showEmail ? (
        <div className="space-y-2">
          <label htmlFor="lead-email" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {t("form.email")}
          </label>
          <Input
            id="lead-email"
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            placeholder="buyer@company.kg"
            className="h-11 w-full rounded-xl"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="lead-message" className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {t("lead.messageLabel")}
        </label>
        <Textarea
          id="lead-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={compact ? 4 : 5}
          maxLength={LEAD_MESSAGE_MAX}
          className="w-full rounded-xl"
        />
        {fieldErrors.message ? (
          <p className="text-xs text-destructive">{fieldErrors.message}</p>
        ) : null}
      </div>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

      <Button
        type="submit"
        disabled={isPending}
        className={cn("h-11 w-full rounded-xl", theme.primaryButton)}
      >
        {isPending ? t("lead.sending") : t("lead.submitRequest")}
      </Button>
    </form>
  );
}
