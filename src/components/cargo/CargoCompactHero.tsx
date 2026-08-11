"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { VERTICALS } from "@/features/verticals/verticals";
import { useTranslation } from "@/lib/i18n/useTranslation";

export const CARGO_HERO_BACKGROUND_IMAGE = "/images/tutkar.png";

type CargoCompactHeroProps = {
  onCreateRequest: () => void;
};

export function CargoCompactHero({ onCreateRequest }: CargoCompactHeroProps) {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[150px] overflow-hidden border-b border-orange-200/30 shadow-sm dark:border-slate-800 md:min-h-[220px] md:max-h-[260px]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("${CARGO_HERO_BACKGROUND_IMAGE}")`,
          backgroundPosition: "center right",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/25"
      />

      <div className="relative flex min-h-[150px] items-center px-4 py-4 md:min-h-[220px] md:max-h-[260px] md:px-0 md:py-6">
        <Container size="lg" className="min-w-0 px-0 sm:px-6 lg:px-8">
          <div className="flex w-full max-w-2xl min-w-0 flex-col gap-3">
            <div>
              <h1 className="text-xl font-bold leading-snug text-white drop-shadow-sm sm:text-2xl">
                {t("cargo.heroTitle")}
              </h1>
              <p className="mt-1.5 line-clamp-3 text-sm leading-snug text-white/85 sm:text-[15px]">
                {t("cargo.heroSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
              <Button
                type="button"
                onClick={onCreateRequest}
                className="h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]"
              >
                {t("cargo.createRequest")}
              </Button>
              <Button
                asChild
                className="h-11 w-full rounded-xl border border-white/40 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 active:scale-[0.98]"
              >
                <Link href={VERTICALS.CARGO.listingsHref}>{t("cargo.findCargoCompany")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
