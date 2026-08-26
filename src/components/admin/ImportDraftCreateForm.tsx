"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type ImportDraftCreateFormProps = {
  onCreated?: () => void;
};

export function ImportDraftCreateForm({ onCreated }: ImportDraftCreateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sourcePlatform, setSourcePlatform] = useState<string>("MANUAL");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/import-drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourcePlatform,
          sourceUrl: String(formData.get("sourceUrl") ?? ""),
          title: String(formData.get("title") ?? ""),
          description: String(formData.get("description") ?? ""),
          price: String(formData.get("price") ?? ""),
          currency: String(formData.get("currency") ?? ""),
          city: String(formData.get("city") ?? ""),
          category: String(formData.get("category") ?? ""),
          subcategory: String(formData.get("subcategory") ?? ""),
          imageUrlsText: String(formData.get("imageUrlsText") ?? ""),
          rawContact: String(formData.get("rawContact") ?? ""),
          notes: String(formData.get("notes") ?? ""),
        }),
      });

      const body = (await response.json()) as ApiErrorBody & {
        data?: { draft?: { id: string } };
      };

      if (!response.ok) {
        throw new Error(body.error?.message ?? "Не удалось создать черновик");
      }

      onCreated?.();
      router.refresh();

      if (body.data?.draft?.id) {
        router.push(`/admin/import/${body.data.draft.id}`);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось создать черновик");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="mb-4 text-lg font-semibold text-[#0F172A] dark:text-slate-100">
        Новый импорт
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="sourcePlatform" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Источник
          </label>
          <Select value={sourcePlatform} onValueChange={setSourcePlatform}>
            <SelectTrigger id="sourcePlatform">
              <SelectValue placeholder="Выберите источник" />
            </SelectTrigger>
            <SelectContent>
              {IMPORT_SOURCE_PLATFORMS.filter((platform) => platform !== "SCREENSHOT").map(
                (platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="sourceUrl" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Ссылка на источник
          </label>
          <Input id="sourceUrl" name="sourceUrl" type="url" placeholder="https://..." />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="title" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Название
          </label>
          <Input id="title" name="title" required />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="description" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Описание
          </label>
          <Textarea id="description" name="description" rows={4} />
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Цена
          </label>
          <Input id="price" name="price" inputMode="decimal" />
        </div>

        <div className="space-y-2">
          <label htmlFor="currency" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Валюта
          </label>
          <Input id="currency" name="currency" defaultValue="KGS" maxLength={3} />
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Город
          </label>
          <Input id="city" name="city" placeholder="Бишкек" />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Категория (slug)
          </label>
          <Input id="category" name="category" placeholder="electronics" />
        </div>

        <div className="space-y-2">
          <label htmlFor="subcategory" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Подкатегория (slug)
          </label>
          <Input id="subcategory" name="subcategory" placeholder="phones" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="imageUrlsText" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Фото URLs (по одной ссылке на строку)
          </label>
          <Textarea id="imageUrlsText" name="imageUrlsText" rows={4} placeholder="https://..." />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="rawContact" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Контакт из источника (внутреннее поле)
          </label>
          <Input id="rawContact" name="rawContact" />
          <p className="text-xs text-[#64748B]">
            Контакты из внешних источников используются только для внутренней проверки и не
            публикуются автоматически.
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="notes" className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Заметки модератора
          </label>
          <Textarea id="notes" name="notes" rows={2} />
        </div>
      </div>

      {errorMessage ? (
        <p className="mt-4 text-sm text-[#DC2626]" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-5">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Создание..." : "Создать черновик"}
        </Button>
      </div>
    </form>
  );
}
