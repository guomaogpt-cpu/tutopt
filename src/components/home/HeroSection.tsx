import Link from "next/link";
import { Container } from "@/components/ui/container";
import { HomeHeroSearch } from "@/components/home/HomeHeroSearch";
import {
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

export function HeroSection({ stats }: HeroSectionProps) {
  void stats;

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

      <div className="relative z-10 px-4 py-6 md:px-0 md:py-8 lg:py-9">
        <Container size="lg" className="min-w-0 px-0 sm:px-6 lg:px-8">
          <div className="grid min-w-0 items-center gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.7fr)] lg:gap-8">
            <div className="min-w-0 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70 sm:text-xs">
                ВсеТут — объявления Кыргызстана
              </p>
              <h1
                className={cn(
                  "mt-1.5 text-[1.5rem] font-bold leading-[1.15] text-white",
                  "md:text-[34px] md:font-extrabold md:leading-[1.08] md:tracking-tight",
                  "max-w-[560px]",
                )}
              >
                Товары, услуги и логистика — на одной платформе
              </h1>
              <p className="mt-2 max-w-[480px] text-sm leading-relaxed text-white/[0.88] md:text-[15px]">
                Ищите товары, услуги, поставщиков и перевозчиков в понятных разделах.
              </p>

              <div className="mt-3.5 w-full min-w-0 md:mt-4">
                <HomeHeroSearch placeholder="Что вы ищете?" buttonLabel="Найти" />
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span className="text-[11px] font-medium text-white/65">Популярное:</span>
                {PLATFORM_POPULAR_SEARCHES.map((item) => (
                  <Link
                    key={item.q}
                    href={`/listings?q=${encodeURIComponent(item.q)}`}
                    className={cn(
                      "inline-flex items-center rounded-full border border-white/18 bg-white/10 px-2 py-0.5",
                      "text-[11px] font-medium text-white/85 transition",
                      "hover:border-white/35 hover:bg-white/18",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-3.5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
                {PLATFORM_QUICK_ENTRIES.map((entry) => {
                  const Icon = entry.icon;
                  return (
                    <Link
                      key={entry.id}
                      href={entry.href}
                      className={cn(
                        "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl px-3",
                        "text-[13px] font-semibold backdrop-blur-sm transition",
                        "hover:bg-white/25",
                        entry.pillClassName,
                      )}
                    >
                      <Icon className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                      {entry.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div
              className="mx-auto hidden w-full max-w-[320px] lg:block"
              aria-hidden="true"
            >
              <div className="grid grid-cols-2 gap-2.5">
                {PLATFORM_HERO_PREVIEW_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.title}
                      className={cn(
                        "flex aspect-square flex-col items-start justify-between rounded-[20px]",
                        "border border-white/20 bg-white/12 p-3.5 backdrop-blur-sm",
                      )}
                    >
                      <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 text-white">
                        <Icon className="size-4" strokeWidth={1.75} />
                      </span>
                      <p className="text-[13px] font-semibold leading-snug text-white">
                        {card.title}
                      </p>
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
