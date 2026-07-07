"use client";

import Image from "next/image";
import { ImageIcon, Plus, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { uploadListingImageRequest } from "@/features/listings/lib/upload-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Loading } from "@/components/ui/loading";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ListingImageUploadProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  error?: string;
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

    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          throw new Error("Разрешены только JPG, PNG и WEBP");
        }

        const result = await uploadListingImageRequest(file);
        uploadedUrls.push(result.url);
      }

      onChange([...value, ...uploadedUrls]);
    } catch (uploadFailure) {
      setUploadError(
        uploadFailure instanceof Error
          ? uploadFailure.message
          : "Не удалось загрузить фото",
      );
    } finally {
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

  const showEmptyState = value.length === 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">Фотографии товара</p>
        <Badge variant="secondary">
          {value.length} / {MAX_IMAGES}
        </Badge>
      </div>

      <div
        onDragOver={handleDropZoneDragOver}
        onDragLeave={handleDropZoneDragLeave}
        onDrop={(event) => void handleDropZoneDrop(event)}
        className={cn(
          "rounded-2xl border-2 border-dashed p-4 transition",
          isDragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30",
        )}
      >
        {isUploading ? (
          <div className="flex min-h-40 items-center justify-center py-10">
            <Loading label="Загрузка фото..." />
          </div>
        ) : showEmptyState ? (
          <EmptyState
            icon={ImageIcon}
            title="Добавьте фотографии"
            description="Перетащите файлы сюда или выберите с устройства"
            className="min-h-40 border-0 bg-transparent py-8"
            action={
              <Button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
              >
                Выбрать файлы
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {value.map((url, index) => (
              <div
                key={`${url}-${index}`}
                draggable={!disabled && !isUploading}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(event) => handleDragOverItem(event, index)}
                onDragEnd={() => setDraggedIndex(null)}
                className={cn(
                  "relative aspect-square cursor-grab overflow-hidden rounded-xl border bg-background shadow-sm transition active:cursor-grabbing",
                  draggedIndex === index ? "border-primary ring-2 ring-primary/20" : "border-border",
                  index === 0 && "ring-2 ring-primary/30",
                )}
              >
                <Image
                  src={url}
                  alt={index === 0 ? "Главное фото" : `Фото ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                {index === 0 ? (
                  <Badge className="absolute left-2 top-2 text-[10px]">Главное фото</Badge>
                ) : (
                  <Badge variant="secondary" className="absolute left-2 top-2 bg-background/90 text-[10px]">
                    {index + 1} / {MAX_IMAGES}
                  </Badge>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={() => handleRemove(index)}
                  disabled={disabled || isUploading}
                  className="absolute right-2 top-2 size-7 rounded-full bg-background/90"
                  aria-label="Удалить фото"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            ))}

            {value.length < MAX_IMAGES ? (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled || isUploading}
                className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background text-center text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-accent hover:text-foreground"
              >
                <Plus className="size-6" aria-hidden="true" />
                <span className="mt-2 px-2 text-xs">Добавить</span>
              </button>
            ) : null}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Перетаскивайте фото, чтобы изменить порядок. Первое фото — главное на карточке.
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

      {uploadError ? <p className="text-xs text-destructive">{uploadError}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
