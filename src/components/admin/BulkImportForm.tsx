"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IMPORT_SOURCE_PLATFORMS } from "@/features/import-drafts/types/import-draft";

type ApiErrorBody = {
  error?: {
    message?: string;
  };
};

const SOURCE_OPTIONS = [
  { value: "AUTO", label: "Auto detect" },
  ...IMPORT_SOURCE_PLATFORMS.filter((platform) => platform !== "MANUAL" && platform !== "SCREENSHOT").map(
    (platform) => ({
      value: platform,
      label: platform,
    }),
  ),
];

export function BulkImportForm() {
  const router = useRouter();
  const [urlsText, setUrlsText] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState("AUTO");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/import/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urlsText,
          sourcePlatform: sourcePlatform === "AUTO" ? "AUTO" : sourcePlatform,
        }),
      });

      const body = (await response.json()) as ApiErrorBody & {
        data?: { batch?: { id: string; totalCount: number } };
      };

      if (!response.ok) {
        throw new Error(body.error?.message ?? "Не удалось создать очередь импорта");
      }

      const batchId = body.data?.batch?.id;
      if (batchId) {
        router.push(`/admin/import/batches/${batchId}`);
        router.refresh();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось создать очередь импорта");
    } finally {
      setIsSubmitting(false);
    }
  }

  const lineCount = urlsText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-4 flex items-center gap-2">
        <Layers className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-[#0F172A] dark:text-slate-100">Массовый импорт</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="space-y-2">
          <label htmlFor="bulk-source" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Источник
          </label>
          <Select value={sourcePlatform} onValueChange={setSourcePlatform}>
            <SelectTrigger id="bulk-source">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SOURCE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="bulk-urls" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Список ссылок
          </label>
          <Textarea
            id="bulk-urls"
            name="urlsText"
            required
            rows={8}
            value={urlsText}
            onChange={(event) => setUrlsText(event.target.value)}
            placeholder={"Вставьте ссылки, по одной на строку\nhttps://lalafo.kg/...\nhttps://lalafo.kg/...\nhttps://instagram.com/p/..."}
          />
          <p className="text-xs text-[#64748B]">
            {lineCount > 0 ? `Ссылок: ${lineCount}` : "До 100 ссылок за один импорт"}
          </p>
        </div>
      </div>

      {errorMessage ? (
        <p className="mt-4 text-sm text-[#DC2626]" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-5">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Создаём очередь..." : "Создать очередь импорта"}
        </Button>
      </div>
    </form>
  );
}
