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
        "rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
        className,
      )}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0F172A] dark:text-slate-100">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#64748B] sm:text-base dark:text-slate-400">{description}</p>
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
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-[#0F172A] dark:text-slate-100">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-[#64748B] dark:text-slate-400">{hint}</p> : null}
      {error ? <p className="text-sm text-[#DC2626]">{error}</p> : null}
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
          ? "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
          : "border-[#BBF7D0] bg-[#ECFDF5] text-[#047857] dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
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
