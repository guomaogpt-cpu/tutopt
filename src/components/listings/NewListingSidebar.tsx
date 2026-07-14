"use client";

import Image from "next/image";
import { CheckCircle2, ImageIcon, Lightbulb } from "lucide-react";
import { formatListingPrice } from "@/features/listings/lib/format-listing-price";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { Prisma } from "@prisma/client";
import { cn } from "@/lib/utils";

type NewListingSidebarProps = {
  title: string;
  price: string;
  currency: string;
  moq: string;
  cityLabel: string;
  imageUrl: string | null;
  className?: string;
};

export function NewListingSidebar({
  title,
  price,
  currency,
  moq,
  cityLabel,
  imageUrl,
  className,
}: NewListingSidebarProps) {
  const hasPreview = title.trim().length > 0 || imageUrl;
  const priceValue = Number(price);
  const showPrice = price.trim().length > 0 && Number.isFinite(priceValue) && priceValue > 0;

  return (
    <aside className={cn("space-y-4", className)}>
      <div className="rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:sticky lg:top-24">
        <div className="flex items-center gap-2 text-[#2563EB]">
          <Lightbulb className="size-5" aria-hidden="true" />
          <h2 className="font-bold text-[#0F172A]">Как сделать объявление лучше</h2>
        </div>
        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#64748B]">
          <li>Добавьте реальные фото товара и упаковки</li>
          <li>Укажите точную минимальную партию (MOQ)</li>
          <li>Напишите город отгрузки</li>
          <li>Опишите упаковку, наличие и условия отгрузки</li>
        </ul>
      </div>

      <div className="rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-2 text-[#059669]">
          <CheckCircle2 className="size-5" aria-hidden="true" />
          <h2 className="font-bold text-[#0F172A]">Перед публикацией</h2>
        </div>
        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#64748B]">
          <li>Объявление попадёт на модерацию</li>
          <li>После одобрения появится в каталоге</li>
          <li>Покупатели смогут отправлять заявки</li>
        </ul>
      </div>

      {hasPreview ? (
        <div className="rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
            Предпросмотр
          </p>
          <div className="mt-3 overflow-hidden rounded-[18px] border border-[rgba(148,163,184,0.18)]">
            <div className="relative aspect-[4/3] bg-[#F1F5F9]">
              {imageUrl ? (
                <Image
                  src={normalizeListingImageUrl(imageUrl)}
                  alt={title || "Предпросмотр"}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="320px"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-[#94A3B8]">
                  <ImageIcon className="size-6" aria-hidden="true" />
                  <span className="text-xs">Фото появится здесь</span>
                </div>
              )}
            </div>
            <div className="space-y-2 p-3">
              <p className="line-clamp-2 text-sm font-semibold text-[#0F172A]">
                {title.trim() || "Название объявления"}
              </p>
              {showPrice ? (
                <p className="text-base font-bold text-[#2563EB]">
                  {formatListingPrice(new Prisma.Decimal(priceValue), currency)}
                </p>
              ) : (
                <p className="text-sm text-[#94A3B8]">Цена</p>
              )}
              <p className="text-xs text-[#64748B]">
                MOQ: {moq || "—"} · {cityLabel || "Город не выбран"}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
