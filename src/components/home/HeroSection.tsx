import Link from "next/link";
import { Container } from "@/components/ui/container";
import { HomeHeroSearch } from "@/components/home/HomeHeroSearch";
import {
  PLATFORM_HERO_BENEFITS,
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

      <div className="relative z-10 px-4 py-8 md:px-0 md:py-16 lg:py-20">
        <Container size="lg" className="min-w-0 px-0 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-col">
            <div className="min-w-0 max-w-[760px] text-white md:max-w-[860px]">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/75 sm:text-sm">
                Tutopt — объявления Кыргызстана
              </p>
              <h1
                className={cn(
                  "mt-2 text-[1.625rem] font-bold leading-[1.12] text-white",
                  "md:text-[42px] md:font-extrabold md:leading-[1.05] md:tracking-tight",
                  "max-w-[720px]",
                )}
              >
                Товары, услуги и логистика — на одной платформе
              </h1>
              <p
                className={cn(
                  "mt-2 max-w-[640px] text-[15px] leading-[1.45] text-white/[0.88]",
                  "md:mt-3 md:text-lg md:leading-normal",
                )}
              >
                Ищите товары, услуги, поставщиков и перевозчиков в понятных разделах.
              </p>

              <div className="mt-4 w-full min-w-0 md:mt-7">
                <HomeHeroSearch placeholder="Что вы ищете?" buttonLabel="Найти" />
              </div>

              <ul
                className={cn(
                  "mt-[18px] grid grid-cols-2 gap-x-3 gap-y-2",
                  "md:mt-5 md:flex md:flex-wrap md:gap-x-6 md:gap-y-2",
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

              <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
                {PLATFORM_QUICK_ENTRIES.map((entry) => (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className={cn(
                      "inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5",
                      "text-sm font-medium text-white backdrop-blur-sm transition",
                      "hover:border-white/40 hover:bg-white/20",
                    )}
                  >
                    {entry.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
