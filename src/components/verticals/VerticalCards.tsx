"use client";

import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ListingVertical } from "@prisma/client";
import {
  VERTICAL_LIST,
  type VerticalDefinition,
} from "@/features/verticals/verticals";
import { cn } from "@/lib/utils";

const VERTICAL_ICONS: Record<ListingVertical, LucideIcon> = {
  OPT: Package,
  MARKET: ShoppingBag,
  SERVICES: Wrench,
  CARGO: Truck,
};

const VERTICAL_CARD_STYLES: Record<
  ListingVertical,
  {
    activeBorder: string;
    activeBg: string;
    activeShadow: string;
    activeIcon: string;
    activeBadge: string;
    hoverBorder: string;
  }
> = {
  OPT: {
    activeBorder: "border-blue-300",
    activeBg: "bg-blue-100",
    activeShadow: "shadow-sm",
    activeIcon: "bg-white text-blue-600",
    activeBadge: "bg-blue-600 text-white",
    hoverBorder: "hover:border-blue-300",
  },
  MARKET: {
    activeBorder: "border-indigo-300",
    activeBg: "bg-indigo-100",
    activeShadow: "shadow-sm",
    activeIcon: "bg-white text-indigo-600",
    activeBadge: "bg-indigo-600 text-white",
    hoverBorder: "hover:border-indigo-300",
  },
  SERVICES: {
    activeBorder: "border-teal-300",
    activeBg: "bg-teal-100",
    activeShadow: "shadow-sm",
    activeIcon: "bg-white text-teal-700",
    activeBadge: "bg-teal-700 text-white",
    hoverBorder: "hover:border-teal-300",
  },
  CARGO: {
    activeBorder: "border-rose-300",
    activeBg: "bg-rose-100",
    activeShadow: "shadow-sm",
    activeIcon: "bg-white text-rose-600",
    activeBadge: "bg-rose-600 text-white",
    hoverBorder: "hover:border-rose-300",
  },
};

type VerticalCardsProps = {
  activeVertical?: ListingVertical | null;
  variant?: "cards" | "compact";
  showTitle?: boolean;
  className?: string;
};

export function VerticalCards({
  activeVertical = null,
  variant = "cards",
  showTitle = false,
  className,
}: VerticalCardsProps) {
  const compact = variant === "compact";

  return (
    <div className={cn("min-w-0", className)}>
      {showTitle ? (
        <div className="mb-4 max-w-2xl">
          <h2 className="text-base font-bold tracking-tight text-[#334155] sm:text-lg">
            Выберите направление
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-[#64748B] sm:text-[15px]">
            Товары, услуги и логистика разделены по понятным разделам.
          </p>
        </div>
      ) : null}

      <ul className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {VERTICAL_LIST.map((vertical) => (
          <li key={vertical.id} className="min-w-0">
            <VerticalCard
              vertical={vertical}
              isActive={activeVertical === vertical.id}
              compact={compact}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

type VerticalCardProps = {
  vertical: VerticalDefinition;
  isActive: boolean;
  compact: boolean;
};

function VerticalCard({ vertical, isActive, compact }: VerticalCardProps) {
  const Icon = VERTICAL_ICONS[vertical.id];
  const cardStyles = VERTICAL_CARD_STYLES[vertical.id];

  return (
    <Link
      href={vertical.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-white",
        "shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition duration-200",
        isActive
          ? cn(
              cardStyles.activeBorder,
              cardStyles.activeBg,
              cardStyles.activeShadow,
              cardStyles.hoverBorder,
            )
          : "border-[rgba(148,163,184,0.18)] hover:border-[rgba(148,163,184,0.35)]",
        compact ? "p-3.5" : "p-4",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            isActive ? cardStyles.activeIcon : "bg-[#F1F5F9] text-[#475569]",
          )}
        >
          <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-[#0F172A] sm:text-[15px]">
              {vertical.label}
            </span>
            {isActive ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  cardStyles.activeBadge,
                )}
              >
                Активно
              </span>
            ) : null}
            {!isActive && vertical.comingSoon ? (
              <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-medium text-[#64748B]">
                Скоро
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs leading-snug text-[#64748B] sm:text-[13px]">
            {vertical.homeCardDescription}
          </p>
        </div>
      </div>
    </Link>
  );
}
