"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Canonical site logo (square mark). */
export const BRAND_LOGO_SRC = "/logos/vsetut-logo-new.png";

const variantSizeClasses = {
  header:
    "h-10 w-auto max-w-[40px] sm:h-11 sm:max-w-[44px] md:h-14 md:max-w-[56px] lg:h-16 lg:max-w-[64px]",
  footer: "h-9 w-auto max-w-[36px] md:h-10 md:max-w-[40px]",
  default: "h-10 w-auto max-w-[40px]",
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
  const logoContent = (
    <Image
      src={BRAND_LOGO_SRC}
      alt="ВсеТут"
      width={1024}
      height={1024}
      priority={priority}
      className={cn("object-contain", variantSizeClasses[variant], className)}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex min-w-0 shrink-0 items-center"
        aria-label="ВсеТут — на главную"
      >
        {logoContent}
      </Link>
    );
  }

  return <div className="flex shrink-0 items-center">{logoContent}</div>;
}
