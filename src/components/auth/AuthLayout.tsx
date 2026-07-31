import type { ReactNode } from "react";
import { Package, Search, Send } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: Package,
    title: "Оптовые объявления",
  },
  {
    icon: Send,
    title: "Прямые заявки поставщикам",
  },
  {
    icon: Search,
    title: "Каталог для бизнеса",
  },
] as const;

export function AuthBrandPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:shadow-none",
        className,
      )}
    >
      <BrandLogo variant="footer" className="h-12 max-w-[48px] sm:h-14 sm:max-w-[56px]" />

      <h1 className="mt-6 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl dark:text-slate-100">
        Оптовая торговля в Кыргызстане
      </h1>

      <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base dark:text-slate-400">
        Находите поставщиков, публикуйте товары и получайте заявки от покупателей.
      </p>

      <ul className="mt-6 flex flex-col gap-3 sm:mt-8">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <li
              key={benefit.title}
              className="inline-flex w-full items-center gap-2 rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-slate-900 dark:text-blue-300">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              {benefit.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type AuthLayoutProps = {
  children: ReactNode;
};

/**
 * Auth shell: compact logo on mobile, full brand panel from lg up.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-w-0 overflow-x-clip bg-[#F5F7FA] py-4 dark:bg-slate-950 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6">
        <div className="mb-4 flex justify-center lg:hidden">
          <BrandLogo variant="footer" className="h-11 max-w-[44px]" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:items-start lg:gap-10">
          <AuthBrandPanel className="hidden lg:sticky lg:top-24 lg:block" />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}
