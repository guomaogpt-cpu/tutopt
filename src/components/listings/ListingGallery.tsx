"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { cn } from "@/lib/utils";

type ListingGalleryProps = {
  images: { id: string; url: string }[];
  title: string;
};

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <section aria-label="Галерея товара">
        <div className="flex aspect-[4/3] max-h-[500px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 sm:aspect-[16/11] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
          <ImageIcon className="size-10" aria-hidden="true" />
          <p className="text-sm font-medium">Фото не добавлено</p>
        </div>
      </section>
    );
  }

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <section aria-label="Галерея товара">
      <div className="relative aspect-[4/3] max-h-[500px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:aspect-[16/11] dark:border-slate-800 dark:bg-slate-900">
        <Image
          src={normalizeListingImageUrl(activeImage.url)}
          alt={title}
          fill
          unoptimized
          className="object-contain"
          priority
          sizes="(max-width: 1024px) 100vw, 760px"
        />
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Фото ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={cn(
                "relative size-[72px] shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 transition sm:size-20 dark:bg-slate-900",
                index === activeIndex
                  ? "border-blue-600 ring-2 ring-blue-600/20"
                  : "border-slate-200 hover:border-blue-400 dark:border-slate-700",
              )}
            >
              <Image
                src={normalizeListingImageUrl(image.url)}
                alt={`${title} — фото ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
