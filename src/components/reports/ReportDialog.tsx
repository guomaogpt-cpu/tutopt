"use client";

import type { ListingVertical, ReportReason } from "@prisma/client";
import { Flag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  createListingReportRequest,
  createReportRequest,
  ReportRequestError,
} from "@/features/reports/lib/reports-client";
import {
  LISTING_REPORT_REASON_OPTIONS,
  REPORT_REASON_OPTIONS,
} from "@/features/reports/validators/report.validators";
import { buildLoginUrl, getCurrentPathFromWindow } from "@/features/auth/lib/login-redirect";
import { trackReportSubmit } from "@/lib/analytics/events";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ReportDialogProps = {
  targetType: "listing" | "seller";
  listingId?: string;
  sellerId?: string;
  vertical?: ListingVertical | null;
  isAuthenticated: boolean;
  triggerClassName?: string;
  triggerLabel?: string;
  onTriggerClick?: () => void;
};

export function ReportDialog({
  targetType,
  listingId,
  sellerId,
  vertical = null,
  isAuthenticated,
  triggerClassName,
  triggerLabel = "Пожаловаться",
  onTriggerClick,
}: ReportDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const title =
    targetType === "listing" ? "Пожаловаться на объявление" : "Пожаловаться на продавца";
  const reasonOptions =
    targetType === "listing" ? LISTING_REPORT_REASON_OPTIONS : REPORT_REASON_OPTIONS;

  function handleOpenChange(next: boolean) {
    if (next && !open) {
      onTriggerClick?.();
    }
    setOpen(next);
    if (!next) {
      setReason("");
      setMessage("");
      setError(null);
      setIsSuccess(false);
      setIsPending(false);
    }
  }

  function handleLogin() {
    router.push(buildLoginUrl(getCurrentPathFromWindow()));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      handleLogin();
      return;
    }

    if (!reason) {
      setError("Выберите причину жалобы");
      return;
    }

    setIsPending(true);

    try {
      if (targetType === "listing" && listingId) {
        await createListingReportRequest(listingId, {
          reason,
          message: message.trim() || null,
        });
      } else {
        await createReportRequest({
          listingId: listingId ?? null,
          sellerId: sellerId ?? null,
          reason,
          message: message.trim() || null,
        });
      }

      trackReportSubmit(targetType, reason, vertical);
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof ReportRequestError) {
        setError(err.message);
      } else {
        setError("Не удалось отправить жалобу. Попробуйте ещё раз.");
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-[#64748B] underline-offset-2 transition hover:text-[#DC2626] hover:underline",
            triggerClassName,
          )}
        >
          <Flag className="size-3.5 shrink-0" aria-hidden="true" />
          {triggerLabel}
        </button>
      </ModalTrigger>

      <ModalContent className="max-h-[min(92dvh,720px)] max-w-md gap-0 overflow-y-auto p-0 sm:max-w-md">
        <ModalHeader className="border-b border-[rgba(148,163,184,0.14)] px-5 py-4 text-left sm:px-6">
          <ModalTitle className="text-base text-[#0F172A] dark:text-slate-100">{title}</ModalTitle>
          {!isSuccess ? (
            <ModalDescription className="text-sm text-[#64748B] dark:text-slate-400">
              Мы проверим жалобу вручную. Автоматических блокировок нет.
            </ModalDescription>
          ) : null}
        </ModalHeader>

        {!isAuthenticated ? (
          <div className="space-y-4 px-5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-6">
            <p className="text-sm text-[#475569] dark:text-slate-300">
              Войдите, чтобы пожаловаться на объявление.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                onClick={handleLogin}
                className="h-11 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]"
              >
                Войти
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="h-11 w-full rounded-xl"
              >
                Отмена
              </Button>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="space-y-4 px-5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-6">
            <div>
              <p className="text-base font-semibold text-[#0F172A] dark:text-slate-100">
                Жалоба отправлена
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-slate-300">
                Спасибо. Мы проверим объявление и примем меры при нарушении правил.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="h-11 w-full rounded-xl"
            >
              Закрыть
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 px-5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-6"
          >
            <div className="space-y-2">
              <label htmlFor="report-reason" className="text-sm font-medium text-[#0F172A] dark:text-slate-100">
                Причина
              </label>
              <Select
                value={reason || undefined}
                onValueChange={(value) => setReason(value as ReportReason)}
              >
                <SelectTrigger id="report-reason" className="h-11 rounded-xl bg-white dark:bg-slate-900">
                  <SelectValue placeholder="Выберите причину" />
                </SelectTrigger>
                <SelectContent>
                  {reasonOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="report-message" className="text-sm font-medium text-[#0F172A] dark:text-slate-100">
                Комментарий <span className="font-normal text-[#94A3B8]">(необязательно)</span>
              </label>
              <Textarea
                id="report-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={1000}
                placeholder="Кратко опишите проблему"
                className="min-h-[96px] resize-y rounded-xl"
                disabled={isPending}
              />
            </div>

            {error ? (
              <p className="text-sm text-[#DC2626]" role="alert">
                {error}
              </p>
            ) : null}

            <ModalFooter className="gap-2 p-0 sm:justify-stretch">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => handleOpenChange(false)}
                className="h-11 w-full rounded-xl"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-11 w-full rounded-xl bg-[#DC2626] hover:bg-[#B91C1C]"
              >
                {isPending ? "Отправка..." : "Отправить жалобу"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
