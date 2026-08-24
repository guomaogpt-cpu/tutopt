"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Canonical site logo (square mark). */
export const BRAND_LOGO_SRC = "/logos/vsetut-logo-new.png";

const variantSizeClasses = {
  header:
    "h-11 w-auto max-w-[44px] sm:h-12 sm:max-w-[48px] md:h-[60px] md:max-w-[60px] lg:h-[72px] lg:max-w-[72px]",
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
            "whitespace-nowrap font-extrabold uppercase tracking-[0.06em] text-slate-900 dark:text-slate-100",
            "hidden min-[360px]:inline",
            variant === "header"
              ? "text-sm sm:text-base md:text-lg lg:text-xl"
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
          showWordmark && "gap-1.5 sm:gap-2",
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
        showWordmark && "gap-1.5 sm:gap-2",
      )}
    >
      {logoContent}
    </div>
  );
}
