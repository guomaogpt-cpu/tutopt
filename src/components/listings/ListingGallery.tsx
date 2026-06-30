"use client";

import Image from "next/image";
import { useState } from "react";

type ListingGalleryProps = {
  images: { id: string; url: string }[];
  title: string;
};

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex h-[280px] max-h-[340px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500 shadow-sm sm:max-h-[380px] md:h-[320px] md:max-h-[520px]">
        Фото товара
      </div>
    );
  }

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <section>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
        <div className="relative mx-auto h-[320px] w-full max-h-[340px] sm:max-h-[380px] md:h-[520px] md:max-h-[520px]">
          <Image
            src={activeImage.url}
            alt={title}
            fill
            unoptimized
            className="object-contain p-2 sm:p-3"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      </div>

      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border bg-slate-50 transition hover:border-blue-300 ${
                index === activeIndex ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200"
              }`}
            >
              <Image
                src={image.url}
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
