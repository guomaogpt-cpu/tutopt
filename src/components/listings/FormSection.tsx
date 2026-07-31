import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Compact mobile spacing for create-listing flow. */
  dense?: boolean;
};

export function FormSection({
  title,
  description,
  children,
  className,
  dense = false,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:rounded-[22px]",
        dense ? "p-4 sm:p-6" : "p-5 sm:p-6",
        className,
      )}
    >
      <div className={cn(dense ? "mb-3.5 sm:mb-5" : "mb-5")}>
        <h2
          className={cn(
            "font-bold text-slate-900 dark:text-slate-100",
            dense ? "text-base sm:text-xl" : "text-lg sm:text-xl",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-1 leading-relaxed text-slate-500 dark:text-slate-400",
              dense ? "text-xs sm:text-sm" : "text-sm",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      <div className={cn(dense ? "space-y-4 sm:space-y-5" : "space-y-5")}>{children}</div>
    </section>
  );
}
