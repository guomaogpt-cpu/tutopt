"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
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

  const visibleImages = images.filter((image) => !failedIds.has(image.id));

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

  const safeIndex = Math.min(activeIndex, visibleImages.length - 1);
  const activeImage = visibleImages[safeIndex] ?? visibleImages[0];

  return (
    <section aria-label={t("listing.galleryAriaLabel")}>
      <div className="relative aspect-[4/3] max-h-[520px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:aspect-[16/11] dark:border-slate-800 dark:bg-slate-900">
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
      </div>

      {visibleImages.length > 1 ? (
        <div className="mt-3 flex max-w-full gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
    </section>
  );
}
