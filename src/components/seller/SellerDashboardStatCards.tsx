import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatItem = {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
};

type SellerDashboardStatCardsProps = {
  stats: StatItem[];
};

export function SellerDashboardStatCards({ stats }: SellerDashboardStatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 max-[359px]:grid-cols-1 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className={cn(
              "rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:rounded-3xl sm:p-5",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs leading-snug text-[#64748B] sm:text-sm">{stat.label}</p>
              </div>
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-11",
                  stat.iconClassName,
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
