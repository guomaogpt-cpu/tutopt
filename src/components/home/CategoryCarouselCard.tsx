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
          "box-border flex h-[124px] w-[148px] shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.58)] p-2 text-center backdrop-blur-[14px]",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-0.5 hover:border-[rgba(37,99,235,0.28)] hover:bg-[rgba(255,255,255,0.78)]",
          "sm:h-[132px] sm:w-[168px]",
        )}
      >
        <span
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(37,99,235,0.08)] text-[#2563EB]"
          aria-hidden="true"
        >
          <Icon className="size-7 sm:size-[30px]" strokeWidth={1.65} />
        </span>

        <CategoryCardTitle text={category.name} />

        <p
          className={cn(
            "max-w-[128px] truncate text-center text-[11px] font-normal leading-[1.2] sm:text-xs",
            isEmpty ? "text-[#94A3B8]" : "text-[#64748B]",
          )}
        >
          {countLabel}
        </p>
      </div>
    </Link>
  );
}
