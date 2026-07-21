"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const BRAND_LOGO_SRC = "/images/vsetut.png";

const iconSizeClasses = {
  header: "h-10 w-auto md:h-12 lg:h-14",
  footer: "h-8 w-auto md:h-9",
  default: "h-9 w-auto",
} as const;

const textSizeClasses = {
  header: "text-xl font-extrabold tracking-tight md:text-2xl lg:text-[26px]",
  footer: "text-lg font-extrabold tracking-tight md:text-xl",
  default: "text-xl font-extrabold tracking-tight",
} as const;

type BrandLogoVariant = keyof typeof iconSizeClasses;

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
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 md:gap-2.5",
        className,
      )}
    >
      <Image
        src={BRAND_LOGO_SRC}
        alt="Все тут"
        width={56}
        height={56}
        priority={priority}
        className={cn("object-contain", iconSizeClasses[variant])}
      />
      <span
        className={cn(
          "leading-none text-slate-900 dark:text-slate-100",
          textSizeClasses[variant],
        )}
      >
        Все тут
      </span>
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex shrink-0 items-center"
        aria-label="Все тут — на главную"
      >
        {logoContent}
      </Link>
    );
  }

  return <div className="flex shrink-0 items-center">{logoContent}</div>;
}
