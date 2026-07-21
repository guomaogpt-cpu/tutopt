"use client";

import Link from "next/link";
import {
  ArrowRight,
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
import {
  trackVerticalClick,
  type AnalyticsVerticalSource,
} from "@/lib/analytics/events";
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
    card: string;
    icon: string;
    badge: string;
    cta: string;
    activeRing: string;
  }
> = {
  OPT: {
    card: "border-blue-200/80 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300",
    icon: "bg-blue-100 text-blue-600",
    badge: "bg-blue-600 text-white",
    cta: "text-blue-700",
    activeRing: "ring-2 ring-blue-300",
  },
  MARKET: {
    card: "border-indigo-200/80 bg-gradient-to-br from-indigo-50 to-white hover:border-indigo-300",
    icon: "bg-indigo-100 text-indigo-600",
    badge: "bg-indigo-600 text-white",
    cta: "text-indigo-700",
    activeRing: "ring-2 ring-indigo-300",
  },
  SERVICES: {
    card: "border-teal-200/80 bg-gradient-to-br from-teal-50 to-white hover:border-teal-300",
    icon: "bg-teal-100 text-teal-700",
    badge: "bg-teal-700 text-white",
    cta: "text-teal-700",
    activeRing: "ring-2 ring-teal-300",
  },
  CARGO: {
    card: "border-rose-200/80 bg-gradient-to-br from-rose-50 to-white hover:border-rose-300",
    icon: "bg-rose-100 text-rose-600",
    badge: "bg-rose-600 text-white",
    cta: "text-rose-700",
    activeRing: "ring-2 ring-rose-300",
  },
};

type VerticalCardsProps = {
  activeVertical?: ListingVertical | null;
  variant?: "cards" | "compact";
  showTitle?: boolean;
  className?: string;
  trackingSource?: AnalyticsVerticalSource;
};

export function VerticalCards({
  activeVertical = null,
  variant = "cards",
  showTitle = false,
  className,
  trackingSource,
}: VerticalCardsProps) {
  const compact = variant === "compact";

  return (
    <div className={cn("min-w-0", className)}>
      {showTitle ? (
        <div className="mb-4 max-w-2xl sm:mb-5">
          <h2
            id="home-verticals-heading"
            className="text-lg font-bold tracking-tight text-[#0F172A] sm:text-xl"
          >
            Выберите, что вы ищете
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-[#64748B] sm:text-[15px]">
            Опт, розница, услуги и логистика — в понятных разделах платформы.
          </p>
        </div>
      ) : null}

      <ul
        className={cn(
          "grid min-w-0 gap-2.5 sm:gap-3",
          compact
            ? "grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {VERTICAL_LIST.map((vertical) => (
          <li key={vertical.id} className="min-w-0">
            <VerticalCard
              vertical={vertical}
              isActive={activeVertical === vertical.id}
              compact={compact}
              trackingSource={trackingSource}
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
  trackingSource?: AnalyticsVerticalSource;
};

function VerticalCard({ vertical, isActive, compact, trackingSource }: VerticalCardProps) {
  const Icon = VERTICAL_ICONS[vertical.id];
  const styles = VERTICAL_CARD_STYLES[vertical.id];

  if (compact) {
    return (
      <Link
        href={vertical.href}
        aria-current={isActive ? "page" : undefined}
        onClick={() => {
          if (trackingSource) {
            trackVerticalClick(vertical.id, trackingSource);
          }
        }}
        className={cn(
          "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border p-2.5 sm:p-3",
          "shadow-[0_4px_12px_rgba(15,23,42,0.03)] transition duration-200",
          "hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.07)]",
          styles.card,
          isActive && styles.activeRing,
        )}
      >
        <div className="flex items-start gap-2.5">
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg",
              styles.icon,
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[13px] font-semibold leading-tight text-[#0F172A] sm:text-sm">
                {vertical.label}
              </span>
              {isActive ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                    styles.badge,
                  )}
                >
                  Активно
                </span>
              ) : null}
              {!isActive && vertical.comingSoon ? (
                <span className="rounded-full bg-[#F1F5F9] px-1.5 py-0.5 text-[9px] font-medium text-[#64748B]">
                  Скоро
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[#64748B] sm:text-xs">
              {vertical.homeCardDescription}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={vertical.href}
      aria-current={isActive ? "page" : undefined}
      onClick={() => {
        if (trackingSource) {
          trackVerticalClick(vertical.id, trackingSource);
        }
      }}
      className={cn(
        "group relative flex h-full min-h-[168px] min-w-0 flex-col overflow-hidden rounded-2xl border p-5",
        "shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition duration-200",
        "hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(15,23,42,0.1)]",
        styles.card,
        isActive && styles.activeRing,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl",
            styles.icon,
          )}
        >
          <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </span>
        {vertical.comingSoon ? (
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-[#64748B] ring-1 ring-slate-200">
            Скоро
          </span>
        ) : null}
      </div>

      <div className="mt-4 min-w-0 flex-1">
        <p className="text-base font-bold text-[#0F172A]">{vertical.label}</p>
        <p className="mt-1.5 text-sm leading-snug text-[#64748B]">
          {vertical.homeCardDescription}
        </p>
      </div>

      <span
        className={cn(
          "mt-4 inline-flex items-center gap-1 text-sm font-semibold transition",
          "group-hover:gap-1.5",
          styles.cta,
        )}
      >
        Перейти
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
