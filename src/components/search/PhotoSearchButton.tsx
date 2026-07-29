"use client";

import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { Camera, ImagePlus, Loader2, Package, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
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
import {
  PHOTO_SEARCH_MAX_BYTES,
  PHOTO_SEARCH_UI_LIMIT,
  type PhotoSearchResponse,
  type PhotoSearchResultItem,
} from "@/features/search/lib/photo-search-types";
import { VERTICALS } from "@/features/verticals/verticals";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type ModalState = "idle" | "preview" | "searching" | "success" | "empty" | "error";

type PhotoSearchButtonProps = {
  className?: string;
  sizeClassName?: string;
  disabled?: boolean;
  vertical?: ListingVertical | null;
};

type ApiErrorBody = {
  error?: {
    message?: string;
  };
};

type ApiSuccessBody = {
  data: PhotoSearchResponse;
};

function buildListingsHref(vertical: ListingVertical | null, photoSearch: boolean): string {
  const params = new URLSearchParams();
  if (vertical) {
    params.set("vertical", VERTICALS[vertical].slug);
  }
  if (photoSearch) {
    params.set("photoSearch", "1");
  }
  const qs = params.toString();
  return qs ? `/listings?${qs}` : "/listings";
}

export function PhotoSearchButton({
  className,
  sizeClassName = "size-9",
  disabled = false,
  vertical = null,
}: PhotoSearchButtonProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PhotoSearchResultItem[]>([]);
  const [total, setTotal] = useState(0);
  const [searching, setSearching] = useState(false);
  const [didSearch, setDidSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const modalState: ModalState = (() => {
    if (searching) {
      return "searching";
    }
    if (error && !previewUrl) {
      return "error";
    }
    if (error && previewUrl && didSearch) {
      return "error";
    }
    if (didSearch && results.length > 0) {
      return "success";
    }
    if (didSearch && results.length === 0) {
      return "empty";
    }
    if (previewUrl) {
      return "preview";
    }
    return "idle";
  })();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function clearResults() {
    setResults([]);
    setTotal(0);
    setDidSearch(false);
    setSearching(false);
  }

  function resetAll() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
    setFile(null);
    setError(null);
    clearResults();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      resetAll();
    }
  }

  function handleChooseAnother() {
    resetAll();
    window.setTimeout(() => inputRef.current?.click(), 0);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    clearResults();
    setError(null);

    if (!nextFile) {
      return;
    }

    if (!ACCEPTED_TYPES.has(nextFile.type)) {
      setError(t("search.photo.invalidType"));
      setPreviewUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }
        return null;
      });
      setFileName(null);
      setFile(null);
      event.target.value = "";
      return;
    }

    if (nextFile.size > PHOTO_SEARCH_MAX_BYTES) {
      setError(t("search.photo.tooLarge"));
      setPreviewUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }
        return null;
      });
      setFileName(null);
      setFile(null);
      event.target.value = "";
      return;
    }

    setFile(nextFile);
    setFileName(nextFile.name);
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return URL.createObjectURL(nextFile);
    });
  }

  function mapApiError(message: string | undefined): string {
    switch (message) {
      case "PHOTO_INVALID_TYPE":
        return t("search.photo.invalidType");
      case "PHOTO_TOO_LARGE":
        return t("search.photo.tooLarge");
      case "PHOTO_MISSING":
        return t("search.photo.invalidType");
      default:
        return t("search.photo.serverError");
    }
  }

  async function handleFindSimilar() {
    if (!file || searching) {
      return;
    }

    setSearching(true);
    setError(null);
    setResults([]);
    setTotal(0);
    setDidSearch(false);

    try {
      const body = new FormData();
      body.append("image", file);
      if (vertical) {
        body.append("vertical", vertical);
      }

      const response = await fetch("/api/search/photo", {
        method: "POST",
        body,
        cache: "no-store",
      });

      if (!response.ok) {
        let message: string | undefined;
        try {
          const payload = (await response.json()) as ApiErrorBody;
          message = payload.error?.message;
        } catch {
          message = undefined;
        }
        setError(mapApiError(message));
        setDidSearch(true);
        return;
      }

      const payload = (await response.json()) as ApiSuccessBody;
      const items = payload.data?.results ?? [];
      setResults(items);
      setTotal(payload.data?.total ?? items.length);
      setDidSearch(true);
    } catch {
      setError(t("search.photo.networkError"));
      setDidSearch(true);
    } finally {
      setSearching(false);
    }
  }

  const visibleResults = results.slice(0, PHOTO_SEARCH_UI_LIMIT);
  const listingsHref = buildListingsHref(vertical, false);
  const viewAllHref = buildListingsHref(vertical, true);

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

      <ModalContent className="max-h-[90vh] max-w-lg gap-4 overflow-y-auto border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
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
              "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-4 py-6 text-center transition",
              "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40",
              "dark:border-slate-700 dark:bg-slate-950 dark:hover:border-blue-500/50 dark:hover:bg-slate-900",
            )}
          >
            {previewUrl ? (
              // Local object URL preview — file is not stored permanently.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={fileName ?? t("search.photo.title")}
                className="h-36 w-full rounded-xl bg-slate-100 object-contain dark:bg-slate-800"
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
              {t("search.photo.supportedFormats")} · {t("search.photo.maxSize")}
            </span>
          </label>

          {fileName ? (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
              <p className="min-w-0 truncate text-xs text-slate-600 dark:text-slate-300">
                {fileName}
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                aria-label={t("search.photo.remove")}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}

          {modalState === "searching" ? (
            <p className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
              {t("search.photo.searching")}
            </p>
          ) : null}

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          ) : null}

          {modalState === "success" ? (
            <div className="space-y-3">
              <p className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs leading-relaxed text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
                {t("search.photo.prototypeNotice")}
              </p>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t("search.photo.resultsTitle")}
              </h3>
              <ul className="space-y-2">
                {visibleResults.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/listings/${item.id}`}
                      className="flex gap-3 rounded-xl border border-slate-200 bg-white p-2.5 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                    >
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <span className="flex size-full items-center justify-center text-slate-400">
                            <Package className="size-5" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1">
                          <VerticalListingBadge vertical={item.vertical} />
                        </div>
                        <p className="line-clamp-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {item.priceLabel}
                        </p>
                        {item.city ? (
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {item.city}
                          </p>
                        ) : null}
                        <span className="mt-1 inline-block text-xs font-medium text-blue-600 dark:text-blue-400">
                          {t("search.photo.openListing")}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              {total > PHOTO_SEARCH_UI_LIMIT ? (
                <Link
                  href={viewAllHref}
                  className="block text-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  {t("search.photo.viewAllResults")}
                </Link>
              ) : null}
            </div>
          ) : null}

          {modalState === "empty" ? (
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-center dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {t("search.photo.emptyTitle")}
              </p>
              <Button type="button" variant="outline" className="h-10 rounded-xl" asChild>
                <Link href={listingsHref}>{t("search.photo.openAllListings")}</Link>
              </Button>
            </div>
          ) : null}
        </div>

        <ModalFooter className="flex-col gap-2 sm:flex-col">
          {modalState === "idle" || modalState === "preview" || modalState === "searching" ? (
            <Button
              type="button"
              disabled={!file || searching}
              onClick={() => void handleFindSimilar()}
              className="h-11 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              {searching ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  {t("search.photo.searching")}
                </span>
              ) : (
                t("search.photo.findSimilar")
              )}
            </Button>
          ) : null}

          {modalState === "error" ? (
            <Button
              type="button"
              disabled={!file || searching}
              onClick={() => void handleFindSimilar()}
              className="h-11 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              {t("search.photo.tryAgain")}
            </Button>
          ) : null}

          {modalState === "success" || modalState === "empty" || modalState === "error" ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-xl"
                onClick={handleChooseAnother}
              >
                {t("search.photo.chooseAnother")}
              </Button>
              <Button type="button" variant="ghost" className="h-10 w-full rounded-xl" asChild>
                <Link href={listingsHref}>{t("search.photo.openAllListings")}</Link>
              </Button>
            </>
          ) : null}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
