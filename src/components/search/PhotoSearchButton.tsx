"use client";

import { Camera, ImagePlus, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type PhotoSearchButtonProps = {
  className?: string;
  /** Icon button size classes */
  sizeClassName?: string;
  disabled?: boolean;
};

export function PhotoSearchButton({
  className,
  sizeClassName = "size-9",
  disabled = false,
}: PhotoSearchButtonProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [comingSoon, setComingSoon] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function resetFileState() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
    setError(null);
    setComingSoon(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      resetFileState();
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setComingSoon(false);

    if (!file) {
      return;
    }

    if (!ACCEPTED_TYPES.has(file.type)) {
      setError(t("search.photo.invalidType"));
      setPreviewUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }
        return null;
      });
      setFileName(null);
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_BYTES) {
      setError(t("search.photo.tooLarge"));
      setPreviewUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }
        return null;
      });
      setFileName(null);
      event.target.value = "";
      return;
    }

    setError(null);
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return URL.createObjectURL(file);
    });
    setFileName(file.name);
  }

  function handleFindSimilar() {
    if (!previewUrl) {
      return;
    }
    setComingSoon(true);
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={t("search.photo.aria")}
          title={t("search.photo.aria")}
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition",
            "hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
            "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
            "dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100",
            sizeClassName,
            className,
          )}
        >
          <Camera className="size-4" aria-hidden="true" />
        </button>
      </ModalTrigger>

      <ModalContent className="max-w-md gap-5 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <ModalHeader>
          <ModalTitle className="text-slate-900 dark:text-slate-100">
            {t("search.photo.title")}
          </ModalTitle>
          <ModalDescription className="text-slate-500 dark:text-slate-400">
            {t("search.photo.description")}
          </ModalDescription>
        </ModalHeader>

        <div className="space-y-3">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleFileChange}
          />

          <label
            htmlFor={inputId}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-4 py-8 text-center transition",
              "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40",
              "dark:border-slate-700 dark:bg-slate-950 dark:hover:border-blue-500/50 dark:hover:bg-slate-900",
            )}
          >
            {previewUrl ? (
              // Local object URL only — never uploaded in Phase 55.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={fileName ?? t("search.photo.title")}
                className="h-40 w-full rounded-xl bg-slate-100 object-contain dark:bg-slate-800"
              />
            ) : (
              <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
                <ImagePlus className="size-6" aria-hidden="true" />
              </span>
            )}
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {t("search.photo.choose")}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t("search.photo.supportedFormats")}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t("search.photo.maxSize")}
            </span>
          </label>

          {fileName ? (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
              <p className="min-w-0 truncate text-xs text-slate-600 dark:text-slate-300">
                {fileName}
              </p>
              <button
                type="button"
                onClick={resetFileState}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                aria-label={t("search.photo.remove")}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          ) : null}

          {comingSoon ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
              {t("search.photo.comingSoon")}
            </p>
          ) : null}
        </div>

        <ModalFooter>
          <Button
            type="button"
            disabled={!previewUrl}
            onClick={handleFindSimilar}
            className="h-11 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:w-auto"
          >
            {t("search.photo.findSimilar")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
