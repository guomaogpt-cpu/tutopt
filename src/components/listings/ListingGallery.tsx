"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

type ListingGalleryProps = {
  images: { id: string; url: string }[];
  title: string;
};

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <section
        aria-label="Галерея товара"
        className="flex h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 sm:h-[360px] lg:h-[480px]"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300">
          <ImageIcon className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-slate-600">Фотографии не добавлены</p>
        <p className="text-xs text-slate-400">Изображение товара появится здесь</p>
      </section>
    );
  }

  const activeImage = images[activeIndex] ?? images[0];
  const useThumbnailScroll = images.length > 5;

  return (
    <section aria-label="Галерея товара">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="relative mx-auto h-[280px] w-full sm:h-[360px] lg:h-[480px]">
          <Image
            src={activeImage.url}
            alt={title}
            fill
            unoptimized
            className="object-contain p-4"
            priority
            sizes="(max-width: 1024px) 100vw, 720px"
          />
        </div>
      </div>

      {images.length > 1 ? (
        <div
          className={`mt-4 flex gap-2 ${
            useThumbnailScroll
              ? "overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300"
              : "flex-wrap"
          }`}
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Фото ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition hover:border-blue-300 ${
                index === activeIndex
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-slate-200"
              }`}
            >
              <Image
                src={image.url}
                alt={`${title} — фото ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
                sizes="72px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
