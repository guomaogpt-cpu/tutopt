"use client";

import Link from "next/link";
import { CARGO_LANDING_DIRECTION_TILES } from "@/features/cargo/lib/cargo-landing-directions";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

export function CargoDirectionsSection() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="cargo-directions-heading" className="mt-6 sm:mt-8">
      <h2
        id="cargo-directions-heading"
        className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg"
      >
        {t("cargo.directionsTitle")}
      </h2>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-5">
        {CARGO_LANDING_DIRECTION_TILES.map((tile) => {
          const Icon = tile.icon;
          const href = `/listings?vertical=CARGO&q=${encodeURIComponent(tile.query)}`;
          return (
            <Link
              key={tile.id}
              href={href}
              className={cn(
                "flex min-h-[4.25rem] flex-col items-start gap-2 rounded-xl border border-slate-200 bg-white p-2.5",
                "shadow-sm transition hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/40",
                "sm:min-h-[4.5rem] sm:p-3",
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg",
                  tile.chipClassName,
                )}
              >
                <Icon className={cn("size-4", tile.iconClassName)} aria-hidden="true" />
              </span>
              <span className="line-clamp-2 text-xs font-semibold leading-snug text-slate-800 dark:text-slate-100 sm:text-[13px]">
                {t(tile.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
