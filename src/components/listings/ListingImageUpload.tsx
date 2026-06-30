"use client";

import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";
import { uploadListingImageRequest } from "@/features/listings/lib/upload-client";

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
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">Фотографии товара</p>
        <p className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
          {value.length} / {MAX_IMAGES}
        </p>
      </div>

      <div
        onDragOver={handleDropZoneDragOver}
        onDragLeave={handleDropZoneDragLeave}
        onDrop={(event) => void handleDropZoneDrop(event)}
        className={`rounded-2xl border-2 border-dashed p-4 transition ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : "border-slate-200 bg-slate-50/80 hover:border-blue-200"
        }`}
      >
        {showEmptyState ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || isUploading}
            className="flex min-h-40 w-full flex-col items-center justify-center rounded-xl bg-white/70 px-6 py-10 text-center transition hover:bg-white"
          >
            <span className="text-4xl">📷</span>
            <span className="mt-4 text-base font-semibold text-slate-900">
              Добавьте фотографии
            </span>
            <span className="mt-2 text-sm text-slate-500">или перетащите сюда</span>
            <span className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white">
              Выбрать файлы
            </span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {value.map((url, index) => (
              <div
                key={`${url}-${index}`}
                draggable={!disabled && !isUploading}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(event) => handleDragOverItem(event, index)}
                onDragEnd={() => setDraggedIndex(null)}
                className={`relative aspect-square cursor-grab overflow-hidden rounded-xl border bg-white shadow-sm transition active:cursor-grabbing ${
                  draggedIndex === index ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200"
                }`}
              >
                <Image
                  src={url}
                  alt={index === 0 ? "Главное фото" : `Фото ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                {index === 0 ? (
                  <span className="absolute left-2 top-2 rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                    Главное фото
                  </span>
                ) : (
                  <span className="absolute left-2 top-2 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
                    {index + 1} / {MAX_IMAGES}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={disabled || isUploading}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                  aria-label="Удалить фото"
                >
                  ✕
                </button>
              </div>
            ))}

            {value.length < MAX_IMAGES ? (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled || isUploading}
                className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center text-sm text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="text-2xl leading-none">+</span>
                <span className="mt-2 px-2 text-xs">Добавить</span>
              </button>
            ) : null}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Перетаскивайте фото, чтобы изменить порядок. Первое фото — главное на карточке.
        {isUploading ? " Загрузка..." : ""}
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

      {uploadError ? <p className="text-xs text-red-600">{uploadError}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
