import {
  BadgePercent,
  Handshake,
  Package,
  ShieldCheck,
  Store,
  TrendingUp,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { HomeHeroSearch } from "@/components/home/HomeHeroSearch";
import {
  HERO_BACKGROUND_IMAGE,
  HERO_OVERLAY_GRADIENT,
  HERO_OVERLAY_GRADIENT_MOBILE,
} from "@/features/home/lib/hero-assets";
import type { HomePageStats } from "@/features/home/lib/home-data";
import { cn } from "@/lib/utils";

const BENEFITS: { icon: LucideIcon; label: string }[] = [
  { icon: Truck, label: "Прямые поставщики" },
  { icon: BadgePercent, label: "Выгодные цены" },
  { icon: ShieldCheck, label: "Проверенные продавцы" },
  { icon: Handshake, label: "Без посредников" },
];

type HeroSectionProps = {
  stats: HomePageStats;
};

function formatStatValue(value: number): string {
  return value.toLocaleString("ru-RU");
}

type HeroStatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  variant: "desktop" | "mobile";
};

function HeroStatCard({ label, value, icon: Icon, variant }: HeroStatCardProps) {
  if (variant === "mobile") {
    return (
      <div
        className={cn(
          "flex h-[76px] min-w-0 flex-col justify-between rounded-2xl border border-white/22 p-2.5",
          "bg-[rgba(255,255,255,0.14)] backdrop-blur-[12px]",
        )}
      >
        <Icon className="size-3.5 text-white/90" strokeWidth={1.75} aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-xl font-bold leading-none text-white">{formatStatValue(value)}</p>
          <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-white/85">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-[82px] w-full flex-col justify-between rounded-[18px] border border-white/24 px-4 py-3.5",
        "bg-[rgba(255,255,255,0.16)] backdrop-blur-[12px]",
      )}
    >
      <Icon className="size-[18px] text-white/90" strokeWidth={1.75} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[26px] font-bold leading-none text-white">{formatStatValue(value)}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-white/85">{label}</p>
      </div>
    </div>
  );
}

export function HeroSection({ stats }: HeroSectionProps) {
  const statCards = [
    { label: "Товаров", value: stats.listingsCount, icon: Package },
    { label: "Поставщиков", value: stats.sellersCount, icon: Store },
    { label: "Активных объявлений", value: stats.listingsCount, icon: TrendingUp },
  ] as const;

  return (
    <section
      data-home-section="hero"
      className={cn(
        "relative overflow-hidden bg-cover bg-center",
        "px-4 py-7 pb-8",
        "md:h-[320px] md:px-0 md:py-0 lg:h-[330px]",
      )}
      style={{
        backgroundImage: `url("${HERO_BACKGROUND_IMAGE}")`,
      }}
    >
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: HERO_OVERLAY_GRADIENT_MOBILE }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden md:block"
        style={{ background: HERO_OVERLAY_GRADIENT }}
        aria-hidden="true"
      />

      <Container size="lg" className="relative h-full min-w-0 px-0 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex min-w-0 flex-col",
            "md:grid md:h-full md:grid-cols-[minmax(0,1fr)_280px] md:items-center md:gap-12",
            "lg:grid-cols-[minmax(0,1fr)_300px]",
          )}
        >
          <div className="min-w-0 max-w-[760px] text-white">
            <h1
              className={cn(
                "text-[1.625rem] font-bold leading-[1.12] text-white",
                "md:text-[42px] md:font-extrabold md:leading-[1.05] md:tracking-tight",
                "max-w-[720px]",
              )}
            >
              Оптовые товары Кыргызстана
            </h1>
            <p
              className={cn(
                "mt-2 max-w-[720px] text-[15px] leading-[1.45] text-white/[0.86]",
                "md:mt-3 md:text-lg md:leading-normal md:text-white/[0.88]",
              )}
            >
              Находите поставщиков напрямую и развивайте свой бизнес.
            </p>

            <div className="mt-4 w-full min-w-0 md:mt-7">
              <HomeHeroSearch />
            </div>

            <ul
              className={cn(
                "mt-[18px] grid grid-cols-2 gap-x-3 gap-y-2",
                "md:mt-5 md:flex md:flex-wrap md:gap-x-6 md:gap-y-2",
              )}
            >
              {BENEFITS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className={cn(
                    "flex min-w-0 items-start gap-1.5 text-xs leading-tight text-white/[0.82]",
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

          <div className="mt-5 min-w-0 md:hidden">
            <div className="grid grid-cols-3 gap-2">
              {statCards.map((item) => (
                <HeroStatCard
                  key={`mobile-${item.label}`}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                  variant="mobile"
                />
              ))}
            </div>
          </div>

          <div className="hidden min-w-0 flex-col gap-3 md:flex md:w-[280px] lg:w-[300px]">
            {statCards.map((item) => (
              <HeroStatCard
                key={item.label}
                label={item.label}
                value={item.value}
                icon={item.icon}
                variant="desktop"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
