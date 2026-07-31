"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  CargoRequestError,
  createCargoResponse,
} from "@/features/cargo/lib/cargo-requests-client";
import {
  CARGO_RESPONSE_COMMENT_MAX,
  CARGO_RESPONSE_CONTACT_NAME_MAX,
  CARGO_RESPONSE_CONTACT_PHONE_MAX,
  CARGO_RESPONSE_CURRENCY_MAX,
  CARGO_RESPONSE_PRICE_MAX,
  CARGO_RESPONSE_TIME_MAX,
} from "@/features/cargo/validators/cargo-response.validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n/useTranslation";

const fieldClassName =
  "h-11 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

type CargoRespondModalProps = {
  requestId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CargoRespondModal({
  requestId,
  open,
  onOpenChange,
}: CargoRespondModalProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("KGS");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [comment, setComment] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  function resetForm() {
    setPrice("");
    setCurrency("KGS");
    setEstimatedTime("");
    setComment("");
    setContactName("");
    setContactPhone("");
    setFormError(null);
    setIsSuccess(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setIsPending(true);

    try {
      await createCargoResponse(requestId, {
        price: price || null,
        currency: currency || null,
        estimatedTime: estimatedTime || null,
        comment,
        contactName: contactName || null,
        contactPhone: contactPhone || null,
      });
      setIsSuccess(true);
      router.refresh();
    } catch (error) {
      if (error instanceof CargoRequestError) {
        const code = error.formErrors.messageCode ?? error.message;
        if (code === "CARGO_ALREADY_RESPONDED") {
          setFormError(t("cargo.alreadyResponded"));
        } else if (code === "CARGO_REQUEST_CLOSED") {
          setFormError(t("cargo.requestClosed"));
        } else {
          setFormError(error.formErrors.form[0] ?? t("cargo.submitError"));
        }
      } else {
        setFormError(t("cargo.submitError"));
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          resetForm();
        }
      }}
    >
      <ModalContent className="max-h-[90vh] w-[calc(100%-1.5rem)] overflow-y-auto border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-lg">
        <ModalHeader>
          <ModalTitle className="dark:text-slate-100">{t("cargo.responseTitle")}</ModalTitle>
          <ModalDescription className="dark:text-slate-400">
            {t("cargo.responseDescription")}
          </ModalDescription>
        </ModalHeader>

        {isSuccess ? (
          <div className="py-4">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {t("cargo.responseSent")}
            </p>
            <ModalFooter className="mt-4">
              <Button
                type="button"
                className="h-11 w-full rounded-xl"
                onClick={() => {
                  onOpenChange(false);
                  resetForm();
                }}
              >
                OK
              </Button>
            </ModalFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="min-w-0">
                <label
                  htmlFor="cargo-response-price"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {t("cargo.responsePrice")}
                </label>
                <Input
                  id="cargo-response-price"
                  value={price}
                  maxLength={CARGO_RESPONSE_PRICE_MAX}
                  onChange={(event) => setPrice(event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="min-w-0">
                <label
                  htmlFor="cargo-response-currency"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {t("cargo.responseCurrency")}
                </label>
                <Input
                  id="cargo-response-currency"
                  value={currency}
                  maxLength={CARGO_RESPONSE_CURRENCY_MAX}
                  onChange={(event) => setCurrency(event.target.value)}
                  className={fieldClassName}
                />
              </div>
            </div>

            <div className="min-w-0">
              <label
                htmlFor="cargo-response-time"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                {t("cargo.responseEstimatedTime")}
              </label>
              <Input
                id="cargo-response-time"
                value={estimatedTime}
                maxLength={CARGO_RESPONSE_TIME_MAX}
                onChange={(event) => setEstimatedTime(event.target.value)}
                className={fieldClassName}
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="cargo-response-comment"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                {t("cargo.responseComment")}
              </label>
              <Textarea
                id="cargo-response-comment"
                required
                rows={3}
                maxLength={CARGO_RESPONSE_COMMENT_MAX}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="min-w-0">
                <label
                  htmlFor="cargo-response-contact-name"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {t("cargo.responseContactName")}
                </label>
                <Input
                  id="cargo-response-contact-name"
                  value={contactName}
                  maxLength={CARGO_RESPONSE_CONTACT_NAME_MAX}
                  onChange={(event) => setContactName(event.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div className="min-w-0">
                <label
                  htmlFor="cargo-response-contact-phone"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  {t("cargo.responseContactPhone")}
                </label>
                <Input
                  id="cargo-response-contact-phone"
                  type="tel"
                  value={contactPhone}
                  maxLength={CARGO_RESPONSE_CONTACT_PHONE_MAX}
                  onChange={(event) => setContactPhone(event.target.value)}
                  className={fieldClassName}
                />
              </div>
            </div>

            {formError ? (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {formError}
              </p>
            ) : null}

            <ModalFooter>
              <Button
                type="submit"
                disabled={isPending}
                className="h-11 w-full rounded-xl bg-rose-600 text-white hover:bg-rose-700 sm:w-auto"
              >
                {isPending ? t("cargo.submitting") : t("cargo.sendResponse")}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
