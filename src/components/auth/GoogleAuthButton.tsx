"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buildGoogleStartHref } from "@/features/auth/lib/auth-client";

type GoogleAuthButtonProps = {
  enabled: boolean;
  role?: "BUYER" | "SELLER";
  next?: string;
  disabled?: boolean;
  className?: string;
};

export function GoogleAuthButton({
  enabled,
  role,
  next = "/",
  disabled = false,
  className,
}: GoogleAuthButtonProps) {
  if (!enabled) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled
          className={cn(
            "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-400",
            className,
          )}
        >
          <GoogleMark />
          Продолжить с Google
        </button>
        <p className="text-center text-xs text-[#64748B]">
          Google-вход будет доступен после настройки
        </p>
      </div>
    );
  }

  return (
    <Link
      href={buildGoogleStartHref({ role, next })}
      aria-disabled={disabled}
      className={cn(
        "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#0F172A] transition hover:bg-slate-50",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      <GoogleMark />
      Продолжить с Google
    </Link>
  );
}

export function AuthDivider({ label = "или" }: { label?: string }) {
  return (
    <div className="relative my-1 flex items-center gap-3" role="separator" aria-label={label}>
      <div className="h-px flex-1 bg-slate-200" />
      <span className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">{label}</span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.8-4.1 2.8-7 0-.7-.1-1.3-.2-1.9H12z"
      />
      <path
        fill="#34A853"
        d="M6.6 14.3l-.5.4-2.7 2.1C5.1 19.6 8.3 21.6 12 21.6c2.7 0 5-.9 6.7-2.5l-3.1-2.4c-.9.6-2 1-3.6 1-2.8 0-5.1-1.9-6-4.4z"
      />
      <path
        fill="#4A90E2"
        d="M3.4 7.2C2.5 9 2 11 2 13.2c0 2.1.5 4.1 1.4 5.9l3.2-2.5C6.2 15.4 6 14.3 6 13.2c0-1.1.2-2.2.6-3.2L3.4 7.2z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.4c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.5 14.7 1.6 12 1.6 8.3 1.6 5.1 3.6 3.4 7.2l3.2 2.5C7 7.3 9.2 5.4 12 5.4z"
      />
    </svg>
  );
}
