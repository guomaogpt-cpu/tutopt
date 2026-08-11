"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useState } from "react";
import { ListingFullscreenGallery } from "@/components/listings/ListingFullscreenGallery";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type ListingGalleryProps = {
  images: { id: string; url: string }[];
  title: string;
};

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const visibleImages = images.filter((image) => !failedIds.has(image.id));

  const safeIndex = Math.min(activeIndex, Math.max(visibleImages.length - 1, 0));
  const activeImage = visibleImages[safeIndex];
  const hasMultiple = visibleImages.length > 1;

  const goPrev = () => setActiveIndex((current) => Math.max(current - 1, 0));
  const goNext = () =>
    setActiveIndex((current) => Math.min(current + 1, visibleImages.length - 1));

  const { swipeHandlers } = useSwipeGesture({
    enabled: hasMultiple,
    axis: "horizontal",
    threshold: 40,
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  });

  if (visibleImages.length === 0) {
    return (
      <section aria-label={t("listing.galleryAriaLabel")}>
        <div className="flex aspect-[4/3] max-h-[520px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 sm:aspect-[16/11] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
          <ImageIcon className="size-10" aria-hidden="true" />
          <p className="text-sm font-medium">{t("listings.noImage")}</p>
        </div>
      </section>
    );
  }

  if (!activeImage) {
    return null;
  }

  return (
    <section aria-label={t("listing.galleryAriaLabel")}>
      <div
        className="relative aspect-[4/3] max-h-[520px] w-full touch-pan-y overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:aspect-[16/11] dark:border-slate-800 dark:bg-slate-900"
        {...(hasMultiple ? swipeHandlers : {})}
      >
        <button
          type="button"
          onClick={() => setFullscreenOpen(true)}
          className="relative block size-full cursor-zoom-in"
          aria-label={t("listing.openFullscreen")}
        >
          <Image
            src={normalizeListingImageUrl(activeImage.url)}
            alt={title}
            fill
            unoptimized
            className="object-cover sm:object-contain"
            priority
            sizes="(max-width: 1024px) 100vw, 760px"
            onError={() => {
              setFailedIds((current) => {
                const next = new Set(current);
                next.add(activeImage.id);
                return next;
              });
              setActiveIndex(0);
            }}
          />
        </button>

        {hasMultiple ? (
          <>
            <p
              className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white"
              aria-live="polite"
            >
              {safeIndex + 1} / {visibleImages.length}
            </p>

            <div
              className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5"
              aria-hidden="true"
            >
              {visibleImages.map((image, index) => (
                <span
                  key={image.id}
                  className={cn(
                    "size-1.5 rounded-full transition",
                    index === safeIndex ? "bg-white" : "bg-white/45",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goPrev}
              disabled={safeIndex === 0}
              className="absolute left-2 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm transition hover:bg-white disabled:opacity-40 sm:flex"
              aria-label={t("listing.previousPhoto")}
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={safeIndex >= visibleImages.length - 1}
              className="absolute right-2 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm transition hover:bg-white disabled:opacity-40 sm:flex"
              aria-label={t("listing.nextPhoto")}
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="mobile-horizontal-scroll mt-3 flex max-w-full gap-2.5 pb-1">
          {visibleImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${t("listing.photo")} ${index + 1}`}
              aria-current={index === safeIndex ? "true" : undefined}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 transition sm:size-20 dark:bg-slate-900",
                index === safeIndex
                  ? "border-blue-600 ring-2 ring-blue-600/20"
                  : "border-slate-200 hover:border-blue-400 dark:border-slate-700",
              )}
            >
              <Image
                src={normalizeListingImageUrl(image.url)}
                alt={`${title} — ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
                sizes="80px"
                onError={() => {
                  setFailedIds((current) => {
                    const next = new Set(current);
                    next.add(image.id);
                    return next;
                  });
                }}
              />
            </button>
          ))}
        </div>
      ) : null}

      <ListingFullscreenGallery
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        images={visibleImages}
        title={title}
        activeIndex={safeIndex}
        onActiveIndexChange={setActiveIndex}
      />
    </section>
  );
}
