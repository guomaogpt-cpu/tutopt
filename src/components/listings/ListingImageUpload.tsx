"use client";

import Image from "next/image";
import { ImageIcon, Plus, Upload, X } from "lucide-react";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { uploadListingImageRequest } from "@/features/listings/lib/upload-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
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
      setUploadError("Можно загрузить не более 10 фотографий");
      return;
    }

    if (files.length > availableSlots) {
      setUploadError(`Можно добавить ещё ${availableSlots} фото (максимум 10)`);
      return;
    }

    setUploadError("");
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
          throw new Error("Разрешены только JPG, PNG и WEBP");
        }

        const result = await uploadListingImageRequest(file);
        uploadedUrls.push(result.url);
      }

      // Submit payload must receive only server URLs — never blob:
      onChange([...value, ...uploadedUrls]);
    } catch (uploadFailure) {
      setUploadError(
        uploadFailure instanceof Error
          ? uploadFailure.message
          : "Не удалось загрузить фото",
      );
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#64748B]">
          Добавьте от 1 до 10 фото. Первое фото будет главным.
        </p>
        <Badge variant="secondary" className="bg-[#F1F5F9] text-[#475569]">
          {value.length} / {MAX_IMAGES}
        </Badge>
      </div>

      <div
        onDragOver={handleDropZoneDragOver}
        onDragLeave={handleDropZoneDragLeave}
        onDrop={(event) => void handleDropZoneDrop(event)}
        className={cn(
          "rounded-[18px] border-2 border-dashed p-4 transition sm:p-5",
          isDragOver
            ? "border-[#2563EB] bg-[#EFF6FF]"
            : displayError
              ? "border-[#FECACA] bg-[#FEF2F2]/40"
              : "border-[rgba(148,163,184,0.28)] bg-[#F8FAFC]",
        )}
      >
        {showEmptyState ? (
          <div className="flex min-h-40 flex-col items-center justify-center py-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
              <ImageIcon className="size-6" aria-hidden="true" />
            </div>
            <p className="mt-4 text-sm font-medium text-[#0F172A]">Перетащите фото сюда</p>
            <p className="mt-1 text-xs text-[#64748B]">JPG, PNG или WEBP</p>
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || isUploading}
              className="mt-4 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              <Upload className="size-4" aria-hidden="true" />
              Загрузить фото
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
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
                    "relative aspect-[4/3] overflow-hidden rounded-[14px] border bg-white shadow-sm transition",
                    item.isPreview
                      ? "cursor-wait border-[#2563EB]/40 opacity-90"
                      : "cursor-grab active:cursor-grabbing",
                    !item.isPreview && draggedIndex === index
                      ? "border-[#2563EB] ring-2 ring-[#2563EB]/20"
                      : !item.isPreview
                        ? "border-[rgba(148,163,184,0.18)]"
                        : null,
                  )}
                >
                  <Image
                    src={item.src}
                    alt={
                      item.isPreview
                        ? "Загрузка фото"
                        : index === 0
                          ? "Главное фото"
                          : `Фото ${index + 1}`
                    }
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {item.isPreview ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 text-xs font-medium text-white">
                      Загрузка...
                    </div>
                  ) : null}
                  {!item.isPreview && index === 0 ? (
                    <Badge className="absolute left-2 top-2 bg-[#2563EB] text-[10px] hover:bg-[#2563EB]">
                      Главное
                    </Badge>
                  ) : null}
                  {!item.isPreview ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      onClick={() => handleRemove(index)}
                      disabled={disabled || isUploading}
                      className="absolute right-2 top-2 size-7 rounded-full border border-[rgba(148,163,184,0.18)] bg-white/95 shadow-sm"
                      aria-label="Удалить фото"
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
                  className="flex aspect-[4/3] flex-col items-center justify-center rounded-[14px] border border-dashed border-[rgba(148,163,184,0.28)] bg-white text-center text-sm text-[#64748B] transition hover:border-[#2563EB]/40 hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                >
                  <Plus className="size-6" aria-hidden="true" />
                  <span className="mt-2 px-2 text-xs">Добавить</span>
                </button>
              ) : null}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || isUploading}
              className="h-11 w-full rounded-xl border-[rgba(148,163,184,0.25)] sm:w-auto"
            >
              <Upload className="size-4" aria-hidden="true" />
              {isUploading ? "Загрузка..." : "Загрузить фото"}
            </Button>
          </div>
        )}
      </div>

      <p className="text-xs leading-relaxed text-[#64748B]">
        Перетаскивайте фото, чтобы изменить порядок. Первое фото отображается в каталоге.
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
        <p className="text-sm text-[#DC2626]" role="alert">
          {displayError}
        </p>
      ) : null}
    </div>
  );
}
