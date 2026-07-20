"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  formatListingsCount,
  getCategoryIcon,
} from "@/features/home/lib/category-icons";
import type { HomeCategoryCard } from "@/features/home/lib/home-data";
import { cn } from "@/lib/utils";

const MARQUEE_STYLE_ID = "category-title-marquee-keyframes";

function ensureMarqueeKeyframes() {
  if (typeof document === "undefined") {
    return;
  }

  if (document.getElementById(MARQUEE_STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = MARQUEE_STYLE_ID;
  style.textContent = `
    @keyframes category-title-marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-100%); }
    }
  `;
  document.head.appendChild(style);
}

function CategoryCardTitle({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    ensureMarqueeKeyframes();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) {
      return;
    }

    const measure = () => {
      setOverflows(textEl.scrollWidth > container.clientWidth);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text]);

  const showMarquee = hovered && overflows;

  return (
    <div
      ref={containerRef}
      className="max-w-[128px] overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        ref={textRef}
        title={text}
        className={cn(
          "block text-[13px] font-semibold leading-[1.2] text-[#334155]",
          showMarquee
            ? "inline-block whitespace-nowrap [animation:category-title-marquee_5s_linear_infinite]"
            : "truncate whitespace-nowrap",
        )}
      >
        {showMarquee ? `${text}\u00A0\u00A0\u00A0\u00A0` : text}
      </span>
    </div>
  );
}

type CategoryCarouselCardProps = {
  category: HomeCategoryCard;
};

export function CategoryCarouselCard({ category }: CategoryCarouselCardProps) {
  const Icon = getCategoryIcon(category.name, category.slug);
  const countLabel = formatListingsCount(category.listingsCount);
  const isEmpty = category.listingsCount === 0;

  return (
    <Link
      href={`/listings?category=${encodeURIComponent(category.id)}`}
      className="group/card block shrink-0 snap-start"
    >
      <div
        className={cn(
          "box-border flex h-[132px] w-[152px] shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.16)] bg-white p-2.5 text-center shadow-[0_4px_14px_rgba(15,23,42,0.04)]",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-1 hover:border-[rgba(37,99,235,0.28)] hover:shadow-[0_12px_24px_rgba(37,99,235,0.1)]",
          "sm:h-[140px] sm:w-[168px]",
        )}
      >
        <span
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB] transition group-hover/card:bg-[#DBEAFE]"
          aria-hidden="true"
        >
          <Icon className="size-7 sm:size-[30px]" strokeWidth={1.65} />
        </span>

        <CategoryCardTitle text={category.name} />

        <p
          className={cn(
            "max-w-[128px] truncate rounded-full px-2 py-0.5 text-center text-[11px] font-medium leading-[1.2] sm:text-xs",
            isEmpty ? "bg-[#F8FAFC] text-[#94A3B8]" : "bg-[#EFF6FF] text-[#2563EB]",
          )}
        >
          {countLabel}
        </p>
      </div>
    </Link>
  );
}
