"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const BRAND_LOGO_SRC = "/images/tutvse.jpeg";
/** Prefer tutvse.png when available; jpeg is current active until PNG is added. */
/** Previous logo kept on disk at /images/tutopt-logo.png (not deleted). */

const variantSizeClasses = {
  header: "h-9 w-auto md:h-10",
  footer: "h-8 w-auto md:h-9",
  default: "h-9 w-auto",
} as const;

type BrandLogoVariant = keyof typeof variantSizeClasses;

type BrandLogoProps = {
  className?: string;
  href?: string | null;
  priority?: boolean;
  variant?: BrandLogoVariant;
};

export function BrandLogo({
  className,
  href = "/",
  priority = false,
  variant = "default",
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  const logoContent = imageError ? (
    <BrandLogoFallback variant={variant} className={className} />
  ) : (
    <Image
      src={BRAND_LOGO_SRC}
      alt="Tutopt"
      width={170}
      height={44}
      priority={priority}
      className={cn("w-auto object-contain", variantSizeClasses[variant], className)}
      onError={() => setImageError(true)}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex shrink-0 items-center"
        aria-label="Tutopt — на главную"
      >
        {logoContent}
      </Link>
    );
  }

  return <div className="flex shrink-0 items-center">{logoContent}</div>;
}

type BrandLogoFallbackProps = {
  variant: BrandLogoVariant;
  className?: string;
};

function BrandLogoFallback({ variant, className }: BrandLogoFallbackProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 sm:gap-2",
        variantSizeClasses[variant],
        className,
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white sm:h-9 sm:w-9">
        T
      </span>
      <span className="truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-xl">
        Tutopt
      </span>
    </span>
  );
}
