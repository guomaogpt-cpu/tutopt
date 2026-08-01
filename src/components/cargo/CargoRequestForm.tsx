"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  CargoRequestError,
  createCargoRequest,
  uploadCargoRequestImage,
} from "@/features/cargo/lib/cargo-requests-client";
import {
  CARGO_COMMENT_MAX,
  CARGO_COMPANY_MAX,
  CARGO_DIMENSIONS_MAX,
  CARGO_ITEM_NAME_MAX,
  CARGO_LOCATION_MAX,
  CARGO_NAME_MAX,
  CARGO_PHONE_MAX,
  CARGO_QUANTITY_MAX,
  CARGO_WEIGHT_MAX,
} from "@/features/cargo/validators/cargo-request.validators";
import {
  CARGO_DIRECTION_IDS,
  CARGO_DIRECTION_LABEL_KEY,
  CARGO_SERVICE_TYPE_IDS,
  CARGO_SERVICE_TYPE_LABEL_KEY,
} from "@/features/cargo/lib/cargo-subscription-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const fieldClassName =
  "h-11 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

const labelClassName = "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200";

const sectionTitleClassName =
  "text-sm font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-300";

type FieldKey =
  | "name"
  | "phone"
  | "company"
  | "fromLocation"
  | "toLocation"
  | "itemName"
  | "itemPhoto"
  | "weight"
  | "dimensions"
  | "quantity"
  | "comment";

type CargoRequestFormProps = {
  variant?: "page" | "modal";
  /** Called after successful submit (e.g. close modal after a short delay). */
  onSuccessClose?: () => void;
};

function mapValidationMessage(
  code: string | undefined,
  t: (key: DictionaryKey) => string,
): string {
  switch (code) {
    case "CARGO_NAME_REQUIRED":
      return t("cargo.validation.nameRequired");
    case "CARGO_PHONE_REQUIRED":
      return t("cargo.validation.phoneRequired");
    case "CARGO_FROM_REQUIRED":
      return t("cargo.validation.fromRequired");
    case "CARGO_TO_REQUIRED":
      return t("cargo.validation.toRequired");
    case "CARGO_ITEM_REQUIRED":
      return t("cargo.validation.itemRequired");
    default:
      return code && code.length > 0 ? code : t("cargo.submitError");
  }
}

export function CargoRequestForm({
  variant = "page",
  onSuccessClose,
}: CargoRequestFormProps) {
  const { t } = useTranslation();
  const isModal = variant === "modal";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [itemName, setItemName] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [quantity, setQuantity] = useState("");
  const [comment, setComment] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [direction, setDirection] = useState("");
  const [itemPhotoUrl, setItemPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setFormError(null);
    setFieldErrors((prev) => ({ ...prev, itemPhoto: undefined }));
    setIsUploading(true);

    try {
      const uploaded = await uploadCargoRequestImage(file);
      setItemPhotoUrl(uploaded.url);
      setPhotoName(file.name);
    } catch (error) {
      setItemPhotoUrl(null);
      setPhotoName(null);
      if (error instanceof CargoRequestError) {
        setFieldErrors((prev) => ({
          ...prev,
          itemPhoto: error.formErrors.form[0] ?? t("cargo.uploadError"),
        }));
      } else {
        setFieldErrors((prev) => ({ ...prev, itemPhoto: t("cargo.uploadError") }));
      }
    } finally {
      setIsUploading(false);
    }
  }

  function clearPhoto() {
    setItemPhotoUrl(null);
    setPhotoName(null);
    setFieldErrors((prev) => ({ ...prev, itemPhoto: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setIsPending(true);

    try {
      await createCargoRequest({
        name,
        phone,
        company: company || null,
        fromLocation,
        toLocation,
        itemName,
        description: null,
        itemPhotoUrl,
        quantity: quantity || null,
        weight: weight || null,
        dimensions: dimensions || null,
        urgency: null,
        comment: comment || null,
        serviceType: serviceType || null,
        direction: direction || null,
      });
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof CargoRequestError) {
        const nextFields: Partial<Record<FieldKey, string>> = {};
        for (const [key, message] of Object.entries(error.formErrors.fields)) {
          nextFields[key as FieldKey] = mapValidationMessage(message, t);
        }
        setFieldErrors(nextFields);
        setFormError(mapValidationMessage(error.formErrors.messageCode, t));
      } else {
        setFormError(t("cargo.submitError"));
      }
    } finally {
      setIsPending(false);
    }
  }

  if (isSuccess) {
    return (
      <div
        className={cn(
          isModal
            ? "py-2"
            : "rounded-2xl border border-orange-200/70 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
        )}
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {t("cargo.requestSuccessTitle")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {t("cargo.requestSuccessDescription")}
        </p>
        {onSuccessClose ? (
          <Button
            type="button"
            onClick={onSuccessClose}
            className="mt-5 h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600 sm:w-auto"
          >
            {t("common.close")}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        isModal
          ? "space-y-0"
          : "rounded-2xl border border-orange-200/70 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
      )}
      noValidate
    >
      {!isModal ? (
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t("cargo.requestTitle")}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {t("cargo.requestDescription")}
          </p>
        </div>
      ) : null}

      <fieldset className="space-y-3">
        <legend className={sectionTitleClassName}>{t("cargo.contactSection")}</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <label htmlFor="cargo-name" className={labelClassName}>
              {t("cargo.name")}
            </label>
            <Input
              id="cargo-name"
              name="name"
              autoComplete="name"
              maxLength={CARGO_NAME_MAX}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={fieldClassName}
              required
            />
            {fieldErrors.name ? (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.name}</p>
            ) : null}
          </div>
          <div className="min-w-0">
            <label htmlFor="cargo-phone" className={labelClassName}>
              {t("cargo.phone")}
            </label>
            <Input
              id="cargo-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={CARGO_PHONE_MAX}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={fieldClassName}
              required
            />
            {fieldErrors.phone ? (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.phone}</p>
            ) : null}
          </div>
          <div className="min-w-0 sm:col-span-2">
            <label htmlFor="cargo-company" className={labelClassName}>
              {t("cargo.company")}
            </label>
            <Input
              id="cargo-company"
              name="company"
              autoComplete="organization"
              maxLength={CARGO_COMPANY_MAX}
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className={fieldClassName}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-5 space-y-3">
        <legend className={sectionTitleClassName}>{t("cargo.routeSection")}</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <label htmlFor="cargo-from" className={labelClassName}>
              {t("cargo.fromLocation")}
            </label>
            <Input
              id="cargo-from"
              name="fromLocation"
              maxLength={CARGO_LOCATION_MAX}
              value={fromLocation}
              onChange={(event) => setFromLocation(event.target.value)}
              className={fieldClassName}
              required
            />
            {fieldErrors.fromLocation ? (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {fieldErrors.fromLocation}
              </p>
            ) : null}
          </div>
          <div className="min-w-0">
            <label htmlFor="cargo-to" className={labelClassName}>
              {t("cargo.toLocation")}
            </label>
            <Input
              id="cargo-to"
              name="toLocation"
              maxLength={CARGO_LOCATION_MAX}
              value={toLocation}
              onChange={(event) => setToLocation(event.target.value)}
              className={fieldClassName}
              required
            />
            {fieldErrors.toLocation ? (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {fieldErrors.toLocation}
              </p>
            ) : null}
          </div>
          <div className="min-w-0">
            <label htmlFor="cargo-service-type" className={labelClassName}>
              {t("cargo.serviceType")}
            </label>
            <select
              id="cargo-service-type"
              name="serviceType"
              value={serviceType}
              onChange={(event) => setServiceType(event.target.value)}
              className={cn(fieldClassName, "w-full px-3")}
            >
              <option value="">—</option>
              {CARGO_SERVICE_TYPE_IDS.map((id) => (
                <option key={id} value={id}>
                  {t(CARGO_SERVICE_TYPE_LABEL_KEY[id])}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0">
            <label htmlFor="cargo-direction" className={labelClassName}>
              {t("cargo.direction")}
            </label>
            <select
              id="cargo-direction"
              name="direction"
              value={direction}
              onChange={(event) => setDirection(event.target.value)}
              className={cn(fieldClassName, "w-full px-3")}
            >
              <option value="">—</option>
              {CARGO_DIRECTION_IDS.map((id) => (
                <option key={id} value={id}>
                  {t(CARGO_DIRECTION_LABEL_KEY[id])}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-5 space-y-3">
        <legend className={sectionTitleClassName}>{t("cargo.itemSection")}</legend>
        <div className="min-w-0">
          <label htmlFor="cargo-item" className={labelClassName}>
            {t("cargo.itemName")}
          </label>
          <Input
            id="cargo-item"
            name="itemName"
            maxLength={CARGO_ITEM_NAME_MAX}
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            className={fieldClassName}
            required
          />
          {fieldErrors.itemName ? (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.itemName}</p>
          ) : null}
        </div>

        <div className="min-w-0">
          <label htmlFor="cargo-photo" className={labelClassName}>
            {t("cargo.itemPhoto")}
          </label>
          <Input
            id="cargo-photo"
            name="itemPhoto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            disabled={isUploading || isPending}
            className={cn(fieldClassName, "h-auto py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-orange-700 dark:file:bg-slate-800 dark:file:text-orange-300")}
          />
          {photoName ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="truncate">{photoName}</span>
              <button
                type="button"
                onClick={clearPhoto}
                className="font-medium text-orange-700 underline-offset-2 hover:underline dark:text-orange-300"
              >
                {t("cargo.removePhoto")}
              </button>
            </div>
          ) : null}
          {isUploading ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t("cargo.uploading")}</p>
          ) : null}
          {fieldErrors.itemPhoto ? (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.itemPhoto}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="min-w-0">
            <label htmlFor="cargo-weight" className={labelClassName}>
              {t("cargo.weight")}
            </label>
            <Input
              id="cargo-weight"
              name="weight"
              maxLength={CARGO_WEIGHT_MAX}
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              className={fieldClassName}
            />
          </div>
          <div className="min-w-0">
            <label htmlFor="cargo-dimensions" className={labelClassName}>
              {t("cargo.dimensions")}
            </label>
            <Input
              id="cargo-dimensions"
              name="dimensions"
              maxLength={CARGO_DIMENSIONS_MAX}
              value={dimensions}
              onChange={(event) => setDimensions(event.target.value)}
              className={fieldClassName}
            />
          </div>
          <div className="min-w-0">
            <label htmlFor="cargo-quantity" className={labelClassName}>
              {t("cargo.quantity")}
            </label>
            <Input
              id="cargo-quantity"
              name="quantity"
              maxLength={CARGO_QUANTITY_MAX}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className={fieldClassName}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-5 space-y-3">
        <legend className={sectionTitleClassName}>{t("cargo.commentSection")}</legend>
        <div className="min-w-0">
          <label htmlFor="cargo-comment" className={labelClassName}>
            {t("cargo.comment")}
          </label>
          <Textarea
            id="cargo-comment"
            name="comment"
            maxLength={CARGO_COMMENT_MAX}
            rows={3}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
      </fieldset>

      {formError ? (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {formError}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending || isUploading}
        className="mt-5 h-12 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 sm:w-auto sm:min-w-[14rem]"
      >
        {isPending ? t("cargo.submitting") : t("cargo.submitRequest")}
      </Button>
    </form>
  );
}
