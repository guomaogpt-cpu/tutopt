import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section
      className={cn(
        "rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-6",
        className,
      )}
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#0F172A] sm:text-xl">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-[#64748B]">{description}</p>
        ) : null}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
