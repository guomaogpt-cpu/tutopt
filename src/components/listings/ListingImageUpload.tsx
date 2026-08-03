"use client";

import Image from "next/image";
import { ImageIcon, Plus, Upload, X } from "lucide-react";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { uploadListingImageRequest } from "@/features/listings/lib/upload-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ListingImageUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  error?: string;
};

type LocalPreview = {
  id: string;
  blobUrl: string;
};

export function ListingImageUpload({
  value,
  onChange,
  disabled = false,
  error,
}: ListingImageUploadProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [localPreviews, setLocalPreviews] = useState<LocalPreview[]>([]);
  const localPreviewsRef = useRef<LocalPreview[]>([]);

  useEffect(() => {
    localPreviewsRef.current = localPreviews;
  }, [localPreviews]);

  useEffect(() => {
    return () => {
      for (const preview of localPreviewsRef.current) {
        URL.revokeObjectURL(preview.blobUrl);
      }
    };
  }, []);

  function clearLocalPreviews() {
    for (const preview of localPreviewsRef.current) {
      URL.revokeObjectURL(preview.blobUrl);
    }
    localPreviewsRef.current = [];
    setLocalPreviews([]);
  }

  async function uploadFiles(files: File[]) {
    if (disabled || files.length === 0) {
      return;
    }

    const availableSlots = MAX_IMAGES - value.length;

    if (availableSlots <= 0) {
      setUploadError(t("createListing.validation.photoLimit"));
      return;
    }

    if (files.length > availableSlots) {
      setUploadError(t("createListing.validation.photoLimit"));
      return;
    }

    setUploadError("");
    setUploadSuccess(false);
    setIsUploading(true);

    const previews: LocalPreview[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      blobUrl: URL.createObjectURL(file),
    }));
    localPreviewsRef.current = previews;
    setLocalPreviews(previews);

    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          throw new Error("JPG, PNG, WEBP");
        }

        const result = await uploadListingImageRequest(file);
        uploadedUrls.push(result.url);
      }

      // Submit payload must receive only server URLs — never blob:
      onChange([...value, ...uploadedUrls]);
      setUploadSuccess(true);
    } catch (uploadFailure) {
      setUploadError(
        uploadFailure instanceof Error
          ? uploadFailure.message
          : t("createListing.validation.waitUpload"),
      );
      setUploadSuccess(false);
    } finally {
      clearLocalPreviews();
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function handleFilesSelected(fileList: FileList | null) {
    if (!fileList) {
      return;
    }
    await uploadFiles(Array.from(fileList));
  }

  function handleRemove(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
    setUploadError("");
    setUploadSuccess(false);
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOverItem(event: DragEvent, index: number) {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      return;
    }

    const next = [...value];
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(index, 0, moved);
    setDraggedIndex(index);
    onChange(next);
  }

  function handleDropZoneDragOver(event: DragEvent) {
    event.preventDefault();
    setIsDragOver(true);
  }

  function handleDropZoneDragLeave() {
    setIsDragOver(false);
  }

  async function handleDropZoneDrop(event: DragEvent) {
    event.preventDefault();
    setIsDragOver(false);

    const files = Array.from(event.dataTransfer.files).filter((file) =>
      ACCEPTED_TYPES.includes(file.type),
    );

    await uploadFiles(files);
  }

  const displayItems: { key: string; src: string; isPreview: boolean }[] = [
    ...value.map((url, index) => ({
      key: `server-${url}-${index}`,
      src: normalizeListingImageUrl(url),
      isPreview: false,
    })),
    ...localPreviews.map((preview) => ({
      key: `preview-${preview.id}`,
      src: preview.blobUrl,
      isPreview: true,
    })),
  ];

  const showEmptyState = displayItems.length === 0;
  const displayError = uploadError || error;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm text-slate-600 dark:text-slate-300">{t("createListing.photoHint")}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("createListing.mainPhotoHint")} · {t("createListing.photoCount")}
          </p>
          {uploadSuccess && !displayError ? (
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400" role="status">
              {t("createListing.photoUploaded")}
            </p>
          ) : null}
        </div>
        <Badge
          variant="secondary"
          className="shrink-0 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          {value.length} / {MAX_IMAGES}
        </Badge>
      </div>

      <div
        onDragOver={handleDropZoneDragOver}
        onDragLeave={handleDropZoneDragLeave}
        onDrop={(event) => void handleDropZoneDrop(event)}
        className={cn(
          "rounded-2xl border-2 border-dashed p-3 transition sm:rounded-[18px] sm:p-5",
          isDragOver
            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-slate-800"
            : displayError
              ? "border-red-200 bg-red-50/40 dark:border-red-900 dark:bg-red-950/20"
              : "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950",
        )}
      >
        {showEmptyState ? (
          <div className="flex min-h-36 flex-col items-center justify-center py-6 text-center sm:min-h-40 sm:py-8">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
              <ImageIcon className="size-6" aria-hidden="true" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">
              {t("createListing.photoHint")}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">JPG, PNG, WEBP</p>
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || isUploading}
              className="mt-4 h-12 w-full max-w-xs rounded-xl bg-blue-600 hover:bg-blue-700 sm:h-11 sm:w-auto"
            >
              <Upload className="size-4" aria-hidden="true" />
              {t("createListing.uploadPhotos")}
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
              {displayItems.map((item, index) => (
                <div
                  key={item.key}
                  draggable={!disabled && !isUploading && !item.isPreview}
                  onDragStart={() => {
                    if (!item.isPreview) {
                      handleDragStart(index);
                    }
                  }}
                  onDragOver={(event) => {
                    if (!item.isPreview) {
                      handleDragOverItem(event, index);
                    }
                  }}
                  onDragEnd={() => setDraggedIndex(null)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-xl border bg-white shadow-sm transition dark:bg-slate-900 sm:aspect-[4/3] sm:rounded-[14px]",
                    item.isPreview
                      ? "cursor-wait border-blue-400/40 opacity-90"
                      : "cursor-grab active:cursor-grabbing",
                    !item.isPreview && draggedIndex === index
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : !item.isPreview
                        ? "border-slate-200 dark:border-slate-800"
                        : null,
                  )}
                >
                  <Image
                    src={item.src}
                    alt={
                      item.isPreview
                        ? t("createListing.publishing")
                        : index === 0
                          ? t("createListing.mainPhoto")
                          : `${t("createListing.sections.photos")} ${index + 1}`
                    }
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {item.isPreview ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 text-xs font-medium text-white">
                      {t("createListing.publishing")}
                    </div>
                  ) : null}
                  {!item.isPreview && index === 0 ? (
                    <Badge className="absolute left-2 top-2 bg-blue-600 text-[10px] hover:bg-blue-600">
                      {t("createListing.mainPhoto")}
                    </Badge>
                  ) : null}
                  {!item.isPreview ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      onClick={() => handleRemove(index)}
                      disabled={disabled || isUploading}
                      className="absolute right-1.5 top-1.5 size-8 rounded-full border border-slate-200 bg-white/95 shadow-sm dark:border-slate-700 dark:bg-slate-900/95 sm:right-2 sm:top-2 sm:size-7"
                      aria-label="Remove photo"
                    >
                      <X className="size-3.5" />
                    </Button>
                  ) : null}
                </div>
              ))}

              {value.length + localPreviews.length < MAX_IMAGES ? (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={disabled || isUploading}
                  className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center text-sm text-slate-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-slate-900 sm:aspect-[4/3] sm:rounded-[14px]"
                >
                  <Plus className="size-6" aria-hidden="true" />
                  <span className="mt-1.5 px-2 text-xs">{t("createListing.addPhoto")}</span>
                </button>
              ) : null}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || isUploading}
              className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 sm:w-auto"
            >
              <Upload className="size-4" aria-hidden="true" />
              {isUploading ? t("createListing.publishing") : t("createListing.uploadPhotos")}
            </Button>
          </div>
        )}
      </div>

      <p className="hidden text-xs leading-relaxed text-slate-500 sm:block dark:text-slate-400">
        {t("createListing.mainPhotoHint")}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(event) => void handleFilesSelected(event.target.files)}
        disabled={disabled || isUploading}
      />

      {displayError ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {displayError}
        </p>
      ) : null}
    </div>
  );
}
