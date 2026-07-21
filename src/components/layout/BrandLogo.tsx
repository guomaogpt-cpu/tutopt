"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const BRAND_LOGO_SRC = "/images/vsetut.png";

const variantSizeClasses = {
  header: "h-9 max-h-10 w-auto max-w-[140px] md:h-10 md:max-w-[160px]",
  footer: "h-8 w-auto max-w-[140px] md:h-9 md:max-w-[150px]",
  default: "h-9 w-auto max-w-[140px]",
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
      alt="VseTut"
      width={160}
      height={40}
      priority={priority}
      className={cn("object-contain", variantSizeClasses[variant], className)}
    />
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
