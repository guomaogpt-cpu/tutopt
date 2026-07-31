import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthFormCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function AuthFormCard({ title, description, children, className }: AuthFormCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:rounded-[22px] sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
        className,
      )}
    >
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-100">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500 sm:mt-2 sm:text-base dark:text-slate-400">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

type AuthFormFieldProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
  error?: string;
};

export function AuthFormField({ label, htmlFor, children, hint, error }: AuthFormFieldProps) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-900 dark:text-slate-100"
      >
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  );
}

type AuthAlertProps = {
  variant: "error" | "success";
  messages: string[];
};

export function AuthAlert({ variant, messages }: AuthAlertProps) {
  if (messages.length === 0) {
    return null;
  }

  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        isError
          ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
          : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
      )}
    >
      <ul className="space-y-1">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
