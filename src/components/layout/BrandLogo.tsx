"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const BRAND_LOGO_SRC = "/images/vsetut.png";

const variantSizeClasses = {
  header:
    "h-[52px] w-auto max-w-[min(55vw,180px)] sm:h-[60px] sm:max-w-[220px] md:h-[72px] md:max-w-[300px] lg:h-[84px] lg:max-w-[330px]",
  footer: "h-9 w-auto max-w-[140px] md:h-10 md:max-w-[160px]",
  default: "h-10 w-auto max-w-[160px]",
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
      width={330}
      height={84}
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
