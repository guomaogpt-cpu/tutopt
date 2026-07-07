"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

type ListingGalleryProps = {
  images: { id: string; url: string }[];
  title: string;
};

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="Фотографии не добавлены"
        description="Изображение товара появится здесь"
        className="h-[320px] justify-center sm:h-[360px] lg:h-[540px]"
      />
    );
  }

  const activeImage = images[activeIndex] ?? images[0];
  const useThumbnailScroll = images.length > 5;

  return (
    <section aria-label="Галерея товара">
      <Card className="overflow-hidden">
        <div className="relative mx-auto h-[320px] w-full bg-muted sm:h-[360px] lg:h-[540px]">
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
      </Card>

      {images.length > 1 ? (
        <div
          className={cn(
            "mt-4 flex gap-2",
            useThumbnailScroll
              ? "overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30"
              : "flex-wrap",
          )}
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Фото ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={cn(
                "relative size-[72px] shrink-0 overflow-hidden rounded-xl border-2 bg-muted transition hover:border-primary/40",
                index === activeIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border",
              )}
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
