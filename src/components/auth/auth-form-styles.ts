import { cn } from "@/lib/utils";

export const authInputClassName = cn(
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 sm:h-11 sm:text-sm",
  "placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20",
  "dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500",
);

export const authInputErrorClassName =
  "border-red-200 focus:border-red-600 focus:ring-red-200 dark:border-red-900";

export const authButtonClassName = cn(
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white sm:h-11",
  "transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40",
  "disabled:cursor-not-allowed disabled:opacity-60",
);
