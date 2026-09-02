"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ApiErrorBody = {
  error?: {
    message?: string;
    code?: string;
    details?: {
      importErrorCode?: string;
      nextAction?: string;
    };
  };
};

type DuplicateState = {
  existingDraftId: string;
  existingListingId: string | null;
  url: string;
};

export function ImportByUrlForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nextAction, setNextAction] = useState<string | null>(null);
  const [duplicateState, setDuplicateState] = useState<DuplicateState | null>(null);

  async function submitImport(forceNew = false) {
    setIsSubmitting(true);
    setErrorMessage(null);
    setNextAction(null);
    if (!forceNew) {
      setDuplicateState(null);
    }

    try {
      const response = await fetch("/api/admin/import/by-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, forceNew }),
      });

      const body = (await response.json()) as ApiErrorBody & {
        data?: {
          draft?: { id: string; warnings?: string[] };
          duplicate?: boolean;
          partial?: boolean;
          existingDraftId?: string;
          existingListingId?: string | null;
          debug?: Record<string, unknown>;
        };
      };

      if (!response.ok) {
        const isSourceBlocked =
          response.status === 409 ||
          body.error?.code === "SOURCE_BLOCKED" ||
          body.error?.details?.importErrorCode === "SOURCE_PROTECTION_PAGE";
        setErrorMessage(body.error?.message ?? "Не удалось получить данные объявления");
        setNextAction(
          isSourceBlocked
            ? (body.error?.details?.nextAction ??
                "Откройте объявление в браузере и используйте «Импорт из открытой страницы» ниже.")
            : (body.error?.details?.nextAction ?? null),
        );
        return;
      }

      if (body.data?.duplicate && !forceNew) {
        const existingDraftId = body.data.existingDraftId ?? body.data.draft?.id;
        if (existingDraftId) {
          setDuplicateState({
            existingDraftId,
            existingListingId: body.data.existingListingId ?? null,
            url,
          });
          return;
        }
      }

      const draftId = body.data?.draft?.id;
      if (draftId) {
        router.push(`/admin/import/${draftId}`);
        router.refresh();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Не удалось получить данные объявления",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitImport(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[20px] border border-[#BFDBFE] bg-[#EFF6FF] p-5 shadow-[0_4px_16px_rgba(37,99,235,0.08)] dark:border-blue-900 dark:bg-blue-950/30"
    >
      <div className="mb-4 flex items-center gap-2">
        <Link2 className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-[#0F172A] dark:text-slate-100">Импорт по ссылке</h2>
      </div>

      <div className="space-y-2">
        <label htmlFor="import-url" className="text-sm font-medium text-slate-900 dark:text-slate-100">
          Вставьте ссылку на объявление
        </label>
        <Input
          id="import-url"
          name="url"
          type="url"
          required
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://lalafo.kg/..."
        />
      </div>

      {duplicateState ? (
        <div className="mt-4 space-y-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4" role="alert">
          <p className="text-sm font-medium text-[#92400E]">Эта ссылка уже импортировалась.</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/import/${duplicateState.existingDraftId}`}>
                Открыть существующий черновик
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/import/${duplicateState.existingDraftId}?reextract=1`}>
                Повторить извлечение существующего черновика
              </Link>
            </Button>
            {duplicateState.existingListingId ? (
              <Button asChild size="sm" variant="outline">
                <Link href={`/listings/${duplicateState.existingListingId}`}>Открыть объявление</Link>
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => submitImport(true)}
            >
              Импортировать заново как новый черновик
            </Button>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 space-y-2" role="alert">
          <p className="text-sm text-[#DC2626]">{errorMessage}</p>
          {nextAction ? <p className="text-sm text-[#64748B]">{nextAction}</p> : null}
          {nextAction?.includes("открытой страницы") ? (
            <p className="text-sm">
              <a href="#browser-page-import" className="font-medium text-[#2563EB] underline">
                Перейти к импорту из открытой страницы
              </a>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Получаем данные объявления..." : "Получить данные"}
        </Button>
      </div>
    </form>
  );
}
