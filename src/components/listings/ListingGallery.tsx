"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
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
        <div className="flex aspect-[4/3] max-h-[520px] w-full flex-col items-center justify-center gap-2 rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-[#F1F5F9] text-[#94A3B8]">
          <ImageIcon className="size-10" aria-hidden="true" />
          <p className="text-sm font-medium">Фото не добавлено</p>
        </div>
      </section>
    );
  }

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <section aria-label="Галерея товара">
      <div className="relative aspect-[4/3] max-h-[520px] w-full overflow-hidden rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-[#F1F5F9]">
        <Image
          src={activeImage.url}
          alt={title}
          fill
          unoptimized
          className="object-contain p-3 sm:p-4"
          priority
          sizes="(max-width: 1024px) 100vw, 760px"
        />
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Фото ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={cn(
                "relative size-[76px] shrink-0 overflow-hidden rounded-xl border-2 bg-[#F1F5F9] transition sm:size-20",
                index === activeIndex
                  ? "border-[#2563EB] ring-2 ring-[#2563EB]/20"
                  : "border-[rgba(148,163,184,0.25)] hover:border-[#2563EB]/40",
              )}
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
