"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const BRAND_LOGO_SRC = "/images/vsetut.png";

const variantSizeClasses = {
  header: "h-10 w-auto max-w-[120px] md:h-12 md:max-w-[140px] lg:h-14 lg:max-w-[160px]",
  footer: "h-9 w-auto max-w-[110px] md:h-10 md:max-w-[120px]",
  default: "h-10 w-auto max-w-[120px]",
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
      width={160}
      height={56}
      priority={priority}
      className={cn("object-contain", variantSizeClasses[variant], className)}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex shrink-0 items-center"
        aria-label="ВсеТут — на главную"
      >
        {logoContent}
      </Link>
    );
  }

  return <div className="flex shrink-0 items-center">{logoContent}</div>;
}
