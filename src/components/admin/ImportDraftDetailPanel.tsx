"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, Package } from "lucide-react";
import { ImportCategorySelect } from "@/components/admin/ImportCategorySelect";
import { ImportDraftStatusBadge } from "@/components/admin/ImportDraftStatusBadge";
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
import type { ImportCategoryOption } from "@/features/import-drafts/lib/get-import-category-options";
import { getImportQuality, isLalafoUrlOnlyDraft } from "@/features/import-drafts/lib/import-quality";
import type { ImportDraftRow } from "@/features/import-drafts/types/import-draft";
import { IMPORT_SOURCE_PLATFORMS } from "@/features/import-drafts/types/import-draft";

type ImportDraftDetailPanelProps = {
  draft: ImportDraftRow;
  categories: ImportCategoryOption[];
};

type ApiErrorBody = {
  error?: {
    message?: string;
  };
};

function FieldBlock({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">{label}</p>
      <p className="whitespace-pre-wrap text-sm text-[#0F172A] dark:text-slate-100">
        {value?.trim() ? value : "—"}
      </p>
    </div>
  );
}

export function ImportDraftDetailPanel({ draft, categories }: ImportDraftDetailPanelProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [sourcePlatform, setSourcePlatform] = useState(draft.sourcePlatform);
  const [categorySlug, setCategorySlug] = useState(draft.normalizedCategory ?? "");
  const [subcategorySlug, setSubcategorySlug] = useState(draft.normalizedSubcategory ?? "");

  const images = draft.normalizedImages.length > 0 ? draft.normalizedImages : draft.rawImages;
  const isPublished = draft.status === "PUBLISHED";
  const isDuplicate = draft.status === "DUPLICATE";
  const importQuality = getImportQuality(draft);
  const isAutoExtracted =
    Boolean(draft.sourceUrl && draft.sourcePlatform !== "MANUAL") &&
    importQuality.level !== "url-only";
  const isPartialExtract =
    importQuality.level === "partial" || importQuality.level === "url-only";
  const isLalafoUrlOnly = isLalafoUrlOnlyDraft(draft);
  const hasValidCategorySlug = categories.some(
    (option) => option.slug === subcategorySlug || option.slug === categorySlug,
  );

  async function handleReextract(mode: "fetch" | "render" = "fetch") {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const query = mode === "render" ? "?mode=render" : "";
      const response = await fetch(`/api/admin/import-drafts/${draft.id}/reextract${query}`, {
        method: "POST",
      });
      const body = (await response.json()) as ApiErrorBody & {
        data?: { draft?: { warnings?: string[] } };
      };

      if (!response.ok) {
        throw new Error(body.error?.message ?? "Не удалось повторить извлечение");
      }

      const warning = body.data?.draft?.warnings?.[0];
      setSuccessMessage(
        mode === "render"
          ? warning ?? "Browser render выполнен (обновлены только пустые поля)."
          : "Данные обновлены из источника (только пустые поля).",
      );
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось повторить извлечение");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function runAction(action: "ready" | "reject" | "duplicate" | "publish") {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const path =
      action === "publish"
        ? `/api/admin/import-drafts/${draft.id}/publish`
        : `/api/admin/import-drafts/${draft.id}/${action}`;

    try {
      const response = await fetch(path, {
        method: "POST",
        headers: action === "duplicate" ? { "Content-Type": "application/json" } : undefined,
        body: action === "duplicate" ? JSON.stringify({}) : undefined,
      });

      const body = (await response.json()) as ApiErrorBody & {
        data?: { listingId?: string };
      };

      if (!response.ok) {
        throw new Error(body.error?.message ?? "Не удалось выполнить действие");
      }

      if (action === "publish" && body.data?.listingId) {
        setSuccessMessage(`Объявление создано. ID: ${body.data.listingId}`);
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось выполнить действие");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`/api/admin/import-drafts/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourcePlatform,
          sourceUrl: String(formData.get("sourceUrl") ?? ""),
          title: String(formData.get("title") ?? ""),
          description: String(formData.get("description") ?? ""),
          price: String(formData.get("price") ?? ""),
          currency: String(formData.get("currency") ?? ""),
          city: String(formData.get("city") ?? ""),
          category: categorySlug,
          subcategory: subcategorySlug,
          imageUrlsText: String(formData.get("imageUrlsText") ?? ""),
          rawContact: String(formData.get("rawContact") ?? ""),
          notes: String(formData.get("notes") ?? ""),
        }),
      });

      const body = (await response.json()) as ApiErrorBody;

      if (!response.ok) {
        throw new Error(body.error?.message ?? "Не удалось сохранить черновик");
      }

      setSuccessMessage("Изменения сохранены");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось сохранить черновик");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <ImportDraftStatusBadge status={draft.status} />
            <span className="text-sm text-[#64748B]">{draft.sourcePlatform}</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#0F172A] dark:text-slate-100">
            {draft.normalizedTitle ?? draft.rawTitle ?? "Черновик импорта"}
          </h1>
          {draft.sourceUrl ? (
            <a
              href={draft.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-[#2563EB]"
            >
              <ExternalLink className="h-4 w-4" />
              {draft.sourceUrl}
            </a>
          ) : null}
        </div>

        {!isPublished ? (
          <div className="flex flex-wrap gap-2">
            {draft.sourceUrl ? (
              <>
                <Button variant="outline" disabled={isSubmitting} onClick={() => handleReextract("fetch")}>
                  Повторить извлечение
                </Button>
                {draft.sourcePlatform === "LALAFO" && (isLalafoUrlOnly || isPartialExtract) ? (
                  <Button
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => handleReextract("render")}
                  >
                    Повторить с браузерным режимом
                  </Button>
                ) : null}
              </>
            ) : null}
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => runAction("ready")}
            >
              Отметить готовым
            </Button>
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => runAction("reject")}
            >
              Отклонить
            </Button>
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => runAction("duplicate")}
            >
              Пометить дублем
            </Button>
            {!isDuplicate ? (
              <Button disabled={isSubmitting} onClick={() => runAction("publish")}>
                Опубликовать как объявление
              </Button>
            ) : null}
          </div>
        ) : draft.publishedListingId ? (
          <Button asChild>
            <Link href={`/listings/${draft.publishedListingId}`}>Открыть объявление</Link>
          </Button>
        ) : null}
      </div>

      {isPartialExtract && !isAutoExtracted ? (
        <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E]">
          {importQuality.level === "url-only"
            ? "Данные получены только из ссылки. Цена, описание и фото не извлечены. Используйте браузерный режим или заполните вручную."
            : "Черновик создан частично. Проверьте и дополните данные перед публикацией."}
        </div>
      ) : isAutoExtracted ? (
        <div className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-sm text-[#1D4ED8]">
          {importQuality.sourceHint
            ? `${importQuality.sourceHint}. Проверьте поля перед публикацией.`
            : `Данные получены автоматически по ссылке (${draft.sourcePlatform}). Проверьте поля перед публикацией.`}
        </div>
      ) : null}

      <div className="rounded-xl border border-[rgba(148,163,184,0.18)] bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 text-sm font-semibold text-[#0F172A] dark:text-slate-100">
          Качество импорта: {importQuality.label}
          {importQuality.sourceHint ? (
            <span className="ml-2 text-xs font-normal text-[#64748B]">({importQuality.sourceHint})</span>
          ) : null}
        </h2>
        {importQuality.extractionSourceLabel ? (
          <p className="mb-3 text-sm text-[#64748B]">
            Источник извлечения:{" "}
            <span className="font-medium text-[#0F172A] dark:text-slate-100">
              {importQuality.extractionSourceLabel}
            </span>
          </p>
        ) : null}
        {importQuality.titleFromSlug ? (
          <p className="mb-3 text-sm text-[#92400E]">Название восстановлено из ссылки.</p>
        ) : null}
        {importQuality.invalidTitleRejected ? (
          <p className="mb-3 text-sm text-[#92400E]">
            Невалидное название страницы (lalafo.kg) отброшено.
          </p>
        ) : null}
        <p className="mb-3 text-sm text-[#64748B]">
          Найдено: фото —{" "}
          {(draft.normalizedImages.length > 0 ? draft.normalizedImages : draft.rawImages).length}; цена —{" "}
          {importQuality.fields.price ? "да" : "нет"}; описание —{" "}
          {importQuality.fields.description ? "да" : "нет"}; город —{" "}
          {importQuality.fields.city ? "да" : "нет"}; категория —{" "}
          {importQuality.fields.category ? "да" : "нет"}
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <QualityField label="Название" found={importQuality.fields.title} />
          <QualityField label="Цена" found={importQuality.fields.price} />
          <QualityField label="Фото" found={importQuality.fields.images} />
          <QualityField label="Описание" found={importQuality.fields.description} />
          <QualityField label="Город" found={importQuality.fields.city} />
          <QualityField label="Категория" found={importQuality.fields.category} />
        </div>
        {importQuality.missingMessages.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm text-[#64748B]">
            {importQuality.missingMessages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ) : null}
      </div>

      {isDuplicate ? (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
          Этот черновик помечен как дубль. Публикация недоступна, пока статус не изменён.
        </div>
      ) : null}

      {!hasValidCategorySlug && !isPublished ? (
        <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E]">
          Укажите категорию перед публикацией.
        </div>
      ) : null}

      {draft.duplicateOfListingId ? (
        <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E]">
          Помечен как дубль объявления{" "}
          <Link href={`/listings/${draft.duplicateOfListingId}`} className="font-medium underline">
            {draft.duplicateOfListingId}
          </Link>
        </div>
      ) : null}

      {errorMessage ? (
        <p className="text-sm text-[#DC2626]" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p className="text-sm text-[#059669]" role="status">
          {successMessage}
        </p>
      ) : null}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((url) => (
            <div
              key={url}
              className="relative aspect-square overflow-hidden rounded-xl bg-[#F1F5F9]"
            >
              <Image src={url} alt="" fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-[#64748B]">
          <Package className="h-4 w-4" />
          Нет изображений
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold">Исходные данные</h2>
          <div className="grid gap-4">
            <FieldBlock label="Название" value={draft.rawTitle} />
            <FieldBlock label="Описание" value={draft.rawDescription} />
            <FieldBlock label="Цена" value={draft.rawPrice} />
            <FieldBlock label="Валюта" value={draft.rawCurrency} />
            <FieldBlock label="Город" value={draft.rawCity} />
          </div>
        </section>

        <section className="rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold">Нормализованные данные</h2>
          <div className="grid gap-4">
            <FieldBlock label="Название" value={draft.normalizedTitle} />
            <FieldBlock label="Описание" value={draft.normalizedDescription} />
            <FieldBlock label="Цена" value={draft.normalizedPrice} />
            <FieldBlock label="Валюта" value={draft.normalizedCurrency} />
            <FieldBlock label="Город" value={draft.normalizedCity} />
            <FieldBlock label="Категория" value={draft.normalizedCategory} />
            <FieldBlock label="Подкатегория" value={draft.normalizedSubcategory} />
          </div>
        </section>
      </div>

      <section className="rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-[#FFFBEB] p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-2 text-lg font-semibold">Внутренний контакт</h2>
        <p className="mb-3 text-xs text-[#64748B]">
          Контакты из внешних источников используются только для внутренней проверки и не
          публикуются автоматически.
        </p>
        <FieldBlock label="rawContact" value={draft.rawContact} />
      </section>

      {!isPublished ? (
        <form
          onSubmit={handleSave}
          className="rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="mb-4 text-lg font-semibold">Редактирование</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="sourcePlatform" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Источник
              </label>
              <Select value={sourcePlatform} onValueChange={setSourcePlatform}>
                <SelectTrigger id="sourcePlatform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IMPORT_SOURCE_PLATFORMS.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="sourceUrl" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Ссылка на источник
              </label>
              <Input id="sourceUrl" name="sourceUrl" defaultValue={draft.sourceUrl ?? ""} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="title" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Название
              </label>
              <Input id="title" name="title" defaultValue={draft.rawTitle ?? ""} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Описание
              </label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={draft.rawDescription ?? ""}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Цена
              </label>
              <Input id="price" name="price" defaultValue={draft.rawPrice ?? ""} />
            </div>

            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Валюта
              </label>
              <Input
                id="currency"
                name="currency"
                defaultValue={draft.rawCurrency ?? draft.normalizedCurrency ?? "KGS"}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Город
              </label>
              <Input id="city" name="city" defaultValue={draft.rawCity ?? draft.normalizedCity ?? ""} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <ImportCategorySelect
                categories={categories}
                categorySlug={categorySlug}
                subcategorySlug={subcategorySlug}
                onCategoryChange={setCategorySlug}
                onSubcategoryChange={setSubcategorySlug}
              />
            </div>

            <input type="hidden" name="category" value={categorySlug} />
            <input type="hidden" name="subcategory" value={subcategorySlug} />

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="imageUrlsText" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Фото URLs
              </label>
              <Textarea
                id="imageUrlsText"
                name="imageUrlsText"
                rows={4}
                defaultValue={draft.rawImages.join("\n")}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="rawContact" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Контакт из источника
              </label>
              <Input id="rawContact" name="rawContact" defaultValue={draft.rawContact ?? ""} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="notes" className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Заметки модератора
              </label>
              <Textarea id="notes" name="notes" rows={2} defaultValue={draft.notes ?? ""} />
            </div>
          </div>

          <div className="mt-5">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </form>
      ) : (
        <section className="rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <FieldBlock label="Заметки модератора" value={draft.notes} />
        </section>
      )}
    </div>
  );
}

function QualityField({ label, found }: { label: string; found: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
          found
            ? "bg-[#DCFCE7] text-[#166534]"
            : "bg-[#FEE2E2] text-[#991B1B]"
        }`}
        aria-hidden
      >
        {found ? "✓" : "✗"}
      </span>
      <span className="text-[#334155] dark:text-slate-300">{label}</span>
    </div>
  );
}
