"use client";

import Image from "next/image";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type GalleryImage = {
  id: string;
  url: string;
};

type ListingFullscreenGalleryProps = {
  open: boolean;
  onClose: () => void;
  images: GalleryImage[];
  title: string;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
};

export function ListingFullscreenGallery({
  open,
  onClose,
  images,
  title,
  activeIndex,
  onActiveIndexChange,
}: ListingFullscreenGalleryProps) {
  const { t } = useTranslation();
  const safeIndex = Math.min(activeIndex, Math.max(images.length - 1, 0));
  const activeImage = images[safeIndex];
  const hasMultiple = images.length > 1;

  const goPrev = () => onActiveIndexChange(Math.max(safeIndex - 1, 0));
  const goNext = () => onActiveIndexChange(Math.min(safeIndex + 1, images.length - 1));

  const { swipeHandlers } = useSwipeGesture({
    enabled: open,
    axis: "both",
    threshold: 48,
    onSwipeLeft: hasMultiple ? goNext : undefined,
    onSwipeRight: hasMultiple ? goPrev : undefined,
    onSwipeDown: onClose,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowLeft" && hasMultiple) {
        onActiveIndexChange(Math.max(safeIndex - 1, 0));
      }
      if (event.key === "ArrowRight" && hasMultiple) {
        onActiveIndexChange(Math.min(safeIndex + 1, images.length - 1));
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, hasMultiple, safeIndex, images.length, onClose, onActiveIndexChange]);

  if (!open || !activeImage) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("listing.fullscreenGallery")}
      data-listing-fullscreen-gallery
      data-state="open"
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      {...swipeHandlers}
    >
      <div className="flex items-center justify-between px-3 pb-2 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        {hasMultiple ? (
          <p className="text-sm font-medium text-white/90">
            {safeIndex + 1} / {images.length}
          </p>
        ) : (
          <span aria-hidden="true" />
        )}
        <button
          type="button"
          onClick={onClose}
          data-gallery-close
          className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          aria-label={t("common.close")}
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <Image
          src={normalizeListingImageUrl(activeImage.url)}
          alt={title}
          fill
          unoptimized
          className="object-contain"
          sizes="100vw"
          priority
        />

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={safeIndex === 0}
              className="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60 disabled:opacity-30"
              aria-label={t("listing.previousPhoto")}
            >
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={safeIndex >= images.length - 1}
              className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60 disabled:opacity-30"
              aria-label={t("listing.nextPhoto")}
            >
              <ChevronRight className="size-6" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div
          className="flex justify-center gap-1.5 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3"
          aria-hidden="true"
        >
          {images.map((image, index) => (
            <span
              key={image.id}
              className={cn(
                "size-1.5 rounded-full transition",
                index === safeIndex ? "bg-white" : "bg-white/35",
              )}
            />
          ))}
        </div>
      ) : (
        <div className="pb-[calc(1rem+env(safe-area-inset-bottom))]" aria-hidden="true" />
      )}
    </div>
  );
}
