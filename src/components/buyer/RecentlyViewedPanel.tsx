"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Package, Trash2 } from "lucide-react";
import type { ListingVertical } from "@prisma/client";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import { isListingVertical } from "@/features/verticals/verticals";
import { trackRecentlyViewed } from "@/lib/analytics/events";
import {
  clearRecentlyViewedListings,
  getRecentlyViewedListings,
  removeRecentlyViewedListing,
  type RecentlyViewedListing,
} from "@/lib/recently-viewed/local-recently-viewed";
import { Button } from "@/components/ui/button";

const VISIBLE_LIMIT = 10;

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function resolveVertical(value: string | null): ListingVertical | null {
  return value && isListingVertical(value) ? value : null;
}

function formatViewedAt(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : dateFormatter.format(parsed);
}

function formatPrice(
  price: string | number | null,
  currency: string | null,
): string | null {
  if (price === null || price === "") {
    return null;
  }

  const value = typeof price === "number" ? price : Number(price);
  if (!Number.isFinite(value)) {
    return null;
  }

  return `${value.toLocaleString("ru-RU")}${currency ? ` ${currency}` : ""}`;
}

export function RecentlyViewedPanel() {
  const [items, setItems] = useState<RecentlyViewedListing[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(getRecentlyViewedListings());
    setLoaded(true);
  }, []);

  function handleRemove(item: RecentlyViewedListing) {
    removeRecentlyViewedListing(item.id);
    setItems(getRecentlyViewedListings());
    trackRecentlyViewed("remove", {
      vertical: resolveVertical(item.vertical),
      hasPrice: formatPrice(item.price, item.currency) !== null,
    });
  }

  function handleClear() {
    if (!window.confirm("Очистить историю просмотров?")) {
      return;
    }

    clearRecentlyViewedListings();
    setItems([]);
    trackRecentlyViewed("clear");
  }

  function handleOpen(item: RecentlyViewedListing) {
    trackRecentlyViewed("open", {
      vertical: resolveVertical(item.vertical),
      hasPrice: formatPrice(item.price, item.currency) !== null,
    });
  }

  return (
    <section aria-labelledby="buyer-recently-viewed-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h2
          id="buyer-recently-viewed-title"
          className="text-lg font-bold text-[#0F172A] sm:text-xl"
        >
          Недавно просмотренные
        </h2>
        {items.length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 rounded-full px-3 text-[#64748B] hover:text-[#DC2626]"
          >
            Очистить историю
          </Button>
        ) : null}
      </div>

      {loaded && items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-10 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
            <Eye className="size-5" aria-hidden="true" />
          </div>
          <p className="mt-4 text-base font-semibold text-[#0F172A]">
            Вы пока не просматривали объявления
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-[#64748B]">
            Открытые объявления будут появляться здесь, чтобы к ним было легко вернуться.
          </p>
          <Button asChild className="mt-5 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Link href="/listings">Смотреть объявления</Link>
          </Button>
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
          <ul className="divide-y divide-[rgba(148,163,184,0.1)]">
            {items.slice(0, VISIBLE_LIMIT).map((item) => {
              const vertical = resolveVertical(item.vertical);
              const priceLabel = formatPrice(item.price, item.currency);
              const viewedLabel = formatViewedAt(item.viewedAt);

              return (
                <li
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5"
                >
                  <Link
                    href={item.url}
                    onClick={() => handleOpen(item)}
                    className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-[rgba(148,163,184,0.18)] bg-[#F1F5F9] sm:size-16"
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#94A3B8]">
                        <Package className="size-5" aria-hidden="true" />
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {vertical ? <VerticalListingBadge vertical={vertical} /> : null}
                      {viewedLabel ? (
                        <span className="text-xs text-[#94A3B8]">{viewedLabel}</span>
                      ) : null}
                    </div>
                    <Link
                      href={item.url}
                      onClick={() => handleOpen(item)}
                      className="mt-1 block truncate text-sm font-semibold text-[#0F172A] transition hover:text-[#2563EB]"
                    >
                      {item.title}
                    </Link>
                    <p className="truncate text-xs text-[#64748B]">
                      {priceLabel ? <span className="font-medium">{priceLabel}</span> : null}
                      {priceLabel && item.city ? " · " : null}
                      {item.city}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="hidden h-9 rounded-xl border-[rgba(148,163,184,0.25)] sm:inline-flex"
                    >
                      <Link href={item.url} onClick={() => handleOpen(item)}>
                        Открыть
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemove(item)}
                      className="h-9 rounded-xl px-2.5 text-[#94A3B8] hover:text-[#DC2626]"
                      aria-label={`Удалить «${item.title}» из истории`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
