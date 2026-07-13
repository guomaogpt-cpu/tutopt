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
        "rounded-[28px] border border-[rgba(148,163,184,0.18)] bg-gradient-to-br from-white to-[#EFF6FF] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-8",
        className,
      )}
    >
      <BrandLogo variant="footer" className="sm:max-w-[180px]" />

      <h1 className="mt-6 text-2xl font-bold leading-tight text-[#0F172A] sm:text-3xl">
        Оптовая торговля в Кыргызстане
      </h1>

      <p className="mt-3 hidden text-sm leading-relaxed text-[#64748B] sm:block sm:text-base">
        Находите поставщиков, публикуйте товары и получайте заявки от покупателей.
      </p>

      <ul className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:flex-col sm:gap-3">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <li
              key={benefit.title}
              className="inline-flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.14)] bg-white/80 px-3 py-2 text-xs font-medium text-[#334155] sm:w-full sm:px-4 sm:py-3 sm:text-sm"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
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

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-10">
          <AuthBrandPanel className="lg:sticky lg:top-24" />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}
