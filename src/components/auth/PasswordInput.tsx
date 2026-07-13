"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authInputClassName } from "@/components/auth/auth-form-styles";
import { cn } from "@/lib/utils";

type PasswordInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  hasError?: boolean;
};

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "Введите пароль",
  autoComplete = "current-password",
  disabled = false,
  hasError = false,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={isVisible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={cn(
          authInputClassName,
          "pr-11",
          hasError && "border-[#FECACA] focus:border-[#DC2626] focus:ring-[#FECACA]",
        )}
      />
      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#64748B] transition hover:text-[#0F172A] disabled:opacity-50"
        aria-label={isVisible ? "Скрыть пароль" : "Показать пароль"}
      >
        {isVisible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
