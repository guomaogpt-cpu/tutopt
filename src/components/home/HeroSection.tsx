import Link from "next/link";
import { Container } from "@/components/ui/container";
import { HomeHeroSearch } from "@/components/home/HomeHeroSearch";
import {
  PLATFORM_HERO_BENEFITS,
  PLATFORM_HERO_PREVIEW_CARDS,
  PLATFORM_POPULAR_SEARCHES,
  PLATFORM_QUICK_ENTRIES,
} from "@/features/verticals/vertical-hero-content";
import {
  PLATFORM_HERO_GRADIENT,
  PLATFORM_HERO_OVERLAY,
} from "@/features/home/lib/hero-assets";
import type { HomePageStats } from "@/features/home/lib/home-data";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  stats: HomePageStats;
};

/** Temporarily hide hero stat cards; keep stats prop for existing page data flow. */
const SHOW_HERO_STATS = false;

export function HeroSection({ stats }: HeroSectionProps) {
  void stats;
  void SHOW_HERO_STATS;

  return (
    <section
      data-home-section="hero"
      className="relative isolate overflow-x-clip"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: PLATFORM_HERO_GRADIENT }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: PLATFORM_HERO_OVERLAY }}
        aria-hidden="true"
      />

      <div className="relative z-10 px-4 py-8 md:px-0 md:py-14 lg:py-16">
        <Container size="lg" className="min-w-0 px-0 sm:px-6 lg:px-8">
          <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
            <div className="min-w-0 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/75 sm:text-sm">
                Tutopt — объявления Кыргызстана
              </p>
              <h1
                className={cn(
                  "mt-2 text-[1.625rem] font-bold leading-[1.12] text-white",
                  "md:text-[40px] md:font-extrabold md:leading-[1.05] md:tracking-tight",
                  "max-w-[640px]",
                )}
              >
                Товары, услуги и логистика — на одной платформе
              </h1>
              <p
                className={cn(
                  "mt-2 max-w-[560px] text-[15px] leading-[1.45] text-white/[0.88]",
                  "md:mt-3 md:text-lg md:leading-normal",
                )}
              >
                Ищите товары, услуги, поставщиков и перевозчиков в понятных разделах.
              </p>

              <div className="mt-4 w-full min-w-0 md:mt-6">
                <HomeHeroSearch placeholder="Что вы ищете?" buttonLabel="Найти" />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
                <span className="text-xs font-medium text-white/70">Популярное:</span>
                {PLATFORM_POPULAR_SEARCHES.map((item) => (
                  <Link
                    key={item.q}
                    href={`/listings?q=${encodeURIComponent(item.q)}`}
                    className={cn(
                      "inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1",
                      "text-xs font-medium text-white/90 backdrop-blur-sm transition",
                      "hover:border-white/40 hover:bg-white/20",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2.5 md:mt-6">
                {PLATFORM_QUICK_ENTRIES.map((entry) => {
                  const Icon = entry.icon;
                  return (
                    <Link
                      key={entry.id}
                      href={entry.href}
                      className={cn(
                        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-3.5 py-2.5",
                        "text-sm font-semibold backdrop-blur-md transition duration-200",
                        "hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.18)]",
                        entry.pillClassName,
                      )}
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-white/15">
                        <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      {entry.label}
                    </Link>
                  );
                })}
              </div>

              <ul
                className={cn(
                  "mt-5 grid grid-cols-2 gap-x-3 gap-y-2",
                  "md:mt-6 md:flex md:flex-wrap md:gap-x-5 md:gap-y-2",
                )}
              >
                {PLATFORM_HERO_BENEFITS.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className={cn(
                      "flex min-w-0 items-start gap-1.5 text-xs leading-tight text-white/[0.86]",
                      "md:items-center md:whitespace-nowrap md:text-sm md:text-white/[0.88]",
                    )}
                  >
                    <Icon
                      className="mt-0.5 size-3.5 shrink-0 text-white/75 md:mt-0 md:size-4"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span className="line-clamp-2 md:line-clamp-none">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="relative mx-auto hidden w-full max-w-md lg:block"
              aria-hidden="true"
            >
              <div className="absolute -left-6 top-8 size-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -right-4 bottom-4 size-48 rounded-full bg-indigo-300/20 blur-3xl" />

              <div className="relative grid gap-3">
                {PLATFORM_HERO_PREVIEW_CARDS.map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.title}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3.5 shadow-[0_12px_32px_rgba(15,23,42,0.18)] backdrop-blur-md",
                        "bg-gradient-to-r",
                        card.tintClassName,
                        index === 1 && "translate-x-4",
                        index === 2 && "-translate-x-2",
                        index === 3 && "translate-x-3",
                      )}
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                        <Icon className="size-5" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{card.title}</p>
                        <span
                          className={cn(
                            "mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                            card.badgeClassName,
                          )}
                        >
                          {card.badge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
