"use client";

import Link from "next/link";
import {
  Briefcase,
  Megaphone,
  Package,
  Scissors,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SearchWithSuggest } from "@/components/search/SearchWithSuggest";
import { trackVerticalClick } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

type EntryCard = {
  id: "OPT" | "MARKET" | "SERVICES" | "CARGO";
  label: string;
  href: string;
  icon: LucideIcon;
  accentLine: string;
  iconWrap: string;
  iconColor: string;
};

const ENTRY_CARDS: EntryCard[] = [
  {
    id: "OPT",
    label: "Опт",
    href: "/opt",
    icon: Package,
    accentLine: "bg-violet-500",
    iconWrap: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    id: "MARKET",
    label: "Объявления",
    href: "/market",
    icon: Megaphone,
    accentLine: "bg-emerald-500",
    iconWrap: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "SERVICES",
    label: "Услуги",
    href: "/services",
    icon: Briefcase,
    accentLine: "bg-blue-500",
    iconWrap: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "CARGO",
    label: "Карго",
    href: "/cargo",
    icon: Truck,
    accentLine: "bg-orange-500",
    iconWrap: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

/**
 * Premium HTML/CSS paper entry for `/`.
 * PNG paper banner kept as reference, active layout is HTML/CSS for responsiveness.
 */
export function HomepagePaperEntry() {
  return (
    <section
      data-home-section="paper-entry"
      className={cn(
        "relative overflow-x-clip pb-2 pt-5 sm:pt-6 lg:pt-7",
        "bg-[#F8FAFC]",
      )}
      aria-labelledby="home-paper-heading"
    >
      {/* Soft ambient wash behind the board */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(148,163,184,0.18),transparent_62%)]"
        aria-hidden="true"
      />

      <Container size="lg" className="relative z-[1] max-w-[1280px]">
        <div className="relative mx-auto max-w-[1180px]">
          {/* Optional pin — desktop only */}
          <span
            className={cn(
              "pointer-events-none absolute left-1/2 top-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block",
              "size-3.5 rounded-full",
              "bg-[radial-gradient(circle_at_35%_30%,#93C5FD_0%,#2563EB_55%,#1D4ED8_100%)]",
              "shadow-[0_2px_6px_rgba(37,99,235,0.45),inset_0_1px_1px_rgba(255,255,255,0.55)]",
              "ring-2 ring-white/90",
            )}
            aria-hidden="true"
          />

          <div
            className={cn(
              "relative overflow-hidden rounded-[2px] border border-slate-200/70",
              "bg-[linear-gradient(165deg,#FFFFFF_0%,#FFFEFC_48%,#F8F7F4_100%)]",
              "shadow-[0_24px_70px_rgba(15,23,42,0.12),0_4px_14px_rgba(15,23,42,0.05)]",
            )}
          >
            {/* Top paper sheet — more vertical air */}
            <div className="flex flex-col gap-5 px-5 pb-10 pt-8 sm:gap-6 sm:px-8 sm:pb-12 sm:pt-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-11 lg:pb-14 lg:pt-12">
              <div className="min-w-0 max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Tutopt
                </p>
                <h1
                  id="home-paper-heading"
                  className="mt-2 text-[1.85rem] font-extrabold uppercase leading-[0.95] tracking-tight text-[#0F172A] sm:text-4xl lg:text-[2.6rem]"
                >
                  Объявления
                </h1>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#64748B] sm:text-[15px]">
                  Покупайте, продавайте, находите услуги
                </p>
              </div>

              <div className="w-full min-w-0 lg:max-w-[440px]">
                <SearchWithSuggest
                  id="home-paper-search"
                  variant="header"
                  placeholder="Поиск объявлений, услуг и компаний..."
                  buttonLabel="Найти"
                />
              </div>
            </div>

            {/* Perforation line — sits lower, after breathing room */}
            <div className="relative px-5 sm:px-8 lg:px-10" aria-hidden="true">
              <div className="border-t border-dashed border-slate-300/80" />
              <div className="pointer-events-none absolute inset-x-8 top-0 hidden -translate-y-1/2 justify-around sm:flex lg:inset-x-14">
                {ENTRY_CARDS.map((card) => (
                  <span
                    key={card.id}
                    className="inline-flex size-5 items-center justify-center rounded-full bg-[#FFFEFC] text-slate-400/90"
                  >
                    <Scissors className="size-3.5 rotate-90" strokeWidth={1.6} />
                  </span>
                ))}
              </div>
            </div>

            {/* Tear-off cards — separate hanging sheets with depth */}
            <div className="bg-[linear-gradient(180deg,rgba(248,250,252,0.55)_0%,rgba(255,255,255,0)_40%)] px-3 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5 lg:px-6 lg:pb-6 lg:pt-6">
              <ul
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4 lg:gap-4"
                aria-label="Направления"
              >
                {ENTRY_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <li key={card.id} className="min-w-0">
                      <Link
                        href={card.href}
                        onClick={() => {
                          trackVerticalClick(card.id, "homepage");
                        }}
                        className={cn(
                          "group relative flex h-full min-h-[132px] flex-col items-center justify-center overflow-hidden",
                          "rounded-[2px] border border-slate-200/70 bg-white/95 px-4 py-6 text-center",
                          "bg-[linear-gradient(180deg,#FFFFFF_0%,#FAFAF8_100%)]",
                          "shadow-[0_14px_36px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04)]",
                          "transition duration-200",
                          "hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(15,23,42,0.14),0_6px_16px_rgba(15,23,42,0.06)]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2",
                          "sm:min-h-[140px] sm:py-7 lg:min-h-[148px]",
                        )}
                      >
                        <span
                          className={cn(
                            "mb-3 flex size-11 items-center justify-center rounded-xl lg:size-12",
                            card.iconWrap,
                            card.iconColor,
                          )}
                          aria-hidden="true"
                        >
                          <Icon className="size-5 lg:size-[22px]" strokeWidth={1.75} />
                        </span>
                        <span className="text-[15px] font-bold tracking-tight text-[#0F172A] lg:text-base">
                          {card.label}
                        </span>
                        <span
                          className={cn(
                            "mt-3.5 h-[3px] w-10 rounded-full",
                            card.accentLine,
                          )}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
