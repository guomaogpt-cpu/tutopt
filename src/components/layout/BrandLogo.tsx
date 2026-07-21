"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * `public/images/vsetut.png` is a paper-banner mockup (1672×941), not a header logo.
 * Keep the file on disk for reference; do not use it in the header until a clean
 * wordmark export exists (transparent PNG ~400×120 or SVG, sign + text only).
 */
export const BRAND_LOGO_SRC = "/images/vsetut.png";

const variantSizeClasses = {
  header: "h-9 md:h-10",
  footer: "h-8 md:h-9",
  default: "h-9",
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
  variant = "default",
}: BrandLogoProps) {
  const logoContent = (
    <BrandLogoWordmark variant={variant} className={className} />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex shrink-0 items-center"
        aria-label="VseTut — на главную"
      >
        {logoContent}
      </Link>
    );
  }

  return <div className="flex shrink-0 items-center">{logoContent}</div>;
}

type BrandLogoWordmarkProps = {
  variant: BrandLogoVariant;
  className?: string;
};

function BrandLogoWordmark({ variant, className }: BrandLogoWordmarkProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center",
        variantSizeClasses[variant],
        className,
      )}
    >
      <span className="truncate text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
        VseTut
      </span>
    </span>
  );
}
