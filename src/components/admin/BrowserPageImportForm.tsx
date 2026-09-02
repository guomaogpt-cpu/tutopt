"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, ClipboardPaste, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  BOOKMARKLET_LABEL,
  buildLalafoBookmarkletHref,
} from "@/features/import-drafts/lib/lalafo-bookmarklet";

type ApiErrorBody = {
  error?: {
    message?: string;
    details?: {
      nextAction?: string;
    };
  };
};

type ImportMode = "json" | "html";

export function BrowserPageImportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<ImportMode>("json");
  const [jsonText, setJsonText] = useState("");
  const [htmlText, setHtmlText] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookmarkletCopied, setBookmarkletCopied] = useState(false);

  const adminImportUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "/admin/import?mode=browser-page";
    }
    return `${window.location.origin}/admin/import?mode=browser-page`;
  }, []);

  const bookmarkletHref = useMemo(
    () => buildLalafoBookmarkletHref(adminImportUrl),
    [adminImportUrl],
  );

  useEffect(() => {
    if (searchParams.get("mode") === "browser-page") {
      const el = document.getElementById("browser-page-import");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchParams]);

  async function copyBookmarklet() {
    try {
      await navigator.clipboard.writeText(bookmarkletHref);
      setBookmarkletCopied(true);
      setTimeout(() => setBookmarkletCopied(false), 2500);
    } catch {
      setErrorMessage("Не удалось скопировать bookmarklet. Перетащите ссылку в закладки.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      let payload: Record<string, unknown>;

      if (mode === "json") {
        let parsed: unknown;
        try {
          parsed = JSON.parse(jsonText);
        } catch {
          throw new Error("Некорректный JSON. Вставьте данные из bookmarklet.");
        }
        if (!parsed || typeof parsed !== "object") {
          throw new Error("JSON должен быть объектом.");
        }
        payload = parsed as Record<string, unknown>;
      } else {
        if (!sourceUrl.trim()) {
          throw new Error("Укажите ссылку на объявление для HTML-импорта.");
        }
        payload = {
          sourceUrl: sourceUrl.trim(),
          sourcePlatform: /lalafo\.(kg|com)/i.test(sourceUrl) ? "LALAFO" : "WEBSITE",
          html: htmlText,
        };
      }

      const response = await fetch("/api/admin/import/browser-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as ApiErrorBody & {
        data?: { draft?: { id: string } };
      };

      if (!response.ok) {
        setErrorMessage(body.error?.message ?? "Не удалось создать черновик");
        return;
      }

      const draftId = body.data?.draft?.id;
      if (draftId) {
        router.push(`/admin/import/${draftId}`);
        router.refresh();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось создать черновик");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="browser-page-import"
      className="rounded-[20px] border border-[#D1FAE5] bg-[#ECFDF5] p-5 shadow-[0_4px_16px_rgba(16,185,129,0.08)] dark:border-emerald-900 dark:bg-emerald-950/30"
    >
      <div className="mb-4 flex items-center gap-2">
        <Globe className="h-5 w-5 text-[#059669]" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-[#0F172A] dark:text-slate-100">
          Импорт из открытой страницы
        </h2>
      </div>

      <p className="mb-4 text-sm text-[#64748B]">
        Если Lalafo не отдаёт данные серверу, откройте объявление в своём браузере и используйте
        ручной импорт.
      </p>

      <ol className="mb-5 list-decimal space-y-1 pl-5 text-sm text-[#334155] dark:text-slate-300">
        <li>Откройте объявление Lalafo в браузере.</li>
        <li>Дождитесь загрузки фото, цены и описания.</li>
        <li>Нажмите bookmarklet «{BOOKMARKLET_LABEL}».</li>
        <li>Скопируйте полученный JSON.</li>
        <li>Вставьте JSON ниже и нажмите «Создать черновик».</li>
      </ol>

      <div className="mb-5 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={copyBookmarklet}>
          <Bookmark className="mr-2 h-4 w-4" />
          {bookmarkletCopied ? "Bookmarklet скопирован" : "Скопировать bookmarklet"}
        </Button>
        <Button asChild type="button" variant="outline" size="sm">
          <a href={bookmarkletHref} onClick={(event) => event.preventDefault()}>
            Перетащите в закладки: {BOOKMARKLET_LABEL}
          </a>
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === "json" ? "default" : "outline"}
          onClick={() => setMode("json")}
        >
          <ClipboardPaste className="mr-2 h-4 w-4" />
          JSON из bookmarklet
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "html" ? "default" : "outline"}
          onClick={() => setMode("html")}
        >
          HTML страницы (fallback)
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "json" ? (
          <div className="space-y-2">
            <label htmlFor="browser-page-json" className="text-sm font-medium">
              Вставьте JSON, полученный из bookmarklet
            </label>
            <Textarea
              id="browser-page-json"
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
              placeholder='{"sourceUrl":"https://lalafo.kg/...","sourcePlatform":"LALAFO","extracted":{...}}'
              rows={10}
              required
            />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label htmlFor="browser-page-url" className="text-sm font-medium">
                Ссылка на объявление
              </label>
              <input
                id="browser-page-url"
                type="url"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                placeholder="https://lalafo.kg/bishkek/ads/..."
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="browser-page-html" className="text-sm font-medium">
                HTML страницы (из Inspect / View Source)
              </label>
              <Textarea
                id="browser-page-html"
                value={htmlText}
                onChange={(event) => setHtmlText(event.target.value)}
                placeholder="<html>...</html>"
                rows={10}
                required
              />
            </div>
          </>
        )}

        {errorMessage ? (
          <p className="text-sm text-[#DC2626]" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Создаём черновик..." : "Создать черновик из данных страницы"}
        </Button>
      </form>

      <p className="mt-4 text-xs text-[#64748B]">
        Bookmarklet не собирает cookies, localStorage и номера телефонов. HTML не сохраняется в
        базе — только извлечённые поля.
      </p>
    </section>
  );
}
