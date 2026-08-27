"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ApiErrorBody = {
  error?: {
    message?: string;
    details?: {
      importErrorCode?: string;
      nextAction?: string;
    };
  };
};

export function ImportByUrlForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nextAction, setNextAction] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setNextAction(null);

    try {
      const response = await fetch("/api/admin/import/by-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const body = (await response.json()) as ApiErrorBody & {
        data?: {
          draft?: { id: string; warnings?: string[] };
          duplicate?: boolean;
          partial?: boolean;
          debug?: Record<string, unknown>;
        };
      };

      if (!response.ok) {
        const message = body.error?.message ?? "Не удалось получить данные объявления";
        setErrorMessage(message);
        setNextAction(body.error?.details?.nextAction ?? null);
        return;
      }

      const draftId = body.data?.draft?.id;
      if (draftId) {
        if (body.data?.partial) {
          sessionStorage.setItem(
            `import-draft-notice-${draftId}`,
            "Черновик создан частично. Проверьте данные вручную.",
          );
        }
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

      {errorMessage ? (
        <div className="mt-4 space-y-1" role="alert">
          <p className="text-sm text-[#DC2626]">{errorMessage}</p>
          {nextAction ? <p className="text-sm text-[#64748B]">{nextAction}</p> : null}
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
