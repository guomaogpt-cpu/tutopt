"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Canonical site logo (square mark). */
export const BRAND_LOGO_SRC = "/logos/vsetut-logo-new.png";

const variantSizeClasses = {
  header:
    "h-12 w-auto max-w-[48px] sm:h-[52px] sm:max-w-[52px] md:h-16 md:max-w-[64px] lg:h-[80px] lg:max-w-[80px]",
  footer: "h-9 w-auto max-w-[36px] md:h-10 md:max-w-[40px]",
  default: "h-10 w-auto max-w-[40px]",
} as const;

type BrandLogoVariant = keyof typeof variantSizeClasses;

type BrandLogoProps = {
  className?: string;
  href?: string | null;
  priority?: boolean;
  variant?: BrandLogoVariant;
  /** Show «ВСЁ ТУТ» wordmark next to the icon (header brand block). */
  showWordmark?: boolean;
};

export function BrandLogo({
  className,
  href = "/",
  priority = false,
  variant = "default",
  showWordmark = false,
}: BrandLogoProps) {
  const logoContent = (
    <>
      <Image
        src={BRAND_LOGO_SRC}
        alt=""
        width={1024}
        height={1024}
        priority={priority}
        aria-hidden={showWordmark}
        className={cn("object-contain", variantSizeClasses[variant], className)}
      />
      {showWordmark ? (
        <span
          className={cn(
            "whitespace-nowrap font-black uppercase leading-none text-[#111827] dark:text-slate-100",
            "hidden min-[360px]:inline",
            "tracking-[0.035em]",
            variant === "header"
              ? "text-[15px] sm:text-base md:text-lg lg:text-[1.35rem]"
              : "text-sm",
          )}
        >
          ВСЁ ТУТ
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "flex min-w-0 shrink-0 items-center",
          showWordmark && "gap-1",
        )}
        aria-label="ВСЁ ТУТ — на главную"
      >
        {logoContent}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center",
        showWordmark && "gap-1",
      )}
    >
      {logoContent}
    </div>
  );
}
