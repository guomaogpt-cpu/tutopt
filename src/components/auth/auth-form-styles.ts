import { cn } from "@/lib/utils";

export const authInputClassName = cn(
  "h-11 w-full rounded-xl border border-[rgba(148,163,184,0.25)] bg-white px-4 text-sm text-[#0F172A]",
  "placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20",
);

export const authInputErrorClassName = "border-[#FECACA] focus:border-[#DC2626] focus:ring-[#FECACA]";

export const authButtonClassName = cn(
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white",
  "transition hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40",
  "disabled:cursor-not-allowed disabled:opacity-60",
);
